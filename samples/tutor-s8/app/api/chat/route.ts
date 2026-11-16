import Anthropic from '@anthropic-ai/sdk';
import { checkAccess } from '@/lib/access';
import { take, MINUTE, DAY } from '@/lib/rate-limit';
import { tutorConfig } from '@/lib/tutor-config';
import { buildSystemPrompt } from '@/lib/tutor-prompt';

// ─────────────────────────────────────────────────────────────
// 대화 서버 (이 파일은 서버에서만 실행됩니다)
//
// 학생 화면이 보낸 대화를 받아 → 아래 다섯 가지를 차례로 확인하고 → Claude API를 불러
// 답변을 글자가 만들어지는 대로 흘려보냅니다(스트리밍).
//
//   ① 수업 코드가 맞는가                 (lib/access.ts)
//   ② 대화 길이·메시지 길이가 제한 안인가
//   ③ 서버에 API 키가 있는가
//   ④ 너무 자주 보내지 않았는가           (lib/rate-limit.ts)
//   ⑤ AI 답변 분량 제한(max_tokens)
//
// 대화 내용은 어디에도 저장하지 않습니다. 서버 기록(로그)에도 본문을 남기지 않습니다.
// API 키(ANTHROPIC_API_KEY)와 수업 코드(CLASS_CODE)는 이 서버에서만 읽습니다.
// ─────────────────────────────────────────────────────────────

export const runtime = 'nodejs';
export const maxDuration = 60; // 답변 하나에 쓸 수 있는 최대 시간(초)

const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-5-5';
const SYSTEM = buildSystemPrompt(tutorConfig);
const { limits } = tutorConfig;
const MAX_REPLY_CHARS = 4000; // 화면이 되돌려 보내는 AI 답변 한 개의 최대 길이

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function fail(error: string, status: number, retryAfterSec = 0) {
  return Response.json({ error }, { status, headers: retryAfterSec ? { 'Retry-After': String(retryAfterSec) } : undefined });
}

/** 화면이 보낸 대화가 약속한 모양인지 확인한다. 문제가 있으면 안내 문장을, 없으면 정리된 대화를 돌려준다 */
function readMessages(input: unknown): { error: string } | { messages: ChatMessage[] } {
  if (!Array.isArray(input) || input.length === 0) return { error: '질문을 입력해 주세요.' };
  if (input.length % 2 === 0) return { error: '대화 형식이 올바르지 않아요. [대화 초기화]를 누르고 다시 시작해 주세요.' };
  const messages: ChatMessage[] = [];
  for (let i = 0; i < input.length; i++) {
    const m = input[i] as { role?: unknown; content?: unknown };
    const role = i % 2 === 0 ? 'user' : 'assistant'; // 학생 → 도우미 → 학생 … 순서여야 한다
    if (m?.role !== role || typeof m.content !== 'string' || !m.content.trim()) {
      return { error: '대화 형식이 올바르지 않아요. [대화 초기화]를 누르고 다시 시작해 주세요.' };
    }
    if (role === 'user' && m.content.length > limits.messageChars) {
      return { error: `메시지가 너무 길어요. ${limits.messageChars}자 안으로 줄여 주세요.` };
    }
    if (role === 'assistant' && m.content.length > MAX_REPLY_CHARS) {
      return { error: '대화 형식이 올바르지 않아요. [대화 초기화]를 누르고 다시 시작해 주세요.' };
    }
    messages.push({ role, content: m.content });
  }
  const turns = Math.ceil(messages.length / 2);
  if (turns > limits.turnsPerChat) {
    return { error: `이 대화에서는 질문 ${limits.turnsPerChat}번을 다 썼어요. [대화 초기화]를 누르고 새로 시작해 주세요.` };
  }
  return { messages };
}

