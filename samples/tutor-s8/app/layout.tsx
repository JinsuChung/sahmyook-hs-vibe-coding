import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { tutorConfig } from '@/lib/tutor-config';
import './globals.css';

export const metadata = {
  title: `${tutorConfig.appName} · ${tutorConfig.subject}`,
  description: `${tutorConfig.subject} ${tutorConfig.unit} 단원 학습 도우미 (AI가 만든 답변이며 틀릴 수 있어요)`,
  robots: { index: false, follow: false }, // 수업용 도구라 검색 엔진에 노출하지 않는다
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
