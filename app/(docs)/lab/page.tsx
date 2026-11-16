import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, MousePointerClick, Wand2 } from 'lucide-react';
import { PageShell } from '@/components/ui/page-shell';
import { simMeta as simulators } from '@/components/sim/meta';

export const metadata: Metadata = { title: '실습 도구', description: '프롬프트 빌더, API 비용 계산기, 눌러 보며 익히는 개념 시뮬레이터.' };

const PARTS = [
  { title: '1부 · 바이브 코딩 기초 (1–4회차)', from: 1, to: 4 },
  { title: '2부 · 에이전트 개발 (5–8회차)', from: 5, to: 8 },
];

export default function Page() {
  return (
    <PageShell title="실습 도구" description="연수 시간에도, 교무실에서도 꺼내 쓰는 도구 모음입니다. 모두 가상 데이터로 동작하고 실제 AI를 부르지 않아 비용이 들지 않습니다.">
      <div className="not-prose grid gap-3 sm:grid-cols-3">
        <Card href="/lab/prompt-builder" icon={<Wand2 className="size-5" />} title="프롬프트 빌더" desc="목적·입력·출력·조건·검증 다섯 칸을 채우면 완성된 업무 프롬프트가 나옵니다. 2회차부터 씁니다." />
        <Card href="/lab/cost-calculator" icon={<Calculator className="size-5" />} title="API 비용 계산기" desc="문서 추출과 학습 도우미 대화에 드는 Claude API 비용을 어림합니다. 4회차와 8회차에서 씁니다." />
        <Card href="/lab/simulators" icon={<MousePointerClick className="size-5" />} title={`개념 시뮬레이터 ${Object.keys(simulators).length}종`} desc="에이전트, 커밋, 배포, 보안, 스킬, 예약 실행, 튜터 설계를 눌러 보며 이해합니다." />
      </div>
      <h2>시뮬레이터 목록</h2>
      {PARTS.map((part) => (
        <section key={part.title}>
          <h3>{part.title}</h3>
          <ul>
            {Object.entries(simulators)
              .filter(([, s]) => s.session >= part.from && s.session <= part.to)
              .map(([k, s]) => (
                <li key={k}>
                  <Link href={`/lab/simulators#${k}`}>{s.title}</Link> — <Link href={`/sessions/${s.session}`}>{s.session}회차</Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </PageShell>
  );
}

function Card({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link href={href} className="flex flex-col gap-2 rounded-2xl border bg-fd-card p-5 transition-colors hover:border-fd-primary">
      <span className="flex size-10 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">{icon}</span>
      <span className="text-lg font-bold">{title}</span>
      <span className="text-sm leading-6 text-fd-muted-foreground">{desc}</span>
    </Link>
  );
}
