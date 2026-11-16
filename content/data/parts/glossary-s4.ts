import type { Term } from '../glossary';

export const glossaryS4: Term[] = [
  { id: 'database', term: '데이터베이스', en: 'Database', def: '여러 사람과 프로그램이 동시에 읽고 쓰는 데이터 저장소. 누가 무엇을 읽고 쓸 수 있는지 규칙으로 정할 수 있다.', analogy: '문단속이 되는 교무실 공유 엑셀', session: 4 },
  { id: 'table', term: '테이블', en: 'Table', def: '데이터베이스 안의 표 한 장. 엑셀의 시트에 해당한다. 수행평가 일정 보드는 assessments 테이블을 쓴다.', analogy: '엑셀 시트 한 장', session: 4 },
  { id: 'column', term: '열(컬럼)', en: 'Column', def: '테이블의 세로 칸. 엑셀의 열 제목에 해당하며, 열마다 글자·숫자·날짜 같은 값의 종류를 정해 둔다.', session: 4 },
  { id: 'row', term: '행', en: 'Row', def: '테이블의 한 줄. 데이터 한 건(예: 수행평가 한 건)에 해당한다.', session: 4 },
  { id: 'supabase', term: 'Supabase', def: '데이터베이스, 로그인, 파일 저장, 관리 화면을 묶어 제공하는 서비스. 표를 엑셀처럼 보고 고치는 화면(Table Editor)이 있어 처음 쓰기에 쉽다.', session: 4 },
  { id: 'sql', term: 'SQL', def: '데이터베이스에 표를 만들고 데이터를 조회·추가·수정·삭제할 때 쓰는 언어. 직접 쓰지 않아도 select·insert·update·delete 네 문장을 읽을 줄 알면 AI가 만든 SQL을 점검할 수 있다.', session: 4 },
  { id: 'rls', term: 'RLS(행 수준 보안)', en: 'Row Level Security', def: '"누가 어느 행을 읽고 쓸 수 있는지"를 데이터베이스에 정책으로 적어 두는 기능. 화면이 아니라 데이터베이스가 직접 막는다.', analogy: '결재 문서의 열람·수정 권한', session: 4 },
  { id: 'env', term: '환경변수', en: 'Environment variable', def: '키처럼 코드에 직접 적으면 안 되는 값을 코드 밖에 따로 두는 자리. 내 PC에서는 .env.local 파일, 배포본에서는 Vercel의 환경변수 설정에 둔다.', analogy: '교무실 열쇠 보관함', session: 4 },
  { id: 'anon-key', term: '공개 키', en: 'Publishable key (anon)', def: '브라우저 코드에 들어가도 되는 Supabase 키. 이 키로 할 수 있는 일은 RLS 정책이 정하므로, RLS가 켜져 있어야 안전하다.', session: 4 },
  { id: 'service-key', term: '비밀 키', en: 'Secret key (service_role)', def: 'RLS를 건너뛰고 모든 일을 할 수 있는 Supabase 키. 서버 쪽 환경변수에만 두며, 이 과정의 보드에서는 아예 쓰지 않는다.', analogy: '모든 문을 여는 마스터키', session: 4 },
  { id: 'api', term: 'API', def: '프로그램끼리 정해진 방식으로 요청하고 응답을 주고받는 창구. 내 웹앱이 Claude에게 "이 문서에서 일정을 뽑아 줘"라고 부탁할 때 이 창구를 쓴다.', analogy: '행정실 민원 창구', session: 4 },
  { id: 'api-key', term: 'API 키', en: 'API key', def: 'API를 쓸 수 있게 해 주는 비밀 열쇠. 누가 쓰든 요금은 키 주인에게 청구되므로 비밀번호처럼 다루고, 노출되면 바로 폐기하고 새로 만든다.', session: 4 },
  { id: 'token', term: '토큰', en: 'Token', def: 'AI가 글을 읽고 쓰는 단위. API 요금은 읽은 양(입력 토큰)과 쓴 양(출력 토큰)으로 계산한다.', analogy: '복사기 사용 매수', session: 4 },
  { id: 'claude-api', term: 'Claude API', def: '내가 만든 프로그램이 Claude를 불러 쓰는 통로. Claude Code가 "만들 때 쓰는 AI"라면 Claude API는 "만든 앱 안에서 일하는 AI"이며, 구독료와 별도로 쓴 만큼 낸다.', session: 4 },
  { id: 'prompt-injection', term: '프롬프트 인젝션', en: 'Prompt injection', def: '문서·메일·웹페이지에 숨긴 문장으로 AI를 조종하려는 공격. "이전 지시를 무시하라" 같은 문장이 대표적이다.', analogy: '결재 서류 사이에 끼워 넣은 가짜 지시 쪽지', session: 4 },
  { id: 'pseudonymize', term: '가명 처리', def: '이름·학번처럼 누구인지 알 수 있는 값을 임의 코드로 바꾸는 일. 코드와 이름의 대응표는 따로, 내 PC에만 둔다. 대응표와 합치면 다시 알아볼 수 있으므로 가명 처리한 자료도 조심해서 다룬다.', session: 4 },
  { id: 'personal-info', term: '개인정보', def: '이름, 학번, 연락처, 성적, 상담·건강·가정 정보처럼 살아 있는 개인을 알아볼 수 있는 정보. 다른 정보와 합쳐서 알아볼 수 있는 것도 포함한다. 학생 개인정보는 AI에 넣지 않는 것이 이 과정의 원칙이다.', session: 4 },
];
