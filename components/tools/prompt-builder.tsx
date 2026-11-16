'use client';
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useStored } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { CopyButton } from '@/components/prompt/copy-button';

type Fields = { purpose: string; input: string; output: string; rules: string; verify: string };
type Opts = { planFirst: boolean; interview: boolean; resultFolder: boolean; korean: boolean };

const EMPTY: Fields = { purpose: '', input: '', output: '', rules: '', verify: '' };
const DEFAULT_OPTS: Opts = { planFirst: true, interview: false, resultFolder: true, korean: false };

const PRESETS: { label: string; f: Fields }[] = [
  {
    label: '반별 점수 취합',
    f: {
      purpose: '1학년 국어 수행평가(논설문 쓰기) 점수를 반별로 모아 교과협의회 자료로 쓰기',
      input: '수행평가_점수 폴더의 엑셀 6개 (1반–6반, 가상 데이터)',
      output: '전체 명단 시트와 반별 인원·평균 시트, 결과/수행평가_취합.xlsx',
      rules: '원본은 절대 수정하지 말 것\n빠진 점수와 영역별 만점(10점)을 넘는 점수는 고치지 말고 따로 표시\n평균은 소수 첫째 자리까지',
      verify: '반별 인원 합계와 취합표의 행 수가 같은지, 반별 평균을 다시 계산해 대조한 표를 보여줄 것',
    },
  },
  {
    label: '가정통신문 초안',
    f: {
      purpose: '1학년 현장체험학습을 학부모에게 안내',
      input: '양식/가정통신문_양식 파일과 학사일정_2026-2.csv',
      output: '양식에 맞춘 가정통신문 초안, 결과/가정통신문_체험학습.md',
      rules: '양식의 항목 순서와 문체를 그대로 따를 것\n일정표에 없는 날짜·금액은 지어내지 말고 [확인 필요]로 표시\n학생 이름 등 개인정보는 넣지 말 것',
      verify: '본문의 날짜가 학사일정 파일과 같은지 대조한 결과를 보여줄 것',
    },
  },
  {
    label: '출결 통계',
    f: {
      purpose: '월말 학급 출결 현황을 한눈에 보기',
      input: '출결_11월.xlsx (가명 처리한 가상 데이터, 이름 대신 번호)',
      output: '번호별 결석·지각·조퇴 횟수 표와 유형별 합계, 결과/출결_통계.xlsx',
      rules: '원본은 절대 수정하지 말 것\n날짜 형식은 YYYY-MM-DD\n판단이 필요한 칸은 비워 두고 목록으로 알려줄 것',
      verify: '유형별 합계가 원본의 표시 개수와 같은지 검산표를 보여줄 것',
    },
  },
  {
    label: '공문 요약',
    f: {
      purpose: '이번 주에 처리할 공문과 기한 놓치지 않기',
      input: '받은공문 폴더의 문서 (가상 공문)',
      output: '공문별 세 줄 요약과 할 일·담당·기한 표, 결과/공문_정리.md',
      rules: '공문에 없는 내용은 넣지 말 것\n기한이 없으면 "기한 없음"으로 적을 것',
      verify: '공문 1건을 골라 원문과 표를 대조한 결과를 보여줄 것',
    },
  },
];

const LABELS: { key: keyof Fields; label: string; q: string; ph: string }[] = [
  { key: 'purpose', label: '목적', q: '왜 하나요?', ph: '예) 수행평가 점수를 반별로 모아 협의회 자료로 쓰기' },
  { key: 'input', label: '입력', q: '무엇을 가지고?', ph: '예) 수행평가_점수 폴더의 엑셀 6개' },
  { key: 'output', label: '출력', q: '무엇을 만들어?', ph: '예) 반별 평균 표, 결과/수행평가_취합.xlsx' },
  { key: 'rules', label: '조건', q: '지켜야 할 것은? (줄마다 하나)', ph: '예) 원본 수정 금지' },
  { key: 'verify', label: '검증', q: '맞는지 어떻게 확인?', ph: '예) 반별 인원 합계와 취합표 행 수 대조' },
];

