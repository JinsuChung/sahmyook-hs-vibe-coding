'use client';
import { useEffect, useRef, useState } from 'react';
import type { PublicConfig } from '@/lib/tutor-config';

// ─────────────────────────────────────────────────────────────
// 학생 화면: 수업 코드 입력 → 채팅
//
// 대화는 이 화면의 메모리(상태)에만 있습니다. 서버에도, 브라우저 저장소에도 남기지 않습니다.
// 그래서 창을 닫거나 새로 고치면 대화와 수업 코드가 모두 사라집니다.
// ─────────────────────────────────────────────────────────────

type Message = { role: 'user' | 'assistant'; content: string };

const NOTICE = 'AI가 만든 답변이며 틀릴 수 있어요. 이름·연락처 같은 개인정보는 쓰지 마세요.';

export function Tutor({ config }: { config: PublicConfig }) {
  const [code, setCode] = useState('');
  const [entered, setEntered] = useState(false);

  if (!entered) return <Gate config={config} code={code} setCode={setCode} onEnter={() => setEntered(true)} />;
  return (
    <Chat
      config={config}
      code={code}
      onKickOut={() => {
        setEntered(false);
        setCode('');
      }}
    />
  );
}

/** 첫 화면: 수업 코드 입력 */
function Gate({
  config,
  code,
  setCode,
  onEnter,
}: {
  config: PublicConfig;
  code: string;
  setCode: (v: string) => void;
  onEnter: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <main className="gate">
      <form
        className="gate-card"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          try {
            const res = await fetch('/api/enter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });
            if (res.ok) return onEnter();
            const data = await res.json().catch(() => null);
            setError(data?.error ?? '들어가지 못했어요. 잠시 뒤 다시 시도해 주세요.');
          } catch {
            setError('서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.');
          }
          setBusy(false);
        }}
      >
        <h1>{config.appName}</h1>
        <p className="unit">
          {config.grade} {config.subject} · {config.unit}
        </p>
        <label htmlFor="class-code">수업 코드</label>
        <input
          id="class-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="선생님이 알려 준 코드를 입력하세요"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={100}
          required
        />
        <button type="submit" disabled={busy || !code.trim()}>
          {busy ? '확인하는 중…' : '들어가기'}
        </button>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <p className="fine">{NOTICE}</p>
      </form>
    </main>
  );
}

/** 채팅 화면 */
function Chat({ config, code, onKickOut }: { config: PublicConfig; code: string; onKickOut: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const bottom = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  // 요청 횟수를 셀 때 쓰는 임의 번호. 이름이 아니며, 창을 닫으면 사라진다
  const [visitor] = useState(() => `v-${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`);

  const turnsUsed = messages.filter((m) => m.role === 'user').length;
  const turnsLeft = config.turnsPerChat - turnsUsed;

  // 새 글이 오면 맨 아래로 내린다
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' });
  }, [messages, busy]);

  async function send(textToSend: string) {
    const question = textToSend.trim();
    if (!question || busy || turnsLeft <= 0) return;
    const history = messages;
    const next: Message[] = [...history, { role: 'user', content: question }];
    setMessages(next);
    setInput('');
    setError('');
    setBusy(true);
    abort.current = new AbortController();

    /** 실패했을 때: 방금 보낸 질문을 대화에서 빼고 입력칸에 되돌려 놓는다 */
    const undo = (message: string) => {
      setMessages(history);
      setInput(question);
      setError(message);
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, visitor, messages: next }),
        signal: abort.current.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        if (res.status === 401) {
          // 수업 코드가 바뀌었거나 틀린 경우: 첫 화면으로 돌아간다
          onKickOut();
          return;
        }
        undo(data?.error ?? '답변을 받지 못했어요. 잠시 뒤 다시 물어봐 주세요.');
        return;
      }
      // 답변을 글자가 오는 대로 화면에 이어 붙인다 (스트리밍)
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...next, { role: 'assistant', content: reply }]);
      }
      if (!reply.trim()) undo('답변을 받지 못했어요. 다시 한 번 물어봐 주세요.');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return; // [대화 초기화]로 멈춘 경우
      undo('연결이 끊겼어요. 인터넷 연결을 확인하고 다시 물어봐 주세요.');
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    if (messages.length > 0 && !confirm('지금까지의 대화가 지워져요. 새로 시작할까요?')) return;
    abort.current?.abort();
    setMessages([]);
    setInput('');
    setError('');
  }

  const last = messages[messages.length - 1];
  const waiting = busy && last?.role === 'user';

  return (
    <div className="chat">
      <header className="top">
        <div>
          <h1>{config.appName}</h1>
          <p className="unit">
            {config.grade} {config.subject} · {config.unit}
          </p>
        </div>
        <button type="button" className="ghost" onClick={reset}>
          대화 초기화
        </button>
      </header>

      <details className="goals">
        <summary>이 단원의 학습 목표</summary>
        <ul>
          {config.goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </details>

      <p className="notice">{NOTICE} 대화는 저장되지 않아요. 창을 닫거나 새로 고치면 사라져요.</p>

      <section className="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="empty">
            <p>
              <b>무엇이 궁금한가요?</b>
              <br />
              답을 바로 알려 주기보다, 스스로 풀 수 있게 질문으로 도와줄게요. 어디까지 생각했는지 함께 적어 주면 더 좋아요.
            </p>
            <div className="starters">
              {config.starters.map((starter) => (
                <button key={starter} type="button" className="chip" onClick={() => send(starter)} disabled={busy}>
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <span className="who">{m.role === 'user' ? '나' : '도우미'}</span>
            {m.content}
          </div>
        ))}
        {waiting && (
          <div className="bubble assistant thinking">
            <span className="who">도우미</span>
            생각하는 중…
          </div>
        )}
        <div ref={bottom} />
      </section>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {turnsLeft <= 0 ? (
          <p className="notice">
            이 대화에서는 질문 {config.turnsPerChat}번을 다 썼어요. [대화 초기화]를 누르면 새로 시작할 수 있어요.
          </p>
        ) : (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter로 보내기, Shift+Enter로 줄 바꿈. 한글을 조합하는 중에는 보내지 않는다
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="질문이나 내 풀이를 적어 보세요"
              aria-label="질문 입력"
              rows={2}
              maxLength={config.messageChars}
            />
            <div className="send-row">
              <span className="count">
                남은 질문 {turnsLeft}번 · {input.length}/{config.messageChars}자
              </span>
              <button type="submit" disabled={busy || !input.trim()}>
                {busy ? '답하는 중…' : '보내기'}
              </button>
            </div>
          </>
        )}
        <p className="help">
          힘든 일이 있으면 혼자 고민하지 말고 담임 선생님이나 상담 선생님께 이야기하세요. 청소년상담전화 1388
        </p>
      </form>
    </div>
  );
}
