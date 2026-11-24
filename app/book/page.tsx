import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { PrintMode } from '@/lib/print-mode';
import { parts } from '@/content/data/sessions';
import { quizzes } from '@/content/data/quizzes';
import { glossary } from '@/content/data/glossary';
import { faqs, faqGroups } from '@/content/data/faq';
import { answerText } from '@/lib/quiz-print';
import { appName, audience, instructor, siteUrl } from '@/lib/shared';
import { BookToolbar, ChapterMarker, TocPage } from './book-client';

export const metadata: Metadata = {
  title: '인쇄용 교재',
  description: `${appName} 전체 내용을 한 권으로 묶은 인쇄용 페이지`,
  robots: { index: false, follow: false },
};

type Chapter = { id: string; slug: string[]; eyebrow: string };
type Part = { id: string; title: string; desc?: string; chapters: Chapter[] };

const sessionChapters = (from: number, to: number): Chapter[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i).flatMap((n) => [
    { id: `s${n}`, slug: ['sessions', String(n)], eyebrow: `${n}회차 · 수업` },
    { id: `s${n}5`, slug: ['sessions', `self-${n}`], eyebrow: `${n}.5 · 수업 뒤 혼자` },
  ]);

const outline: Part[] = [
  {
    id: 'p0',
    title: '시작하기',
    desc: '과정 소개, 연수 전 준비, 개발 환경 만들기',
    chapters: [
      { id: 'c-start', slug: ['start'], eyebrow: '시작하기' },
      { id: 'c-signup', slug: ['start', 'signup'], eyebrow: '시작하기' },
      { id: 'c-flow', slug: ['start', 'flow'], eyebrow: '시작하기' },
      { id: 'c-setup', slug: ['start', 'setup'], eyebrow: '시작하기' },
    ],
  },
  { id: 'p1', title: parts[1].title, desc: parts[1].desc, chapters: sessionChapters(1, 4) },
  { id: 'p2', title: parts[2].title, desc: parts[2].desc, chapters: sessionChapters(5, 8) },
  {
    id: 'p3',
    title: '과정 이후',
    desc: '이 저장소를 가져다 내 교과와 내 교수법의 수업 사이트로',
    chapters: [{ id: 'c-remix', slug: ['remix'], eyebrow: '과정 이후' }],
  },
];

const appendix = [
  { id: 'a-quiz', title: '부록 A · 복습 퀴즈 정답과 해설' },
  { id: 'a-glossary', title: '부록 B · 용어사전' },
  { id: 'a-faq', title: '부록 C · 자주 묻는 질문' },
];

const PAGE_CSS = `
@page {
  size: A4;
  margin: 17mm 15mm 18mm;
  @top-right { content: "${appName}"; font-family: Pretendard, sans-serif; font-size: 7.5pt; color: #9aa3b2; }
  @bottom-center { content: counter(page); font-family: Pretendard, sans-serif; font-size: 8.5pt; color: #6b7486; }
}
@page cover {
  margin: 0;
  @top-right { content: none; }
  @bottom-center { content: none; }
}
`;

const quizLabel = (k: number) => (Number.isInteger(k) ? `${k}회차` : `깊이 파기 ${k}`);

