'use client';
import { MousePointerClick } from 'lucide-react';
import { siteUrl } from '@/lib/shared';
import { usePrintMode } from '@/lib/print-mode';

/** 인쇄용 교재에서 누르며 쓰는 부품 자리에 넣는 안내 상자 */
export function PrintPlaceholder({ kind, title }: { kind: string; title: string }) {
  const { url } = usePrintMode();
  const href = `${siteUrl.replace(/^https?:\/\//, '')}${url}`;
  return (
    <div className="not-prose book-avoid my-5 flex items-start gap-3 rounded-xl border border-dashed bg-fd-muted/40 px-4 py-3">
      <MousePointerClick className="mt-0.5 size-5 shrink-0 text-fd-primary" aria-hidden />
      <div className="text-[0.95rem] leading-7">
        <p className="font-semibold">
          {kind} · {title}
        </p>
        <p className="text-fd-muted-foreground">
          직접 눌러 보며 익히는 {kind}입니다. 사이트에서 해 보세요: <span className="font-medium text-fd-foreground">{href}</span>
        </p>
      </div>
    </div>
  );
}
