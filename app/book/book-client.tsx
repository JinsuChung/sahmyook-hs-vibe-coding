'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Printer } from 'lucide-react';

type TocItem = { id: string; title: string; eyebrow: string };
type TocPart = { id: string; title: string; items: TocItem[] };

function useQuery() {
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => setQ(new URLSearchParams(window.location.search)), []);
  return q;
}

/** 화면에서만 보이는 위쪽 막대. 인쇄할 때는 숨는다. 교재는 늘 밝은 테마로 보인다 */
export function BookToolbar() {
  useEffect(() => {
    const el = document.documentElement;
    const wasDark = el.classList.contains('dark');
    el.classList.remove('dark');
    el.classList.add('light');
    el.style.colorScheme = 'light';
    el.dataset.book = '';
    return () => {
      delete el.dataset.book;
      el.style.colorScheme = '';
      el.classList.remove('light');
      if (wasDark) el.classList.add('dark');
    };
  }, []);
  return (
    <div className="book-toolbar">
      <Link href="/" className="book-toolbar-link">
        <ArrowLeft className="size-4" /> 사이트로
      </Link>
      <p className="book-toolbar-note">
        전체 교재를 한 권으로 묶은 인쇄용 페이지입니다. 인쇄 창에서 용지는 <b>A4</b>, <b>배경 그래픽</b>을 켜고, 머리글·바닥글은 끄세요.
      </p>
      <a href="/downloads/sahmyook-hs-vibe-coding-book.pdf" className="book-toolbar-link">
        <Download className="size-4" /> 완성 PDF 받기
      </a>
      <button type="button" onClick={() => window.print()} className="book-toolbar-btn">
        <Printer className="size-4" /> 인쇄 / PDF로 저장
      </button>
    </div>
  );
}

/** PDF 만들기 1차에서 장이 시작하는 쪽을 찾기 위한 표식 (?markers=1 일 때만) */
export function ChapterMarker({ id }: { id: string }) {
  const q = useQuery();
  if (!q?.has('markers')) return null;
  return <span className="book-marker">{`@@${id}@@`}</span>;
}

/** 차례. ?pages={"s1":12,...} 가 있으면 쪽 번호를 붙인다 */
export function TocPage({ toc }: { toc: TocPart[] }) {
  const q = useQuery();
  let pages: Record<string, number> = {};
  try {
    pages = JSON.parse(q?.get('pages') ?? '{}');
  } catch {
    pages = {};
  }
  return (
    <section className="book-toc">
      <h1 className="book-toc-title">차례</h1>
      {toc.map((p) => (
        <div key={p.id} className="book-toc-part">
          <p className="book-toc-part-title">
            <span>{p.title}</span>
            {pages[p.id] && <span className="book-toc-page">{pages[p.id]}</span>}
          </p>
          <ol>
            {p.items.map((it) => (
              <li key={it.id}>
                <span className="book-toc-item">{it.title}</span>
                <span className="book-toc-dots" aria-hidden />
                <span className="book-toc-page">{pages[it.id] ?? ''}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
