'use client';
import { useState } from 'react';
import { Cloud, Laptop, Repeat, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SimFrame } from './frame';

type Opt = 'cloud' | 'desktop' | 'loop';
type QKey = 'off' | 'files' | 'poll';
type Answers = Record<QKey, boolean | null>;

const QUESTIONS: { key: QKey; q: string; hint: string }[] = [
  { key: 'off', q: '컴퓨터가 꺼져 있어도 돌아야 하나요?', hint: '퇴근 뒤, 주말, 방학처럼 내 PC를 꺼 둔 시간에도 실행되어야 하는지' },
  { key: 'files', q: '내 PC의 파일이 필요한가요?', hint: '교무수첩 폴더처럼 내 컴퓨터에만 있는 파일을 읽거나 써야 하는지' },
  { key: 'poll', q: '지금 대화 중에 잠깐 반복해서 확인하면 되나요?', hint: '"끝났는지 5분마다 봐 줘"처럼 이 대화가 열려 있는 동안만 필요한지' },
];

const OPTS: Record<Opt, { name: string; short: string; icon: typeof Cloud; caution: string }> = {
  cloud: {
    name: '클라우드 예약 작업',
    short: '클라우드',
    icon: Cloud,
    caution:
      '실행할 때마다 GitHub 저장소를 새로 복제해서 일하므로 내 PC의 파일은 보지 못합니다. 최소 간격은 1시간입니다. 연구 미리보기 단계라 동작이 바뀔 수 있습니다.',
  },
  desktop: {
    name: '데스크톱(로컬) 예약 작업',
    short: '데스크톱(로컬)',
    icon: Laptop,
    caution:
      '데스크톱 앱이 열려 있고 컴퓨터가 깨어 있을 때만 실행됩니다. 놓친 실행은 앱을 열거나 컴퓨터가 깨어날 때 가장 최근 것 한 번만 따라잡습니다.',
  },
  loop: {
    name: '/loop (대화 중 반복)',
    short: '/loop',
    icon: Repeat,
    caution: '세션이 열려 있는 동안만 돕니다. 반복 작업은 만든 지 7일이 지나면 자동으로 끝납니다.',
  },
};

/**
 * 공식 문서의 비교표 그대로 (Compare scheduling options).
 * https://code.claude.com/docs/en/desktop-scheduled-tasks
 */
const TABLE: { label: string; q?: QKey; cloud: string; desktop: string; loop: string }[] = [
  { label: '실행 위치', cloud: '클라우드 (기본은 Anthropic이 관리)', desktop: '내 컴퓨터', loop: '내 컴퓨터' },
  { label: '컴퓨터가 켜져 있어야 하나', q: 'off', cloud: '아니요', desktop: '예', loop: '예' },
  { label: '세션이 열려 있어야 하나', q: 'poll', cloud: '아니요', desktop: '아니요', loop: '예' },
  { label: '다시 시작해도 유지되나', cloud: '예', desktop: '예', loop: '--resume으로 이어 가면 복원 (예외 있음)' },
  { label: '로컬 파일 접근', q: 'files', cloud: '아니요 (저장소를 새로 복제)', desktop: '예', loop: '예' },
  { label: 'MCP 서버', cloud: '작업마다 설정한 커넥터', desktop: '설정 파일과 커넥터', loop: '세션에서 물려받음' },
  { label: '권한 확인', cloud: '기본은 자동 모드', desktop: '작업마다 설정', loop: '세션에서 물려받음' },
  { label: '일정 직접 정하기', cloud: '예', desktop: '예', loop: '예' },
  { label: '최소 간격', cloud: '1시간', desktop: 'Claude가 정하면 1분, 입력 양식에서는 1시간', loop: '1분' },
];

