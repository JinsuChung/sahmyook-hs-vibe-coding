import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/ui/page-shell';
import { PromptCard } from '@/components/prompt/prompt-card';
import { Compare } from '@/components/session/session';
import { categories, fillPrompt, getPrompt, levels, prompts } from '@/content/data/prompts';
import { getSelfStudy, getSession } from '@/content/data/sessions';

export function generateStaticParams() {
  return prompts.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<'/prompts/[id]'>): Promise<Metadata> {
  const { id } = await props.params;
  const p = getPrompt(id);
  if (!p) return {};
  return { title: p.title, description: fillPrompt(p.text, {}, p.vars).slice(0, 120) };
}

export default async function Page(props: PageProps<'/prompts/[id]'>) {
  const { id } = await props.params;
  const p = getPrompt(id);
  if (!p) notFound();
  const related = (p.related ?? []).map(getPrompt).filter(Boolean);
  const sameCat = prompts.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <PageShell title={p.title} description={`${categories[p.category].label} · ${levels[p.level]}`} full={false}>
      <PromptCard id={p.id} showWhy />

      {p.bad && (
        <>
          <h2>나쁜 예와 비교</h2>
          <Compare bad={p.bad} good={fillPrompt(p.text, {}, p.vars)} />
        </>
      )}

      {p.variants && p.variants.length > 0 && (
        <>
          <h2>이렇게 바꿔 쓸 수도 있어요</h2>
          {p.variants.map((v) => (
            <PromptCard key={v.label} title={v.label} text={v.text} compact />
          ))}
        </>
      )}

      <h2>어느 회차에서 쓰나요</h2>
      <ul>
        {p.sessions.map((n) => {
          // n.5는 깊이 파기 페이지
          const self = Number.isInteger(n) ? undefined : getSelfStudy(n);
          const s = Number.isInteger(n) ? getSession(n) : undefined;
          if (!self && !s) return null;
          return (
            <li key={n}>
              <Link href={self ? self.slug : s!.slug}>{self ? self.title : `${n}회차 · ${s!.title}`}</Link>
            </li>
          );
        })}
        {p.sessions.length === 0 && <li>특정 회차에 속하지 않는 공용 프롬프트입니다. 필요할 때 언제든 쓰세요.</li>}
      </ul>

      {(related.length > 0 || sameCat.length > 0) && (
        <>
          <h2>함께 쓰면 좋은 프롬프트</h2>
          <ul>
            {[...related, ...sameCat.filter((x) => !related.includes(x))].slice(0, 5).map((r) => (
              <li key={r!.id}>
                <Link href={`/prompts/${r!.id}`}>{r!.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p>
        <Link href="/prompts">← 프롬프트 라이브러리로</Link>
      </p>
    </PageShell>
  );
}
