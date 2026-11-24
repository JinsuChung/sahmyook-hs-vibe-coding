'use client';
import { createContext, useContext, type ReactNode } from 'react';

/**
 * 인쇄용 교재(/book)에서 켜지는 모드.
 * 켜지면 접힌 내용을 모두 펼치고, 운영체제별 설명을 둘 다 보여 주고, 누르는 기능은 인쇄에 맞는 모양으로 바꾼다.
 */
const PrintModeCtx = createContext<{ on: boolean; url: string }>({ on: false, url: '' });

export function PrintMode({ url = '', children }: { url?: string; children: ReactNode }) {
  return <PrintModeCtx.Provider value={{ on: true, url }}>{children}</PrintModeCtx.Provider>;
}

export const usePrintMode = () => useContext(PrintModeCtx);
