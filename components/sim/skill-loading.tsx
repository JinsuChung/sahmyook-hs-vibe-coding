'use client';
import { useEffect, useState } from 'react';
import { BookOpen, FileText, Play, StepForward } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame, Terminal } from './frame';

type SkillId = 'home-letter' | 'doc-digest' | 'record-check';

/** 교무수첩 폴더의 .claude/skills/ 아래에 있는 스킬 세 개 (본문은 줄여 쓴 예시) */
const SKILLS: { id: SkillId; label: string; description: string; body: string[] }[] = [
  {
    id: 'home-letter',
    label: '가정통신문 초안',
    description: '가정통신문 초안을 씁니다. 학부모 안내문, 행사·체험학습 안내를 써 달라고 할 때 사용합니다.',
    body: [
      '양식/ 폴더의 가정통신문 양식을 읽는다',
      '학사일정_2026-2.csv에서 날짜를 확인한다',
      '양식에 맞춰 초안을 쓴다 (학생 개인정보는 넣지 않는다)',
      '보낸문서/ 폴더에 저장하고, 교사가 확인할 곳을 표시한다',
    ],
  },
  {
    id: 'doc-digest',
    label: '공문 요약',
    description: '받은 공문을 요약해 할 일과 기한을 표로 정리합니다. 공문 정리·요약을 부탁할 때 사용합니다.',
    body: [
      '받은공문/ 폴더의 문서를 모두 읽는다',
      '문서마다 세 줄로 요약한다',
      '할 일·담당·기한을 표로 만든다',
      '기한이 적혀 있지 않으면 "기한 없음"으로 적고 지어내지 않는다',
    ],
  },
  {
    id: 'record-check',
    label: '생기부 문구 점검',
    description: '학교생활기록부 문구 초안의 글자 수(바이트)와 기재하면 안 되는 표현을 점검할 때 사용합니다.',
    body: [
      '생기부_초안/ 폴더의 파일을 읽는다',
      'scripts/byte_count.py를 실행해 바이트 수를 계산한다',
      '기재요령 요약과 대조해 고칠 표현을 표시한다',
      '문구는 고치지 않고 점검표만 만든다 (최종 판단은 교사)',
    ],
  },
];

type Req = { text: string; skill: SkillId | null; direct?: boolean; cue?: string };
const REQUESTS: Req[] = [
  { text: '체험학습 안내 가정통신문 써 줘', skill: 'home-letter', cue: '"체험학습 안내", "가정통신문"' },
  { text: '받은 공문 정리해 줘', skill: 'doc-digest', cue: '"받은 공문", "정리"' },
  { text: '/record-check', skill: 'record-check', direct: true },
  { text: '오늘 급식 뭐야?', skill: null },
];

type LogLine = { k: 'you' | 'tool' | 'ai' | 'sys'; t: string };

function linesFor(req: Req): LogLine[] {
  if (!req.skill) {
    return [
      { k: 'you', t: `> ${req.text}` },
      { k: 'tool', t: '● 스킬 설명 세 줄과 요청을 맞춰 보는 중…\n  home-letter ✗  doc-digest ✗  record-check ✗' },
      { k: 'sys', t: '맞는 스킬이 없습니다. 본문은 하나도 읽지 않습니다.' },
      { k: 'ai', t: '스킬 없이 평소처럼 답합니다: 이 폴더에는 급식표가 없어서 알려 드릴 수 없습니다. 급식표 파일을 넣어 주시면 찾아보겠습니다.' },
    ];
  }
  const s = SKILLS.find((x) => x.id === req.skill)!;
  const others = SKILLS.filter((x) => x.id !== s.id)
    .map((x) => `${x.id} ✗`)
    .join('  ');
  return [
    { k: 'you', t: `> ${req.text}` },
    req.direct
      ? { k: 'sys', t: `/${s.id} — 이름으로 직접 불렀습니다. 설명과 맞춰 볼 필요 없이 바로 이 스킬로 갑니다.` }
      : { k: 'tool', t: `● 스킬 설명 세 줄과 요청을 맞춰 보는 중…\n  ${s.id} ✓ (${req.cue})  ${others}` },
    { k: 'tool', t: `● ${s.id} 스킬의 본문(SKILL.md)을 지금 읽어 옵니다` },
    { k: 'tool', t: `● 본문의 절차대로 작업 중…\n${s.body.map((b, i) => `  ${i + 1}. ${b}`).join('\n')}` },
    { k: 'ai', t: `${s.label} 작업을 마쳤습니다. 나머지 두 스킬의 본문은 끝까지 읽지 않았습니다.` },
  ];
}

