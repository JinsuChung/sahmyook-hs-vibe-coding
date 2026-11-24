'use client';
import { useMemo, useState } from 'react';
import { Sparkles, Thermometer, Ticket, Highlighter } from 'lucide-react';
import { useStored } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { CopyButton } from '@/components/prompt/copy-button';
import { usePrintMode } from '@/lib/print-mode';
import { PrintPlaceholder } from '@/components/ui/print-placeholder';

/**
 * "내 수업 사이트 만들기"(/remix)의 맛보기 부품들.
 * 예시 작품: 김소월 「진달래꽃」(1925년 『진달래꽃』 수록, 작가 1934년 사망으로 저작권 보호 기간 끝남)
 */
const POEM: string[][] = [
  ['나 보기가 역겨워', '가실 때에는', '말없이 고이 보내 드리우리다'],
  ['영변에 약산', '진달래꽃', '아름 따다 가실 길에 뿌리우리다'],
  ['가시는 걸음 걸음', '놓인 그 꽃을', '사뿐히 즈려밟고 가시옵소서'],
  ['나 보기가 역겨워', '가실 때에는', '죽어도 아니 눈물 흘리우리다'],
];

function DemoShell({ icon: Icon, title, hint, children }: { icon: typeof Sparkles; title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border-2 border-fd-primary/15">
      <div className="flex flex-wrap items-center gap-2 border-b bg-fd-secondary/40 px-4 py-2.5">
        <span className="rounded-full bg-fd-primary px-2 py-0.5 text-[11px] font-bold text-fd-primary-foreground">학생 화면 맛보기</span>
        <Icon className="size-4 text-fd-primary" />
        <span className="font-semibold">{title}</span>
        <span className="w-full text-sm text-fd-muted-foreground">{hint}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ---------------- 1. 시어 고르기 ---------------- */
export function WordPicker() {
  const print = usePrintMode();
  const [picked, setPicked] = useStored<string[]>('remix:words', []);
  if (print.on) return <PrintPlaceholder kind="활동" title="시어 고르기" />;
  const toggle = (k: string) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const words = picked.map((k) => {
    const [s, l, w] = k.split('-').map(Number);
    return POEM[s][l].split(' ')[w];
  });
  return (
    <DemoShell icon={Highlighter} title="시어 고르기 · 마음에 걸리는 말 세 개" hint="낱말을 눌러 표시해 보세요. 질문 중심 수업이라면 고른 낱말이 짝과 나눌 질문의 출발점이 됩니다.">
      <div className="grid gap-4 sm:grid-cols-2">
        {POEM.map((stanza, s) => (
          <div key={s} className="rounded-xl bg-fd-muted/50 p-3 leading-8">
            <p className="mb-1 text-xs font-semibold text-fd-muted-foreground">{s + 1}연</p>
            {stanza.map((line, l) => (
              <p key={l}>
                {line.split(' ').map((w, i) => {
                  const k = `${s}-${l}-${i}`;
                  const on = picked.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggle(k)}
                      className={cn('mr-1 rounded px-0.5 transition-colors', on ? 'bg-[#ffe08a] font-semibold text-[#5a4200]' : 'hover:bg-fd-accent')}
                    >
                      {w}
                    </button>
                  );
                })}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border px-3 py-2 text-[0.95rem] leading-7">
        {words.length === 0 ? (
          <span className="text-fd-muted-foreground">아직 고른 낱말이 없어요.</span>
        ) : (
          <>
            <b>내가 고른 시어 {words.length}개</b> · {words.join(', ')}
            {words.length >= 3 && <p className="text-fd-muted-foreground">짝에게 물어보기: “나는 「{words[0]}」에서 멈췄어. 너는 어디서 멈췄어? 왜?”</p>}
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-fd-muted-foreground">김소월 「진달래꽃」(1925). 작가가 1934년에 세상을 떠나 저작권 보호 기간이 끝난 작품입니다.</p>
    </DemoShell>
  );
}

/* ---------------- 2. 감정 온도계 ---------------- */
export function FeelingMeter() {
  const print = usePrintMode();
  const [vals, setVals] = useStored<{ out: number; inn: number }[]>('remix:feel', POEM.map(() => ({ out: 5, inn: 5 })));
  if (print.on) return <PrintPlaceholder kind="활동" title="감정 온도계" />;
  const gaps = vals.map((v) => Math.abs(v.out - v.inn));
  const maxGap = Math.max(...gaps);
  const at = gaps.indexOf(maxGap);
  const set = (i: number, key: 'out' | 'inn', n: number) => setVals((v) => v.map((x, j) => (j === i ? { ...x, [key]: n } : x)));
  return (
    <DemoShell icon={Thermometer} title="감정 온도계 · 겉으로 하는 말과 속마음" hint="연마다 두 값을 0–10으로 골라 보세요. 차이가 가장 큰 곳에서 질문이 떠오릅니다. 개념(반어)을 설명하기 전에 학생이 먼저 발견하게 하는 장치입니다.">
      <div className="grid gap-3">
        {vals.map((v, i) => (
          <div key={i} className="grid items-center gap-x-3 gap-y-1 sm:grid-cols-[3rem_1fr_1fr]">
            <span className="text-sm font-semibold">{i + 1}연</span>
            {(['out', 'inn'] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <span className="w-14 shrink-0 text-fd-muted-foreground">{key === 'out' ? '겉말' : '속마음'}</span>
                <input type="range" min={0} max={10} value={v[key]} onChange={(e) => set(i, key, Number(e.target.value))} className="flex-1 accent-[var(--color-fd-primary)]" />
                <span className="w-5 text-right tabular-nums">{v[key]}</span>
              </label>
            ))}
            <div className="flex h-3 gap-1 sm:col-start-2 sm:col-end-4" aria-hidden>
              <div className="rounded bg-[#7fb3ff]" style={{ width: `${v.out * 5}%` }} />
              <div className="rounded bg-[#ff9b85]" style={{ width: `${v.inn * 5}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl border px-3 py-2 text-[0.95rem] leading-7">
        {maxGap >= 4 ? (
          <>
            <b>{at + 1}연</b>에서 겉말과 속마음의 차이가 가장 커요({maxGap}). <b>여기서 반어가 일어나는 걸까요?</b> 그렇게 생각한 시어를 하나 골라 근거로 적어 보세요.
          </>
        ) : (
          <span className="text-fd-muted-foreground">파랑은 겉으로 하는 말, 주황은 속마음이에요. 두 값이 크게 벌어지는 연을 찾아보세요.</span>
        )}
      </p>
    </DemoShell>
  );
}

/* ---------------- 3. 출구 카드 ---------------- */
export function ExitTicket() {
  const print = usePrintMode();
  const [t, setT] = useStored<{ learned: string; wonder: string; line: string }>('remix:exit', { learned: '', wonder: '', line: '' });
  const [done, setDone] = useState(false);
  if (print.on) return <PrintPlaceholder kind="활동" title="출구 카드" />;
  const fields = [
    ['learned', '오늘 새로 알게 된 것 한 가지'],
    ['wonder', '아직 궁금한 것 한 가지'],
    ['line', '이 시를 한 줄로 말한다면'],
  ] as const;
  const ready = fields.every(([k]) => t[k].trim());
  return (
    <DemoShell icon={Ticket} title="출구 카드 · 수업 끝 3분" hint="이름 칸이 없습니다. 이 맛보기는 내 브라우저에만 저장되고, 반 전체가 모아 보려면 데이터베이스가 필요합니다(아래 프롬프트).">
      <div className="grid gap-3">
        {fields.map(([k, label]) => (
          <label key={k} className="grid gap-1 text-sm">
            <span className="font-medium">{label}</span>
            <input
              value={t[k]}
              onChange={(e) => {
                setDone(false);
                setT({ ...t, [k]: e.target.value });
              }}
              className="rounded-lg border bg-fd-background px-3 py-2 text-[0.95rem] outline-none focus:ring-2 focus:ring-fd-ring"
            />
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!ready}
          onClick={() => setDone(true)}
          className="rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40"
        >
          제출(맛보기)
        </button>
        {done && <span className="text-sm text-[var(--color-ok)]">받았어요. 실제 사이트라면 선생님 화면의 보드에 익명으로 올라갑니다.</span>}
      </div>
    </DemoShell>
  );
}

/* ---------------- 4. 수업 레시피: 교수법 × 인터랙션 → 프롬프트 ---------------- */
const METHODS = [
  { id: 'question', label: '질문 중심(하브루타)', rule: '해석을 먼저 말해 주지 않는다. 모든 활동은 학생이 질문을 만들고 짝과 주고받는 것으로 시작한다.' },
  { id: 'flipped', label: '거꾸로 수업', rule: '개념 설명은 집에서 미리 보는 자료로 옮기고, 수업 시간은 확인 퀴즈와 모둠 활동에 쓴다.' },
  { id: 'jigsaw', label: '협동학습(직소)', rule: '모둠원마다 다른 연을 맡아 전문가 모둠에서 깊이 읽고, 원래 모둠으로 돌아가 가르친다.' },
  { id: 'lecture', label: '설명식 + 형성평가', rule: '짧게 설명하고 바로 확인한다. 설명 10분마다 형성평가 한 번, 틀린 문항은 그 자리에서 다시 설명한다.' },
  { id: 'project', label: '프로젝트·창작', rule: '감상의 결과를 작품으로 낸다. 패러디 시, 시화, 낭송 영상처럼 학생이 만든 것이 평가의 중심이다.' },
] as const;

const INTERACTIONS = [
  { id: 'words', label: '시어 고르기', desc: '마음에 걸리는 낱말을 눌러 표시하고 짝과 비교' },
  { id: 'meter', label: '감정 온도계', desc: '연마다 겉말과 속마음을 골라 그래프로' },
  { id: 'qcard', label: '질문 만들기 카드', desc: '사실·해석·평가 질문을 하나씩 쓰고 짝과 교환' },
  { id: 'quiz', label: '형성평가 퀴즈', desc: '이미 있는 퀴즈 부품(객관식·OX·순서)' },
  { id: 'roles', label: '모둠 역할 뽑기', desc: '사회자·기록자·발표자·질문자를 무작위로' },
  { id: 'debate', label: '찬반 보드', desc: '“화자는 정말 보내 줄 수 있을까?” 찬반과 근거' },
  { id: 'exit', label: '출구 카드', desc: '오늘 알게 된 것, 궁금한 것, 한 줄 감상' },
  { id: 'tutor', label: '질문하는 AI 튜터', desc: '답 대신 질문으로 이끄는 감상 도우미(8회차)' },
] as const;

const STORE = [
  { id: 'none', label: '저장 안 함', text: '학생이 입력한 내용은 저장하지 않는다(새로 고치면 사라짐).' },
  { id: 'local', label: '학생 브라우저에만', text: '학생이 입력한 내용은 그 학생의 브라우저에만 저장한다. 서버로 보내지 않는다.' },
  { id: 'class', label: '반 전체 공유(DB)', text: '학생 답은 Supabase에 모으되 이름 대신 수업 코드와 번호로만 받고, 교사만 전체를 보고 지울 수 있게 한다(RLS).' },
] as const;

export function LessonRecipe() {
  const print = usePrintMode();
  const [s, setS] = useStored<{ unit: string; minutes: string; method: string; picks: string[]; store: string; mine: string }>('remix:recipe', {
    unit: '김소월 「진달래꽃」으로 읽는 시의 화자와 반어 (고1 국어)',
    minutes: '50',
    method: 'question',
    picks: ['words', 'meter', 'exit'],
    store: 'local',
    mine: '',
  });
  const prompt = useMemo(() => {
    const m = METHODS.find((x) => x.id === s.method) ?? METHODS[0];
    const st = STORE.find((x) => x.id === s.store) ?? STORE[1];
    const acts = INTERACTIONS.filter((x) => s.picks.includes(x.id));
    return [
      `${s.unit} 수업의 ${s.minutes}분짜리 1차시 페이지를 만들어 줘.`,
      `내 교수법: ${m.label}. ${m.rule}${s.mine.trim() ? ` 그리고 ${s.mine.trim()}` : ''}`,
      `학생 활동 부품: ${acts.map((a) => `${a.label}(${a.desc})`).join(', ') || '(아직 고르지 않음)'}. 이 저장소에 이미 있는 부품은 고쳐 쓰고, 없는 것은 다른 페이지에서도 한 줄로 쓸 수 있는 부품으로 새로 만들어.`,
      `저장: ${st.text}`,
      '학생 이름 같은 개인정보는 받지 않는다. 작품 본문은 저작권이 끝난 것만 싣고 출처를 적는다. 휴대폰에서도 쓰기 편하게 만든다.',
      '먼저 차시 흐름(도입·전개·정리)과 각 장면에 들어갈 부품을 표로 보여 주고, 내가 승인하면 만들어. 다 만들면 내 PC에서 띄워 주소를 알려 줘.',
    ].join('\n');
  }, [s]);

  if (print.on) return <PrintPlaceholder kind="도구" title="수업 레시피 만들기" />;
  const toggle = (id: string) => setS({ ...s, picks: s.picks.includes(id) ? s.picks.filter((x) => x !== id) : [...s.picks, id] });

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-fd-primary/20">
      <div className="flex items-center gap-2 border-b bg-fd-secondary/40 px-4 py-2.5">
        <Sparkles className="size-4 text-fd-primary" />
        <span className="font-semibold">수업 레시피 · 교수법과 활동을 고르면 프롬프트가 만들어져요</span>
      </div>
      <div className="grid gap-4 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">단원</span>
            <input value={s.unit} onChange={(e) => setS({ ...s, unit: e.target.value })} className="rounded-lg border bg-fd-background px-3 py-2 outline-none focus:ring-2 focus:ring-fd-ring" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">차시(분)</span>
            <input value={s.minutes} onChange={(e) => setS({ ...s, minutes: e.target.value })} inputMode="numeric" className="rounded-lg border bg-fd-background px-3 py-2 outline-none focus:ring-2 focus:ring-fd-ring" />
          </label>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">내 교수법 (하나)</legend>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setS({ ...s, method: m.id })}
                aria-pressed={s.method === m.id}
                className={cn('rounded-full border px-3 py-1.5 text-sm', s.method === m.id ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent')}
              >
                {m.label}
              </button>
            ))}
          </div>
          <input
            value={s.mine}
            onChange={(e) => setS({ ...s, mine: e.target.value })}
            placeholder="내 방식 한 줄 더하기 (예: 수업은 늘 낭독으로 시작한다)"
            className="mt-2 w-full rounded-lg border bg-fd-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fd-ring"
          />
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">학생 활동 부품 (여러 개)</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {INTERACTIONS.map((a) => {
              const on = s.picks.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggle(a.id)}
                  aria-pressed={on}
                  className={cn('rounded-xl border px-3 py-2 text-left text-sm', on ? 'border-fd-primary bg-fd-primary/10' : 'hover:bg-fd-accent')}
                >
                  <span className="font-semibold">{on ? '✓ ' : ''}{a.label}</span>
                  <span className="block text-fd-muted-foreground">{a.desc}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">학생이 입력한 내용은</legend>
          <div className="flex flex-wrap gap-2">
            {STORE.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setS({ ...s, store: x.id })}
                aria-pressed={s.store === x.id}
                className={cn('rounded-full border px-3 py-1.5 text-sm', s.store === x.id ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent')}
              >
                {x.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="rounded-xl border bg-fd-card">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-2">
            <span className="text-xs font-bold tracking-wide text-fd-primary">완성된 프롬프트</span>
            <CopyButton text={prompt} size="sm" />
          </div>
          <p className="whitespace-pre-wrap px-4 py-3 text-[0.98rem] font-medium leading-7">{prompt}</p>
        </div>
      </div>
    </div>
  );
}
