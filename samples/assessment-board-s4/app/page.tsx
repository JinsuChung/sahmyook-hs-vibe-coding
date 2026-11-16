import { Board } from '@/components/board';

export default function Page() {
  return (
    <main>
      <h1>새봄고 수행평가 일정 보드</h1>
      <Board />
      <p className="meta foot">교육용 가상 데이터 — 실제 기관·인물과 관계없음 · 4회차 완성본 (Supabase + Claude API)</p>
    </main>
  );
}