export function SkillLoading() {
  const [pick, setPick] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);

  const req = pick === null ? null : REQUESTS[pick];
  const lines = req ? linesFor(req) : [];
  const max = lines.length;
  const done = req !== null && step >= max;

  useEffect(() => {
    if (!auto) return;
    if (step >= max) {
      setAuto(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [auto, step, max]);

  const choose = (i: number) => {
    setPick(i);
    setStep(1);
    setAuto(false);
  };
  const reset = () => {
    setPick(null);
    setStep(0);
    setAuto(false);
  };

  /** 카드 상태: 설명만 올라와 있음 → 고름 → 본문 읽음 */
  const stateOf = (id: SkillId): 'idle' | 'matched' | 'loaded' | 'skipped' => {
    if (!req || step < 2) return 'idle';
    if (req.skill !== id) return 'skipped';
    return step >= 3 ? 'loaded' : 'matched';
  };
  const loaded = req?.skill && step >= 3 ? SKILLS.find((s) => s.id === req.skill) : undefined;

  return (
    <SimFrame
      title="스킬이 불리는 순간"
      desc="교무수첩 폴더에는 스킬이 세 개 있습니다. 요청을 하나 고르고 [다음]을 누르며, 에이전트가 어떤 스킬의 본문을 언제 읽는지 보세요."
      onReset={reset}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_1.25fr]">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-fd-muted-foreground">대화를 시작할 때부터 올라와 있는 것: 이름과 설명 한 줄</p>
          <ul className="space-y-2">
            {SKILLS.map((s) => {
              const st = stateOf(s.id);
              return (
                <li
                  key={s.id}
                  className={cn(
                    'rounded-xl border bg-fd-background p-3 transition-all duration-300',
                    (st === 'matched' || st === 'loaded') && 'border-fd-primary ring-2 ring-fd-primary/30',
                    st === 'skipped' && 'opacity-50',
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded bg-fd-muted px-1.5 py-0.5 text-[0.8rem] font-semibold">/{s.id}</code>
                    <span className="text-sm font-semibold">{s.label}</span>
                    <span
                      className={cn(
                        'ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold',
                        st === 'loaded' && 'bg-[var(--color-ok)] text-white',
                        st === 'matched' && 'bg-fd-primary text-fd-primary-foreground',
                        (st === 'idle' || st === 'skipped') && 'bg-fd-muted text-fd-muted-foreground',
                      )}
                    >
                      {st === 'loaded' ? '본문 읽음' : st === 'matched' ? '이 스킬!' : '설명만'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-fd-muted-foreground">
                    <span className="font-medium text-fd-foreground">설명</span> {s.description}
                  </p>
                  {st === 'loaded' && (
                    <div className="mt-2 rounded-lg border border-[color-mix(in_oklab,var(--color-ok)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-ok)_8%,transparent)] px-3 py-2">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ok)]">
                        <BookOpen className="size-3.5" /> 방금 읽어 온 본문 (절차)
                      </p>
                      <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm leading-6">
                        {s.body.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-fd-muted-foreground">요청 고르기</p>
          <div role="radiogroup" aria-label="예시 요청" className="mb-3 flex flex-wrap gap-1.5">
            {REQUESTS.map((r, i) => (
              <button
                key={r.text}
                type="button"
                role="radio"
                aria-checked={pick === i}
                onClick={() => choose(i)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium',
                  pick === i ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent',
                )}
              >
                {r.text}
              </button>
            ))}
          </div>

          <Terminal className="min-h-56">
            {!req && <p className="text-[#8b95a5]">위에서 요청을 하나 고르면 시작합니다.</p>}
            {lines.slice(0, step).map((l, i) => (
              <p
                key={i}
                className={cn(
                  'whitespace-pre-wrap',
                  l.k === 'you' && 'text-[#f5c26b]',
                  l.k === 'tool' && 'text-[#8fb8ff]',
                  l.k === 'sys' && 'text-[#8b95a5]',
                )}
              >
                {l.t}
              </p>
            ))}
          </Terminal>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Btn onClick={() => setStep((s) => Math.min(max, s + 1))} disabled={!req || done}>
              <StepForward className="size-4" /> 다음
            </Btn>
            <Btn variant="outline" onClick={() => setAuto(true)} disabled={!req || auto || done}>
              <Play className="size-4" /> 자동 재생
            </Btn>
            {req && (
              <span className="text-xs text-fd-muted-foreground tabular-nums">
                {Math.min(step, max)} / {max}
              </span>
            )}
          </div>

          <div className="mt-3 rounded-xl border bg-fd-background p-3 text-sm leading-6">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-fd-muted-foreground">
              <FileText className="size-3.5" /> 지금 에이전트가 들고 있는 것
            </p>
            <ul className="mt-1 space-y-0.5">
              <li>· 스킬 설명 3줄 (항상)</li>
              <li className={cn(!loaded && 'text-fd-muted-foreground')}>
                · {loaded ? `${loaded.id} 본문 (방금 읽음, 이 대화 동안 유지)` : '스킬 본문: 아직 하나도 읽지 않음'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {done && req && (
        <p aria-live="polite" className="mt-4 rounded-lg bg-fd-secondary/60 px-3 py-2 text-sm leading-6">
          {req.skill === null
            ? '설명 세 줄 가운데 요청과 맞는 것이 없어서 스킬 없이 답했습니다. 스킬을 많이 만들어 두어도, 쓰이지 않는 본문은 읽히지 않습니다.'
            : req.direct
              ? '/이름으로 직접 부르면 설명과 맞춰 보는 단계를 건너뜁니다. 에이전트가 알아서 부르지 않을 때도 이렇게 부르면 됩니다.'
              : '에이전트는 설명을 읽고 이 요청에 맞는 스킬을 골랐고, 본문은 그때 읽어 왔습니다. 그래서 본문이 길어도 부담이 적고, 언제 불릴지는 설명이 정합니다.'}{' '}
          <span className="text-fd-muted-foreground">
            실제로는 낱말이 똑같은지가 아니라 Claude가 설명을 읽고 판단합니다. 설명에 "무엇을 하는지"와 "언제 쓰는지"를 적어 두세요.
          </span>
        </p>
      )}
    </SimFrame>
  );
}