const PRESETS: { label: string; a: Answers }[] = [
  { label: '월요일 아침 주간 업무 브리핑 (교무수첩 폴더의 학사일정·받은 공문을 읽음)', a: { off: false, files: true, poll: false } },
  { label: 'PC를 꺼 둔 주말에도, GitHub에 올려 둔 수행평가 일정 보드를 점검', a: { off: true, files: false, poll: false } },
  { label: '방금 푸시한 보드의 배포가 끝났는지 5분마다 확인', a: { off: false, files: false, poll: true } },
  { label: 'PC를 꺼 둔 밤에도, 내 PC의 받은공문 폴더를 정리', a: { off: true, files: true, poll: false } },
];

const EMPTY: Answers = { off: null, files: null, poll: null };

function recommend(a: Answers): { opt: Opt; why: string; conflict?: string; note?: string } | null {
  if (a.off === null || a.files === null || a.poll === null) return null;
  if (a.off && a.files) {
    return {
      opt: 'desktop',
      why: '내 PC에만 있는 파일을 써야 한다면 데스크톱(로컬) 예약 작업밖에 없습니다.',
      conflict:
        '두 조건이 부딪칩니다. 클라우드 예약 작업은 컴퓨터가 꺼져 있어도 돌지만 내 PC의 파일을 보지 못하고, 로컬 예약 작업은 파일을 보지만 컴퓨터가 깨어 있어야 합니다. PC를 켜 둘 수 있는 시간으로 옮기거나, 필요한 자료를 GitHub 저장소나 연결(커넥터)로 닿는 곳에 두고 클라우드로 돌리세요. 학생 정보가 든 파일은 옮기지 않습니다.',
    };
  }
  if (a.off) {
    return {
      opt: 'cloud',
      why: '컴퓨터가 꺼져 있어도 실행되는 것은 클라우드 예약 작업뿐입니다. 내 PC의 파일이 필요 없으니 조건이 맞습니다.',
      note: a.poll ? '/loop는 세션이 열려 있고 컴퓨터가 켜져 있을 때만 돌기 때문에 이 경우에는 맞지 않습니다.' : undefined,
    };
  }
  if (a.poll) {
    return {
      opt: 'loop',
      why: '지금 대화가 열려 있는 동안만 잠깐 반복해서 확인하면 되는 일에는 /loop가 가장 가볍습니다. 따로 예약 작업을 만들 필요가 없습니다.',
    };
  }
  if (a.files) {
    return {
      opt: 'desktop',
      why: '내 PC의 폴더를 읽고 써야 하므로 데스크톱(로컬) 예약 작업이 맞습니다. 대화를 열어 두지 않아도 정해진 시간에 새 세션이 시작됩니다.',
    };
  }
  return {
    opt: 'desktop',
    why: '세 가지 조건 어디에도 걸리지 않으니 가장 손쉬운 데스크톱(로컬) 예약 작업으로 시작하면 됩니다.',
    note: '내 컴퓨터 없이도 빠짐없이 돌아야 하는 일로 커지면 클라우드 예약 작업으로 옮기세요.',
  };
}

