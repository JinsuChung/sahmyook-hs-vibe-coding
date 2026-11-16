export type Category =
  | 'explore'
  | 'plan'
  | 'files'
  | 'excel'
  | 'docs'
  | 'git'
  | 'web'
  | 'db'
  | 'ai'
  | 'security'
  | 'fix'
  | 'class'
  | 'agent'
  | 'auto';

export const categories: Record<Category, { label: string; desc: string }> = {
  explore: { label: '파악·탐색', desc: '폴더와 파일을 AI에게 먼저 보여 주기' },
  plan: { label: '기획·인터뷰', desc: '만들기 전에 무엇을 만들지 정하기' },
  files: { label: '파일 정리', desc: '이름 바꾸기, 분류, 중복 찾기' },
  excel: { label: '엑셀·데이터', desc: '취합, 검산, 집계, 차트' },
  docs: { label: '문서', desc: '초안, 형식 통일, 비교, 추출' },
  git: { label: 'Git·GitHub', desc: '저장, 되돌리기, 업로드' },
  web: { label: '웹·배포', desc: '웹앱 만들기, 실행, 배포' },
  db: { label: '데이터베이스', desc: '테이블 설계, 연결, 입력 폼' },
  ai: { label: 'AI 기능', desc: '요약, 추출, 분류를 앱에 넣기' },
  security: { label: '보안·점검', desc: '키 노출, 개인정보, 권한 점검' },
  fix: { label: '오류 해결·설명', desc: '에러 고치기, 쉽게 설명 듣기' },
  class: { label: '수업·평가', desc: '수업 자료, 평가 계획, 피드백 초안' },
  agent: { label: '에이전트·스킬', desc: '업무 폴더, 스킬, 서브에이전트, 연결' },
  auto: { label: '자동화·예약', desc: '예약 작업, 한 줄 실행, 점검과 기록' },
};

export type Level = 'intro' | 'basic' | 'applied';
export const levels: Record<Level, string> = { intro: '입문', basic: '기본', applied: '응용' };

export type PromptVar = { key: string; label: string; placeholder: string };
export type Prompt = {
  id: string;
  title: string;
  category: Category;
  /** 쓰이는 회차 번호. 깊이 파기는 1.5처럼 쓴다 */
  sessions: number[];
  level: Level;
  /** 플랜 모드에서 쓰기를 권장 */
  plan?: boolean;
  /** {{key}} 자리에 변수가 들어간다 */
  text: string;
  vars?: PromptVar[];
  why?: string;
  bad?: string;
  variants?: { label: string; text: string }[];
  related?: string[];
};

/** 변수 한 개를 짧게 쓰는 도우미: v('key', '이름', '예시') */
export const v = (key: string, label: string, placeholder: string): PromptVar => ({ key, label, placeholder });
