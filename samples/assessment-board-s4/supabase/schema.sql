-- 수행평가 일정 보드 테이블 (4회차)
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여 넣고 Run 하세요.

create table if not exists public.assessments (
  id          bigint generated always as identity primary key,
  title       text not null,                              -- 평가명
  subject     text,                                       -- 과목
  grade       smallint check (grade between 1 and 3),     -- 학년 (1–3)
  deadline    date not null,                              -- 마감일 (날짜로 저장해야 D-day 계산·정렬이 됨)
  teacher     text,                                       -- 담당 교사
  created_by  uuid default auth.uid(),                    -- 등록한 사람 (로그인 사용자 id, 자동)
  created_at  timestamptz not null default now()
);

-- 행 수준 보안(RLS) 켜기: 켜지 않으면 공개 키만으로 누구나 모든 행을 고치고 지울 수 있다
alter table public.assessments enable row level security;

-- 표에 접근할 기본 권한: 방문자(anon)는 읽기만, 로그인한 사용자(authenticated)는 읽기·추가·수정·삭제
-- (누가 "어느 행"을 다룰 수 있는지는 아래 RLS 정책이 다시 걸러 낸다. 이 줄이 없으면 프로젝트 설정에 따라
--  "permission denied for table assessments" 오류가 날 수 있다)
grant select on table public.assessments to anon;
grant select, insert, update, delete on table public.assessments to authenticated;

-- 정책 1: 누구나 읽기 (로그인하지 않은 학생·학부모도 일정을 볼 수 있다)
create policy "누구나 읽기" on public.assessments
  for select to anon, authenticated using (true);

-- 정책 2: 로그인한 교사만 추가 (등록한 사람 칸에는 본인 id만 들어갈 수 있다)
create policy "로그인한 교사만 추가" on public.assessments
  for insert to authenticated with check (created_by = auth.uid());

-- 정책 3: 등록한 본인만 수정
create policy "등록한 본인만 수정" on public.assessments
  for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());

-- 정책 4: 등록한 본인만 삭제
create policy "등록한 본인만 삭제" on public.assessments
  for delete to authenticated using (created_by = auth.uid());

-- 교육용 가상 데이터 10건 — 새봄고등학교(가상) 2026학년도 2학기. 실제 기관·인물과 관계없음
-- (SQL Editor는 관리자 권한으로 실행되므로 RLS와 상관없이 들어간다.
--  이 10건은 등록한 사람이 비어 있어 앱에서는 아무도 고치거나 지울 수 없다. 지우려면 SQL Editor나 Table Editor에서.)
insert into public.assessments (title, subject, grade, deadline, teacher) values
  ('독서 서평 쓰기', '국어', 2, '2026-11-20', '김가온'),
  ('배드민턴 경기 수행', '체육', 3, '2026-11-23', '윤새솔'),
  ('지역 문제 해결 프로젝트 발표', '통합사회', 1, '2026-11-27', '정마루'),
  ('영어 3분 말하기 발표', '영어', 3, '2026-12-04', '박다올'),
  ('함수의 활용 문제 해결 포트폴리오', '수학', 2, '2026-12-04', '이나래'),
  ('파이썬 기초 프로그래밍 실습', '정보', 1, '2026-12-11', '한바른'),
  ('합창 실기 평가', '음악', 1, '2026-12-18', '임아라'),
  ('겨울방학 과학 탐구 일지 제출', '통합과학', 1, '2027-01-15', '최라온'),
  ('겨울방학 독서 기록장 제출', '국어', 2, '2027-01-29', '김가온'),
  ('방학 탐구 프로젝트 결과물 제출', '정보', 1, '2027-02-04', '한바른');