export function SchedulePicker() {
  const [a, setA] = useState<Answers>(EMPTY);
  const rec = recommend(a);
  const answered = QUESTIONS.filter((q) => a[q.key] !== null).length;

  return (
    <SimFrame
      title="어디서 돌릴까: 예약 방식 고르기"
      desc="질문 세 개에 답하면 클라우드 예약 작업, 데스크톱(로컬) 예약 작업, /loop 가운데 맞는 방식을 알려 줍니다. 아래 학교 예시를 눌러도 됩니다."
      onReset={() => setA(EMPTY)}
    >
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold text-fd-muted-foreground">학교 예시로 채우기</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setA(p.a)}
              className={cn(
                'rounded-xl border px-3 py-1.5 text-left text-sm leading-5',
                JSON.stringify(a) === JSON.stringify(p.a) ? 'border-fd-primary bg-fd-primary/10 font-semibold' : 'hover:bg-fd-accent',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-2">
        {QUESTIONS.map((q, i) => (
          <li key={q.key} className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border bg-fd-background px-3 py-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fd-primary text-[11px] font-bold text-fd-primary-foreground">{i + 1}</span>
            <span className="min-w-0 flex-1 basis-56">
              <span id={`sched-q-${q.key}`} className="block text-sm font-semibold">
                {q.q}
              </span>
              <span className="block text-xs leading-5 text-fd-muted-foreground">{q.hint}</span>
            </span>
            <span role="radiogroup" aria-labelledby={`sched-q-${q.key}`} className="inline-flex shrink-0 gap-1.5">
              {(
                [
                  [true, '예'],
                  [false, '아니요'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={a[q.key] === val}
                  onClick={() => setA((prev) => ({ ...prev, [q.key]: val }))}
                  className={cn(
                    'min-w-16 rounded-lg border px-3 py-1.5 text-sm font-medium',
                    a[q.key] === val ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent',
                  )}
                >
                  {label}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="mt-4">
        {!rec ? (
          <p className="rounded-lg bg-fd-secondary/60 px-3 py-2 text-sm leading-6 text-fd-muted-foreground">
            질문 {answered} / 3개에 답했어요. 세 개 모두 답하면 추천이 나옵니다.
          </p>
        ) : (
          <div className="rounded-xl border-2 border-fd-primary/40 bg-fd-background p-4">
            <p className="text-xs font-semibold text-fd-muted-foreground">추천</p>
            <p className="mt-0.5 flex items-center gap-2 text-lg font-bold">
              {(() => {
                const Icon = OPTS[rec.opt].icon;
                return <Icon className="size-5 text-fd-primary" />;
              })()}
              {OPTS[rec.opt].name}
            </p>
            <p className="mt-1 text-sm leading-6">{rec.why}</p>
            {rec.conflict && (
              <p className="mt-2 flex items-start gap-2 rounded-lg bg-[color-mix(in_oklab,var(--color-warn)_12%,transparent)] px-3 py-2 text-sm leading-6 text-[var(--color-warn)]">
                <TriangleAlert className="mt-1 size-4 shrink-0" />
                <span>{rec.conflict}</span>
              </p>
            )}
            <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
              <b className="text-fd-foreground">알아 둘 점</b> {OPTS[rec.opt].caution}
            </p>
            {rec.note && <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">{rec.note}</p>}
          </div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[34rem] text-sm">
          <caption className="sr-only">예약 방식 세 가지 비교</caption>
          <thead className="bg-fd-muted text-left">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                비교
              </th>
              {(['cloud', 'desktop', 'loop'] as const).map((o) => (
                <th
                  key={o}
                  scope="col"
                  className={cn('px-3 py-2 font-semibold transition-colors', rec?.opt === o && 'bg-fd-primary text-fd-primary-foreground')}
                >
                  {OPTS[o].short}
                  {rec?.opt === o && <span className="ml-1.5 text-[11px] font-bold">추천</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE.map((row) => {
              const asked = row.q !== undefined && a[row.q] === true;
              return (
                <tr key={row.label} className="border-t">
                  <th scope="row" className={cn('px-3 py-2 text-left font-medium', asked && 'text-[var(--color-warn)]')}>
                    {row.label}
                    {asked && <span className="ml-1 text-[11px] font-bold">← 내 조건</span>}
                  </th>
                  {(['cloud', 'desktop', 'loop'] as const).map((o) => (
                    <td
                      key={o}
                      className={cn(
                        'px-3 py-2 leading-5 transition-colors',
                        rec?.opt === o ? 'bg-fd-primary/10 font-medium' : 'text-fd-muted-foreground',
                      )}
                    >
                      {row[o]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs leading-5 text-fd-muted-foreground">
        표의 값은 Claude Code 공식 문서의 비교표를 옮긴 것입니다 (2026-11-16 확인). 메뉴 이름이나 값이 다르면{' '}
        <a href="https://code.claude.com/docs/en/desktop-scheduled-tasks" target="_blank" rel="noreferrer" className="underline">
          공식 문서
        </a>
        를 확인하세요.
      </p>
    </SimFrame>
  );
}
