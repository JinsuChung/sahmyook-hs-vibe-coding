import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: '새봄고 수행평가 일정 보드',
  description: '학년·과목별 수행평가 마감을 D-day 순으로 보여 주는 보드 (교육용 가상 데이터)',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
