export type Assessment = {
  id: number;
  title: string; // 평가명
  subject: string; // 과목
  grade: number; // 학년 (1–3)
  deadline: string; // 마감일 YYYY-MM-DD
  teacher: string; // 담당 교사
};

// 교육용 가상 데이터 — 새봄고등학교(가상) 2026학년도 2학기. 실제 기관·인물과 관계없음
export const assessments: Assessment[] = [
  { id: 1, title: '독서 서평 쓰기', subject: '국어', grade: 2, deadline: '2026-11-20', teacher: '김가온' },
  { id: 2, title: '배드민턴 경기 수행', subject: '체육', grade: 3, deadline: '2026-11-23', teacher: '윤새솔' },
  { id: 3, title: '지역 문제 해결 프로젝트 발표', subject: '통합사회', grade: 1, deadline: '2026-11-27', teacher: '정마루' },
  { id: 4, title: '영어 3분 말하기 발표', subject: '영어', grade: 3, deadline: '2026-12-04', teacher: '박다올' },
  { id: 5, title: '함수의 활용 문제 해결 포트폴리오', subject: '수학', grade: 2, deadline: '2026-12-04', teacher: '이나래' },
  { id: 6, title: '파이썬 기초 프로그래밍 실습', subject: '정보', grade: 1, deadline: '2026-12-11', teacher: '한바른' },
  { id: 7, title: '합창 실기 평가', subject: '음악', grade: 1, deadline: '2026-12-18', teacher: '임아라' },
  { id: 8, title: '겨울방학 과학 탐구 일지 제출', subject: '통합과학', grade: 1, deadline: '2027-01-15', teacher: '최라온' },
  { id: 9, title: '겨울방학 독서 기록장 제출', subject: '국어', grade: 2, deadline: '2027-01-29', teacher: '김가온' },
  { id: 10, title: '방학 탐구 프로젝트 결과물 제출', subject: '정보', grade: 1, deadline: '2027-02-04', teacher: '한바른' },
];