/** Claude API 오류를 학생이 읽을 수 있는 한국어 안내로 바꾼다 */
function apiError(e: unknown) {
  // 오류 기록에는 대화 내용을 남기지 않는다 (오류 종류만)
  console.error('[chat]', e instanceof Error ? e.name : 'unknown error');
  if (e instanceof Anthropic.AuthenticationError) return fail('서버의 API 키가 올바르지 않아요. 선생님께 알려 주세요.', 500);
  if (e instanceof Anthropic.PermissionDeniedError) return fail('서버의 API 키로는 이 모델을 쓸 수 없어요. 선생님께 알려 주세요.', 500);
  if (e instanceof Anthropic.NotFoundError) return fail('서버의 모델 설정이 올바르지 않아요. 선생님께 알려 주세요.', 500);
  if (e instanceof Anthropic.RateLimitError) return fail('지금 사용하는 사람이 많아요. 잠시 뒤에 다시 물어봐 주세요.', 429);
  // Console에서 정해 둔 사용 한도에 닿았을 때도 이쪽으로 온다
  if (e instanceof Anthropic.BadRequestError) return fail('지금은 도우미를 쓸 수 없어요. 선생님께 알려 주세요. (사용 한도 또는 설정 확인 필요)', 503);
  if (e instanceof Anthropic.APIConnectionError) return fail('AI 서버에 연결하지 못했어요. 잠시 뒤에 다시 물어봐 주세요.', 502);
  if (e instanceof Anthropic.APIError) return fail('AI 서버에 문제가 생겼어요. 잠시 뒤에 다시 물어봐 주세요.', 502);
  return fail('답변을 만들지 못했어요. 잠시 뒤에 다시 물어봐 주세요.', 500);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: unknown; visitor?: unknown; messages?: unknown };

  // ① 수업 코드 확인 (매 요청마다 서버에서)
  const access = checkAccess(req, body.code);
  if (!access.ok) return fail(access.error, access.status);

  // ② 대화 모양과 길이 확인
  const parsed = readMessages(body.messages);
  if ('error' in parsed) return fail(parsed.error, 400);

  // ③ API 키 확인
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fail('서버에 ANTHROPIC_API_KEY가 설정되지 않았어요. 선생님께 알려 주세요.', 500);

  // ④ 요청 횟수 제한 (앞의 확인을 통과한 요청만 횟수로 센다)
  // 학교에서는 한 교실이 같은 인터넷 주소(IP)를 쓰는 일이 많아, 주소만으로 세면 반 전체가 한 사람으로 묶인다.
  // 그래서 "주소 + 브라우저 창마다 만든 임의 번호"로 한 학생을 어림잡는다. 이 번호는 이름이 아니며 저장하지 않는다.
  // (번호는 화면이 보내는 값이라 마음먹으면 바꿀 수 있다. 그래서 앱 전체 하루 제한을 한 겹 더 둔다.)
  const visitor = typeof body.visitor === 'string' && /^[a-zA-Z0-9-]{8,64}$/.test(body.visitor) ? body.visitor : 'unknown';
  const who = `${access.ip}:${visitor}`;
  const perMinute = take(`minute:${who}`, limits.perMinute, MINUTE);
  if (!perMinute.ok) return fail(`조금 천천히 물어봐 주세요. ${perMinute.retryAfterSec}초 뒤에 다시 보낼 수 있어요.`, 429, perMinute.retryAfterSec);
  const perDay = take(`day:${who}`, limits.perDay, DAY);
  if (!perDay.ok) return fail('오늘 쓸 수 있는 횟수를 다 썼어요. 내일 다시 만나요.', 429, perDay.retryAfterSec);
  const total = take('day:everyone', limits.totalPerDay, DAY);
  if (!total.ok) return fail('오늘은 도우미 사용량이 다 찼어요. 선생님께 알려 주세요.', 429, total.retryAfterSec);

  // ⑤ Claude API 호출 (스트리밍). 분량은 max_tokens로 제한한다
  const anthropic = new Anthropic({ apiKey });
  const stream = anthropic.messages.stream(
    {
      model: MODEL,
      max_tokens: limits.maxTokens, // 답변 분량의 상한선. 생각하는 분량도 여기에 포함된다
      output_config: { effort: tutorConfig.effort },
      system: SYSTEM,
      messages: parsed.messages,
    },
    { signal: req.signal }, // 학생이 창을 닫으면 AI 호출도 멈춘다
  );

  // 스트림에서 "글자" 조각만 골라낸다 (생각 블록 등 다른 조각은 화면에 보내지 않는다)
  async function* textChunks() {
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') yield event.delta.text;
    }
  }
  const chunks = textChunks();

  // 첫 글자가 올 때까지 기다린다. 키 오류·한도 초과 같은 문제는 여기서 드러나므로 한국어 안내로 바꿔 돌려줄 수 있다
  let first: IteratorResult<string, void>;
  try {
    first = await chunks.next();
  } catch (e) {
    return apiError(e);
  }

  const encoder = new TextEncoder();
  const text = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (s: string) => controller.enqueue(encoder.encode(s));
      try {
        if (!first.done) {
          send(first.value);
          for await (const chunk of chunks) send(chunk);
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') {
          // 모델의 안전장치가 답변을 멈춘 경우
          send(`${first.done ? '' : '\n\n'}이 내용은 도와줄 수 없어요. ${tutorConfig.unit} 단원에서 궁금한 것을 물어봐 주세요.`);
        } else if (final.stop_reason === 'max_tokens') {
          send(`${first.done ? '' : '\n\n'}(답변이 길어져 여기서 끊겼어요. 이어서 물어봐 주세요.)`);
        } else if (first.done) {
          send('답변을 만들지 못했어요. 다시 한 번 물어봐 주세요.');
        }
      } catch (e) {
        console.error('[chat] stream', e instanceof Error ? e.name : 'unknown error');
        try {
          send('\n\n(연결이 끊겼어요. 다시 물어봐 주세요.)');
        } catch {
          // 학생이 이미 창을 닫은 경우: 보낼 곳이 없으므로 그냥 끝낸다
        }
      }
      try {
        controller.close();
      } catch {
        // 이미 닫힌 경우
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
