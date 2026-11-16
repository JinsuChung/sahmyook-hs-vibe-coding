'use client';
import { useEffect, useState } from 'react';
import { Bot, Brain, GraduationCap, Play, StepForward, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame } from './frame';

/** think: 학생이 스스로 생각해서 한 말 */
type Turn = { who: 'student' | 'ai'; text: string; think?: boolean };
type Scenario = {
  key: string;
  label: string;
  intro: string;
  bot: Turn[];
  tutor: Turn[];
  diff: { label: string; bot: string; tutor: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    key: 'energy',
    label: '"답이 뭐예요?"',
    intro: '통합과학 · 역학적 에너지 보존. 문제: 높이 5 m에서 가만히 놓은 질량 2 kg인 공이 바닥에 닿기 직전의 속력은? (g = 10 m/s², 공기 저항 무시)',
    bot: [
      { who: 'student', text: '이 문제 답이 뭐예요?' },
      { who: 'ai', text: '10 m/s입니다. 역학적 에너지가 보존되므로 mgh = ½mv², v = √(2gh) = √(2×10×5) = 10 m/s입니다.' },
      { who: 'student', text: '감사합니다. 그럼 높이가 20 m면요?' },
      { who: 'ai', text: '20 m/s입니다. v = √(2×10×20) = √400 = 20 m/s입니다.' },
      { who: 'student', text: '넵, 다음 문제도 답 알려 주세요.' },
    ],
    tutor: [
      { who: 'student', text: '이 문제 답이 뭐예요?' },
      { who: 'ai', text: '같이 풀어 볼까요? 공을 놓는 순간, 공이 가진 에너지는 어떤 종류일까요?' },
      { who: 'student', text: '음… 높은 곳에 있으니까 위치 에너지요.', think: true },
      { who: 'ai', text: '맞아요. 그러면 바닥에 닿기 직전에는 그 에너지가 어떻게 되었을까요? 공기 저항은 없다고 했어요.' },
      { who: 'student', text: '전부 운동 에너지로 바뀌어요. 그러면 mgh = ½mv²인가요?', think: true },
      { who: 'ai', text: '식을 직접 세웠네요. 양쪽에서 지울 수 있는 것이 있을까요? 지운 다음 숫자를 넣어 보세요.' },
      { who: 'student', text: 'm이 지워지고… v² = 2×10×5 = 100이니까 v = 10 m/s요!', think: true },
      { who: 'ai', text: '정확해요. 질량이 결과와 상관없다는 것도 찾았네요. 높이가 20 m가 되면 속력은 몇 배가 될지 먼저 예상해 볼래요?' },
    ],
    diff: [
      { label: '학생이 한 생각', bot: '답을 받아 적음. 스스로 세운 식 없음', tutor: '에너지 종류 판단, 식 세우기, 계산까지 직접 함' },
      { label: '다음에 혼자 풀 수 있는가', bot: '숫자만 바뀌어도 다시 물어봄', tutor: '방법을 자기 말로 설명할 수 있음. 숫자가 바뀌어도 스스로 예상함' },
    ],
  },
  {
    key: 'report',
    label: '"보고서 대신 써 줘"',
    intro: '통합과학 수행평가 · 탐구 보고서. 학생이 AI에게 보고서를 통째로 써 달라고 합니다.',
    bot: [
      { who: 'student', text: '수행평가 탐구 보고서 대신 써 줘. 주제는 역학적 에너지 보존, A4 1장.' },
      { who: 'ai', text: '네, 작성했습니다. "1. 탐구 동기 … 2. 실험 방법 … 3. 결과 … 4. 결론 …" (A4 1장 분량의 완성된 글)' },
      { who: 'student', text: '오, 이대로 낼게요.' },
    ],
    tutor: [
      { who: 'student', text: '수행평가 탐구 보고서 대신 써 줘. 주제는 역학적 에너지 보존, A4 1장.' },
      { who: 'ai', text: '보고서를 대신 써 줄 수는 없어요. 평가받는 것은 직접 한 탐구니까요. 대신 개요 잡는 것을 도울게요. 어떤 실험을 했는지 한 문장으로 말해 줄래요?' },
      { who: 'student', text: '레일에서 쇠구슬을 놓는 높이를 바꿔 가면서 바닥에서의 속력을 쟀어요.', think: true },
      { who: 'ai', text: '좋아요. 그 실험에서 바꾼 것과 잰 것은 각각 무엇이었나요? 그 둘이 개요의 "방법"과 "결과"가 됩니다.' },
      { who: 'student', text: '바꾼 건 높이, 잰 건 속력이요. 높을수록 빨랐어요.', think: true },
      { who: 'ai', text: '그럼 동기 → 방법 → 결과 → 해석 순서로 쓰면 되겠네요. "해석"에는 무엇을 쓰면 좋을까요? 예상과 달랐던 점이 있었나요?' },
      { who: 'student', text: '계산한 값보다 조금 느리게 나왔어요. 마찰 때문인 것 같은데, 그걸 쓸게요.', think: true },
    ],
    diff: [
      { label: '학생이 한 생각', bot: '없음. 요청 한 번으로 끝남', tutor: '실험을 자기 말로 정리하고, 개요와 해석 거리를 직접 찾음' },
      { label: '남은 결과물', bot: 'AI가 쓴 글. 학생의 탐구가 아니므로 평가 근거가 될 수 없음', tutor: '학생이 잡은 개요. 글은 학생이 직접 씀' },
    ],
  },
];

