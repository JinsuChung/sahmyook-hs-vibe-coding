import type { Question } from '@/content/data/quizzes';

/** 인쇄용 교재(/book)의 퀴즈 기호와 정답. 서버와 브라우저 양쪽에서 쓴다 */
export const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];
export const HANGUL = ['가', '나', '다', '라', '마', '바', '사', '아'];

/** 인쇄용: 정렬 문항의 보기를 늘 같은 순서로 섞는다. 화면 위치 p에 원래 항목 printOrder[p]를 보인다 */
export function printOrder(n: number): number[] {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const m = [3, 5, 7, 11, 13].find((x) => gcd(x, n) === 1) ?? 1;
  return Array.from({ length: n }, (_, p) => (p * m + 1) % n);
}

/** 인쇄용 정답 한 줄 */
export function answerText(q: Question): string {
  if (q.type === 'single') return CIRCLED[q.answer];
  if (q.type === 'ox') return q.answer ? 'O' : 'X';
  const pos = printOrder(q.items.length);
  return q.items.map((_, i) => HANGUL[pos.indexOf(i)]).join(' → ');
}

