import { createClient } from '@supabase/supabase-js';

// 공개 키(anon/publishable)만 씁니다. 화면에 노출돼도 되는 키이며,
// 누가 무엇을 할 수 있는지는 데이터베이스의 RLS 정책이 지킵니다.
// 비밀 키(service_role)는 이 앱 어디에도 넣지 않습니다.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'missing-key');

/** public.assessments 테이블의 한 줄 */
export type Assessment = {
  id: number;
  title: string; // 평가명
  subject: string | null; // 과목
  grade: number | null; // 학년 (1–3)
  deadline: string; // 마감일 YYYY-MM-DD
  teacher: string | null; // 담당 교사
  created_by: string | null; // 등록한 사람 (로그인 사용자 id)
  created_at: string;
};

/** 등록 폼에 채워 넣는 값 (AI 추출 결과도 이 모양으로 온다) */
export type AssessmentDraft = {
  title: string;
  subject: string;
  grade: number | null;
  deadline: string;
  teacher: string;
};