/** 튜터 쪽 시스템 프롬프트의 핵심 규칙 (예시) */
const RULES = [
  '정답과 풀이를 먼저 말하지 않는다. 한 번에 질문 하나로 다음 걸음을 묻는다.',
  '학생의 말에서 맞은 부분을 짚어 주고, 틀린 부분은 스스로 찾도록 되묻는다.',
  '두 번 막히면 힌트를 한 단계만 준다. 답은 학생이 풀이를 말한 뒤에 확인해 준다.',
  '과제나 보고서를 대신 써 달라는 요청은 거절하고, 개요 잡기처럼 스스로 쓰는 일을 돕는다.',
];

export function TutorCompare() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const sc = SCENARIOS[idx];
  const max = Math.max(sc.bot.length, sc.tutor.length);
  const done = step >= max;

  useEffect(() => {
    if (!auto) return;
    if (step >= max) {
      setAuto(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [auto, step, max]);

  const thinks = (turns: Turn[]) => turns.slice(0, step).filter((t) => t.think).length;
  const pick = (i: number) => {
    setIdx(i);
    setStep(0);
    setAuto(false);
  };

  return (
    <SimFrame
      title="답 주는 챗봇 vs 질문하는 튜터"
      desc="같은 학생 질문에 두 AI가 어떻게 답하는지 한 턴씩 재생해 보세요. 학생이 스스로 생각한 횟수를 비교합니다."
      onReset={() => pick(0)}
    >
      <div role="radiogroup" aria-label="상황 고르기" className="mb-3 flex flex-wrap gap-1.5">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="radio"
            aria-checked={idx === i}
            onClick={() => pick(i)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium',
              idx === i ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent',
            )}
          >
            상황 {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <p className="mb-3 rounded-lg bg-fd-secondary/60 px-3 py-2 text-sm leading-6">{sc.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Column title="답 주는 챗봇" icon={<Bot className="size-4" />} turns={sc.bot} step={step} thinks={thinks(sc.bot)} tone="muted" />
        <Column title="질문하는 튜터" icon={<GraduationCap className="size-4" />} turns={sc.tutor} step={step} thinks={thinks(sc.tutor)} tone="primary" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Btn onClick={() => setStep((s) => Math.min(max, s + 1))} disabled={done}>
          <StepForward className="size-4" /> 다음 턴
        </Btn>
        <Btn variant="outline" onClick={() => setAuto(true)} disabled={auto || done}>
          <Play className="size-4" /> 자동 재생
        </Btn>
        <span className="text-xs text-fd-muted-foreground tabular-nums">
          {step} / {max}
        </span>
      </div>

      {done && (
        <div aria-live="polite" className="mt-4 grid gap-3">
          <div className="rounded-xl border bg-fd-background p-4">
            <p className="mb-2 text-sm font-bold">무엇이 달랐나</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-fd-muted-foreground">
                    <th scope="col" className="py-1.5 pr-2 font-medium" />
                    <th scope="col" className="py-1.5 pr-2 font-medium">
                      챗봇
                    </th>
                    <th scope="col" className="py-1.5 font-medium">
                      튜터
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <th scope="row" className="py-1.5 pr-2 text-left align-top font-medium">
                      스스로 생각한 횟수
                    </th>
                    <td className="py-1.5 pr-2 align-top font-bold tabular-nums">{thinks(sc.bot)}번</td>
                    <td className="py-1.5 align-top font-bold tabular-nums text-fd-primary">{thinks(sc.tutor)}번</td>
                  </tr>
                  {sc.diff.map((d) => (
                    <tr key={d.label} className="border-b last:border-0">
                      <th scope="row" className="py-1.5 pr-2 text-left align-top font-medium">
                        {d.label}
                      </th>
                      <td className="py-1.5 pr-2 align-top leading-6 text-fd-muted-foreground">{d.bot}</td>
                      <td className="py-1.5 align-top leading-6">{d.tutor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl border bg-fd-card p-4">
            <p className="mb-2 text-sm font-bold">튜터 쪽 시스템 프롬프트의 핵심 규칙 (예시)</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm leading-6">
              {RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
            <p className="mt-2 text-xs leading-5 text-fd-muted-foreground">
              같은 모델이라도 교사가 써 준 시스템 프롬프트에 따라 이렇게 다르게 행동합니다. 어떤 규칙을 넣을지는 선생님의 수업 방식이 정합니다.
            </p>
          </div>
        </div>
      )}
    </SimFrame>
  );
}

function Column({
  title,
  icon,
  turns,
  step,
  thinks,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  turns: Turn[];
  step: number;
  thinks: number;
  tone: 'muted' | 'primary';
}) {
  const ended = step >= turns.length;
  return (
    <div className={cn('rounded-xl border p-3', tone === 'primary' && 'border-fd-primary/40')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-semibold">
          {icon} {title}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-fd-muted px-2 py-0.5 text-xs font-semibold tabular-nums">
          <Brain className="size-3" /> 학생의 생각 {thinks}
        </span>
      </div>
      <ol className="space-y-1.5">
        {turns.map((t, i) => (
          <li
            key={i}
            className={cn(
              'flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm leading-6 transition-all duration-300',
              i < step ? 'opacity-100' : 'opacity-25',
              i === step - 1 && 'ring-2 ring-fd-primary/40',
              t.who === 'student' ? 'bg-[color-mix(in_oklab,var(--color-warn)_10%,transparent)]' : 'bg-fd-secondary/60',
            )}
          >
            {t.who === 'student' ? (
              <User className="mt-1 size-3.5 shrink-0 text-[var(--color-warn)]" />
            ) : (
              <Bot className="mt-1 size-3.5 shrink-0 text-fd-primary" />
            )}
            <span>
              <span className="sr-only">{t.who === 'student' ? '학생: ' : 'AI: '}</span>
              {t.text}
              {t.think && i < step && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-fd-primary/10 px-1.5 text-[11px] font-bold text-fd-primary">
                  <Brain className="size-3" /> 스스로 생각
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
      {ended && turns.length > 0 && step > 0 && (
        <p className="mt-2 text-xs text-fd-muted-foreground">대화 끝 ({turns.length}턴)</p>
      )}
    </div>
  );
}