export function PromptBuilder() {
  const [f, setF] = useStored<Fields>('builder:fields', EMPTY);
  const [o, setO] = useStored<Opts>('builder:opts', DEFAULT_OPTS);

  const prompt = useMemo(() => {
    const lines: string[] = [];
    if (o.interview) {
      lines.push(`나는 ${f.output || '[만들 것]'}을(를) 만들고 싶어. 목적은 ${f.purpose || '[목적]'}이야.`);
      lines.push('내가 미처 생각 못 한 부분까지 질문해서 요구사항을 정리한 뒤 기획서.md로 저장해줘. 질문은 한 번에 3개 이하로.');
      if (f.input) lines.push(`참고할 자료: ${f.input}`);
      return lines.join('\n');
    }
    if (f.purpose) lines.push(`[목적] ${f.purpose}`);
    lines.push(`[입력] ${f.input || '(입력 자료)'}`);
    lines.push(`[출력] ${f.output || '(만들 결과물)'}`);
    const rules = f.rules
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    if (o.resultFolder) rules.push("결과물은 '결과' 폴더에 새로 만들 것");
    if (o.korean) rules.push('답변과 파일은 모두 한국어로');
    if (rules.length) lines.push(`[조건]\n${rules.map((r) => `- ${r}`).join('\n')}`);
    if (f.verify) lines.push(`[검증] ${f.verify}`);
    if (o.planFirst) lines.push('\n아직 실행하지 말고, 어떻게 할지 계획부터 보여줘. 내가 승인하면 그때 실행해.');
    return lines.join('\n');
  }, [f, o]);

  const filled = LABELS.filter((l) => f[l.key].trim()).length;
  const suggestion = f.rules
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => /원본|형식|폴더|소수|YYYY|한국어|삭제|이동|개인정보|지어내/.test(r));

  return (
    <div className="not-prose my-6 grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border bg-fd-card p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold">5요소 채우기</span>
          <span className="text-sm text-fd-muted-foreground">{filled}/5</span>
          <span className="ml-auto flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setF(p.f)}
                className="rounded-full border px-2.5 py-1 text-xs font-medium hover:bg-fd-accent"
              >
                예시: {p.label}
              </button>
            ))}
          </span>
        </div>
        <div className="space-y-3">
          {LABELS.map((l) => (
            <label key={l.key} className="block text-sm">
              <span className="font-semibold">{l.label}</span>
              <span className="ml-1.5 text-fd-muted-foreground">{l.q}</span>
              {l.key === 'rules' ? (
                <textarea
                  rows={3}
                  value={f[l.key]}
                  placeholder={l.ph}
                  onChange={(e) => setF((prev) => ({ ...prev, [l.key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border bg-fd-background px-3 py-2 outline-none focus:ring-2 focus:ring-fd-ring"
                />
              ) : (
                <input
                  value={f[l.key]}
                  placeholder={l.ph}
                  onChange={(e) => setF((prev) => ({ ...prev, [l.key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border bg-fd-background px-3 py-2 outline-none focus:ring-2 focus:ring-fd-ring"
                />
              )}
            </label>
          ))}
        </div>
        <fieldset className="mt-4 grid gap-2 border-t pt-4 text-sm sm:grid-cols-2">
          <legend className="sr-only">옵션</legend>
          {(
            [
              ['planFirst', '먼저 계획만 보여줘 (플랜)'],
              ['interview', '질문부터 해줘 (인터뷰형)'],
              ['resultFolder', "결과는 '결과' 폴더에"],
              ['korean', '모두 한국어로'],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={o[k]}
                onChange={(e) => setO((prev) => ({ ...prev, [k]: e.target.checked }))}
                className="size-4"
              />
              {label}
            </label>
          ))}
        </fieldset>
        <button
          type="button"
          onClick={() => {
            setF(EMPTY);
            setO(DEFAULT_OPTS);
          }}
          className="mt-3 text-xs text-fd-muted-foreground underline"
        >
          모두 지우기
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border-2 border-fd-primary/30 bg-fd-background">
          <div className="flex items-center gap-2 border-b px-4 py-2.5">
            <Sparkles className="size-4 text-fd-primary" />
            <span className="font-semibold">완성된 프롬프트</span>
            <CopyButton text={() => prompt} className="ml-auto" />
          </div>
          <pre className="whitespace-pre-wrap px-4 py-3 font-sans text-[1rem] leading-7 tracking-[-0.015em]">{prompt}</pre>
        </div>
        <div className={cn('rounded-xl border bg-fd-card p-4 text-sm leading-6', !suggestion.length && 'opacity-70')}>
          <p className="font-semibold">CLAUDE.md에 옮겨 둘 만한 조건</p>
          {suggestion.length ? (
            <ul className="mt-1 list-disc pl-5">
              {suggestion.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-fd-muted-foreground">원본 보호, 날짜 형식, 저장 폴더, 개인정보 원칙처럼 매번 반복할 조건을 적으면 여기에 추천돼요.</p>
          )}
        </div>
        <div className="rounded-xl border bg-fd-card p-4 text-sm leading-6">
          <p className="font-semibold">체크 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>{f.input ? '✓' : '○'} 입력: AI가 볼 파일·폴더를 이름으로 적었나요?</li>
            <li>{f.output ? '✓' : '○'} 출력: 결과물의 모양과 저장 위치가 있나요?</li>
            <li>{f.verify ? '✓' : '○'} 검증: AI가 스스로 확인할 기준을 줬나요?</li>
            <li>{o.planFirst || o.interview ? '✓' : '○'} 파일을 바꾸는 일이면 계획부터 보게 했나요?</li>
            <li>○ 입력 자료에 실제 학생의 이름·성적·상담 내용이 들어 있지 않나요? (직접 확인)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
