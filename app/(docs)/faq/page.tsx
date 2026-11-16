import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { PageShell } from '@/components/ui/page-shell';
import { faqGroups, faqs } from '@/content/data/faq';

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description: '계정·비용, 설치, 보안·개인정보, 오류, 학교 업무 적용, 에이전트·자동화에 대한 질문과 답.',
};

export default function Page() {
  return (
    <PageShell
      title="자주 묻는 질문"
      description={`선생님들이 자주 묻는 질문 ${faqs.length}개. 학생 정보와 생활기록부처럼 조심해야 할 주제는 "보안·개인정보"에 모았습니다. 찾는 답이 없으면 수업 시간에 물어보세요.`}
      full={false}
    >
      {faqGroups.map((g) => (
        <section key={g}>
          <h2>{g}</h2>
          <Accordions>
            {faqs
              .filter((f) => f.group === g)
              .map((f) => (
                <Accordion key={f.q} title={f.q}>
                  <p>{f.a}</p>
                  {f.links && (
                    <ul>
                      {f.links.map((l) => (
                        <li key={l.href}>
                          {l.href.startsWith('/') ? (
                            <Link href={l.href}>{l.label}</Link>
                          ) : (
                            <a href={l.href} target="_blank" rel="noreferrer">
                              {l.label}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </Accordion>
              ))}
          </Accordions>
        </section>
      ))}
    </PageShell>
  );
}