export default function BookPage() {
  const resolved = outline.map((p) => ({
    ...p,
    chapters: p.chapters.map((c) => {
      const page = source.getPage(c.slug);
      if (!page) notFound();
      return { ...c, page };
    }),
  }));

  const toc = [
    ...resolved.map((p) => ({
      id: p.id,
      title: p.title,
      items: p.chapters.map((c) => ({ id: c.id, title: c.page.data.title, eyebrow: c.eyebrow })),
    })),
    { id: 'p-appendix', title: '부록', items: appendix.map((a) => ({ id: a.id, title: a.title, eyebrow: '' })) },
  ];

  const quizKeys = Object.keys(quizzes)
    .map(Number)
    .sort((a, b) => a - b);
  const host = siteUrl.replace(/^https?:\/\//, '');

  return (
    <div className="book">
      {/* PDF에 글꼴 조각이 수백 개 들어가지 않도록 교재는 통째 글꼴(굵기별 한 파일)을 쓴다 */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        precedence="default"
      />
      <style>{PAGE_CSS}</style>
      <BookToolbar />

      {/* 표지 */}
      <section className="book-cover">
        <div className="book-cover-inner">
          <p className="book-cover-kicker">{audience}</p>
          <h1 className="book-cover-title">
            {appName.includes('바꾸는 ') ? (
              <>
                {appName.split('바꾸는 ')[0]}바꾸는
                <br />
                {appName.split('바꾸는 ')[1]}
              </>
            ) : (
              appName
            )}
          </h1>
          <p className="book-cover-sub">Claude Code로 내 업무 도구를 말로 만들고, 일을 맡길 AI 에이전트를 길러 내는 8회차 과정</p>
          <ul className="book-cover-parts">
            <li>시작하기 · 가입과 설치, 한번에 따라가는 흐름</li>
            <li>{parts[1].title} (1–4회차)</li>
            <li>{parts[2].title} (5–8회차)</li>
            <li>과정 이후 · 내 수업 사이트 만들기</li>
            <li>부록 · 퀴즈 정답, 용어사전, 자주 묻는 질문</li>
          </ul>
          <div className="book-cover-foot">
            <p>강의 · {instructor}</p>
            <p>{host}</p>
            <p>2026년 11월판 · 실습 자료는 모두 가상 데이터입니다</p>
          </div>
        </div>
      </section>

      <TocPage toc={toc} />

      {resolved.map((p) => (
        <div key={p.id}>
          <section className="book-part">
            <ChapterMarker id={p.id} />
            <p className="book-part-kicker">PART</p>
            <h1 className="book-part-title">{p.title}</h1>
            {p.desc && <p className="book-part-desc">{p.desc}</p>}
            <ol className="book-part-list">
              {p.chapters.map((c) => (
                <li key={c.id}>{c.page.data.title}</li>
              ))}
            </ol>
          </section>

          {p.chapters.map((c) => {
            const MDX = c.page.data.body;
            return (
              <article key={c.id} className="book-chapter">
                <div className="book-chapter-head">
                  <ChapterMarker id={c.id} />
                  <p className="book-chapter-eyebrow">{c.eyebrow}</p>
                  <h1 className="book-chapter-title">{c.page.data.title}</h1>
                  {c.page.data.description && <p className="book-chapter-desc">{c.page.data.description}</p>}
                  <p className="book-chapter-url">
                    {host}
                    {c.page.url}
                  </p>
                </div>
                <PrintMode url={c.page.url}>
                  <div className="prose max-w-none">
                    <MDX components={getMDXComponents({ a: createRelativeLink(source, c.page) })} />
                  </div>
                </PrintMode>
              </article>
            );
          })}
        </div>
      ))}

      {/* 부록 A: 퀴즈 정답 */}
      <article className="book-chapter">
        <div className="book-chapter-head">
          <ChapterMarker id="a-quiz" />
          <p className="book-chapter-eyebrow">부록</p>
          <h1 className="book-chapter-title">{appendix[0].title}</h1>
          <p className="book-chapter-desc">회차와 깊이 파기 끝의 복습 퀴즈 정답입니다. 정렬 문항은 교재에 적힌 기호 순서로 답을 적었습니다.</p>
        </div>
        <div className="prose max-w-none">
          {quizKeys.map((k) => (
            <section key={k} className="book-answers">
              <h3>{quizLabel(k)}</h3>
              <ol>
                {quizzes[k].map((q, i) => (
                  <li key={i}>
                    <b>정답 {answerText(q)}</b> · {q.explain}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </article>

      {/* 부록 B: 용어사전 */}
      <article className="book-chapter">
        <div className="book-chapter-head">
          <ChapterMarker id="a-glossary" />
          <p className="book-chapter-eyebrow">부록</p>
          <h1 className="book-chapter-title">{appendix[1].title}</h1>
          <p className="book-chapter-desc">본문에 나온 용어를 처음 나오는 회차 순서로 모았습니다.</p>
        </div>
        <dl className="book-glossary">
          {[...glossary]
            .sort((a, b) => (a.session ?? 0) - (b.session ?? 0))
            .map((t) => (
              <div key={t.id} className="book-avoid">
                <dt>
                  {t.term}
                  {t.en && <span className="book-glossary-en"> {t.en}</span>}
                  {t.session && <span className="book-glossary-session"> · {t.session}회차</span>}
                </dt>
                <dd>
                  {t.def}
                  {t.analogy && <span className="book-glossary-analogy"> 비유: {t.analogy}</span>}
                </dd>
              </div>
            ))}
        </dl>
      </article>

      {/* 부록 C: FAQ */}
      <article className="book-chapter">
        <div className="book-chapter-head">
          <ChapterMarker id="a-faq" />
          <p className="book-chapter-eyebrow">부록</p>
          <h1 className="book-chapter-title">{appendix[2].title}</h1>
        </div>
        <div className="prose max-w-none">
          {faqGroups.map((g) => (
            <section key={g}>
              <h2>{g}</h2>
              {faqs
                .filter((f) => f.group === g)
                .map((f) => (
                  <div key={f.q} className="book-faq book-avoid">
                    <p className="book-faq-q">Q. {f.q}</p>
                    <p className="book-faq-a">{f.a}</p>
                  </div>
                ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
