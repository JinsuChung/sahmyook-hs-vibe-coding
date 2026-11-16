import Link from 'next/link';
import { ArrowRight, ClipboardCopy, Presentation, ListChecks, MousePointerClick } from 'lucide-react';
import { ContinueButton, CourseMap } from '@/components/home/home-client';
import { SiteUrl } from '@/components/home/site-url';
import { ClassBoard } from '@/components/class/class-board';
import { PromptCard } from '@/components/prompt/prompt-card';
import { examples } from '@/content/data/examples';
import { prompts } from '@/content/data/prompts';
import { audience, instructor } from '@/lib/shared';

/** 홈에 보여 줄 대표 프롬프트·예시 id. 없는 id는 건너뛴다 */
const featuredPrompts: string[] = ['plan-only', 'five-elements', 'git-commit', 'task-map-interview', 'automation-safety-review', 'agent-ops-plan'];
const featuredExamples: string[] = ['score-merge', 'byte-counter', 'assessment-board', 'plan-extract', 'home-letter-skill', 'subject-tutor'];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-[#002855] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 size-[36rem] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00a3e0 0%, transparent 65%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
            {audience} · 8회차
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.2] tracking-[-0.045em] sm:text-6xl">
            수업을 설계하는 사람이
            <br />
            <span className="bg-gradient-to-r from-[#7fd3ff] to-white bg-clip-text text-transparent">도구도 직접 만듭니다</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Claude Code로 교실과 교무실에 필요한 작은 도구를 말로 만들고, 반복 업무를 맡길 나만의 에이전트까지 길러 봅니다. 수업에서는 굵직한 흐름을
            함께 하고, 수업 뒤에는 혼자 차분히 깊게 파 볼 수 있어요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sessions/1"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#002855] transition-transform hover:-translate-y-0.5"
            >
              1회차 시작하기 <ArrowRight className="size-4" />
            </Link>
            <ContinueButton />
            <Link
              href="/start"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white/90 hover:text-white"
            >
              과정 소개와 준비물
            </Link>
          </div>
          <SiteUrl />
          <p className="mt-6 text-sm text-white/60">강의 · {instructor}</p>
        </div>
      </section>

      {/* 우리 반 진행 현황 */}
      <ClassBoard />

      {/* 과정 지도 */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">8회차 과정 지도</h2>
            <p className="mt-1 text-fd-muted-foreground">내 PC의 작은 도구 → 배포한 웹앱 → 업무 에이전트 → 교육용 에이전트. 실습을 체크하면 진도가 차오릅니다.</p>
          </div>
          <Link href="/start" className="text-sm font-medium text-fd-primary hover:underline">
            사전 준비 체크리스트 →
          </Link>
        </div>
        <CourseMap />
      </section>

      {/* 사용법 */}
      <section className="border-y bg-fd-muted/50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: ClipboardCopy, t: '복사해서 바로', d: '모든 프롬프트에 복사 버튼. 주황색 빈칸을 채우면 내 교과·학급에 맞게 바뀝니다.' },
            { icon: MousePointerClick, t: '눌러 보며 이해', d: '에이전트, 커밋, 배포, 보안, 스킬, 튜터를 시뮬레이터로 직접 체험합니다.' },
            { icon: ListChecks, t: '혼자서 깊게', d: '회차마다 깊이 파기(n.5)가 짝으로 있습니다. 단계마다 예상 결과와 "막혔을 때" 도움말이 있어요.' },
            { icon: Presentation, t: '함께 보는 발표 모드', d: 'P 키 하나로 큰 글씨 슬라이드, 실습 타이머, 페이지 QR 코드.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border bg-fd-background p-5">
              <Icon className="size-6 text-fd-primary" />
              <p className="mt-3 font-bold">{t}</p>
              <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 바로 쓰는 프롬프트 */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">바로 쓰는 프롬프트</h2>
          <Link href="/prompts" className="text-sm font-medium text-fd-primary hover:underline">
            {prompts.length}개 모두 보기 →
          </Link>
        </div>
        <div className="grid gap-x-5 lg:grid-cols-2">
          {featuredPrompts
            .filter((id) => prompts.some((x) => x.id === id))
            .map((id) => (
              <PromptCard key={id} id={id} compact />
            ))}
        </div>
      </section>

      {/* 업무 예시 */}
      <section className="border-t bg-fd-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">학교 업무 예시</h2>
              <p className="mt-1 text-fd-muted-foreground">수업·평가, 학급 운영, 생활기록부, 교무·학사, 공문, 진로·상담, 행사 — {examples.length}가지 장면</p>
            </div>
            <Link href="/examples" className="text-sm font-medium text-fd-primary hover:underline">
              {examples.length}개 모두 보기 →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredExamples.filter((id) => examples.some((x) => x.id === id)).length
              ? featuredExamples.filter((id) => examples.some((x) => x.id === id))
              : examples.slice(0, 6).map((x) => x.id)
            ).map((id) => {
              const e = examples.find((x) => x.id === id)!;
              return (
                <Link key={id} href={`/examples/${id}`} className="rounded-2xl border bg-fd-background p-5 transition-colors hover:border-fd-primary">
                  <span className="text-xs font-medium text-fd-muted-foreground">
                    {e.area} · {e.kind}
                  </span>
                  <p className="mt-1.5 font-bold leading-6">{e.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-fd-muted-foreground">{e.situation}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-8 text-sm text-fd-muted-foreground sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.svg" alt="" className="size-7" />
          <span>교실과 교무실을 바꾸는 바이브 코딩 · 강의 {instructor}</span>
          <span className="ml-auto">실습 자료는 모두 교육용 가상 데이터입니다. 학생 정보는 AI에 넣지 않습니다.</span>
        </div>
      </footer>
    </main>
  );
}
