'use client';
import type { ComponentProps } from 'react';
import { Tab as FdTab, Tabs as FdTabs } from 'fumadocs-ui/components/tabs';
import { usePrintMode } from '@/lib/print-mode';

/** 인쇄용 교재에서는 탭을 모두 펼쳐 차례로 보여 준다 */
export function Tabs(props: ComponentProps<typeof FdTabs>) {
  const print = usePrintMode();
  if (print.on) return <div className="my-4 grid gap-3">{props.children}</div>;
  return <FdTabs {...props} />;
}

export function Tab(props: ComponentProps<typeof FdTab>) {
  const print = usePrintMode();
  if (print.on)
    return (
      <div className="book-avoid rounded-xl border px-4 py-1">
        <p className="not-prose mt-2 text-sm font-bold text-fd-primary">{props.value}</p>
        <div>{props.children}</div>
      </div>
    );
  return <FdTab {...props} />;
}
