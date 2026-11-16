import type { Term } from '../glossary';

export const glossaryS1: Term[] = [
  { id: 'vibe-coding', term: '바이브 코딩', en: 'Vibe coding', def: '코드를 직접 쓰지 않고 말로 설명해서 AI가 소프트웨어를 만들게 하는 방식. 2025년 2월 안드레이 카파시가 처음 쓴 말이다.', analogy: '"알아서 해 주세요" 하고 맡기는 업무 부탁', session: 1 },
  { id: 'agentic-engineering', term: '에이전틱 엔지니어링', en: 'Agentic engineering', def: 'AI 에이전트가 계획·작성·시험을 하고, 사람은 무엇을 만들지 정하고 계획을 검토하고 결과를 검증하는 일하는 방식.', analogy: '수업 설계 → 과제 안내 → 채점과 피드백의 순서로 AI에게 일 시키기', session: 1 },
  { id: 'agent', term: '에이전트', en: 'Agent', def: '스스로 파일을 읽고, 만들고, 명령을 실행하고, 결과를 확인하면서 목표를 이룰 때까지 되풀이하는 AI.', analogy: '방법만 알려 주는 안내 데스크가 아니라 일을 끝까지 해 오는 업무 담당자', session: 1 },
  { id: 'chatbot', term: '챗봇', en: 'Chatbot', def: '질문에 답을 주는 대화형 AI. 파일을 올리고, 답을 복사해 저장하고, 실행하는 일은 사람이 직접 한다.', analogy: '물으면 답해 주는 안내 데스크', session: 1 },
  { id: 'prompt', term: '프롬프트', en: 'Prompt', def: 'AI에게 주는 지시문. 대상, 결과 모양, 하지 말 것, 확인 기준이 들어 있을수록 결과가 좋아진다.', analogy: '학생에게 주는 과제 안내문', session: 1 },
  { id: 'instant-software', term: '인스턴트 소프트웨어', en: 'Instant software', def: '필요할 때 말로 만들어 쓰고, 필요 없으면 지우는 작은 업무 도구. 일회용(disposable) 소프트웨어라고도 한다.', analogy: '그 시간에만 쓰고 버리는 수업 활동지', session: 1 },
  { id: 'claude-code', term: 'Claude Code', def: 'Anthropic이 만든 에이전트형 도구. 내 컴퓨터의 폴더를 직접 열어 파일을 다루고 프로그램을 만든다. Claude 데스크톱 앱의 Code 탭에서 쓸 수 있다.', session: 1 },
  { id: 'permission', term: '권한 승인', en: 'Permission', def: 'Claude Code가 파일을 고치거나 명령을 실행하기 전에 사용자에게 허락을 구하는 절차. 무엇을 하려는지 읽고 허용하거나 거부한다.', analogy: '읽고 누르는 결재 버튼', session: 1 },
  { id: 'hwp', term: '한글 파일(HWP)', en: 'HWP', def: '한컴오피스 한글의 문서 형식. 속을 바로 읽기 어려운 바이너리 형식이라 AI 도구가 곧바로 읽지 못하는 경우가 있다. Claude Code에 맡길 때는 한글에서 PDF·DOCX·HWPX로 저장해서 넘기는 것이 기본이다.', analogy: '봉투에 든 서류. 꺼내서(다른 형식으로 저장해서) 건네야 읽을 수 있다', session: 1 },
  { id: 'hwpx', term: 'HWPX', en: 'HWPX', def: '한글의 개방형 문서 형식. 국가표준(KS X 6101)인 OWPML을 따르고, ZIP 묶음 안에 XML 파일이 들어 있는 구조라 기계가 내용을 읽기 쉽다. 한글의 [파일-다른 이름으로 저장하기]에서 "한/글 표준 문서(*.hwpx)"로 저장한다.', session: 1 },
  { id: 'at-mention', term: '@ 파일 지정', en: '@mention', def: '입력창에 @를 치고 파일 이름을 이어 써서 "이 파일을 읽어라"라고 짚어 주는 방법. 어느 파일을 말하는지 AI가 추측하지 않게 된다.', analogy: '"3쪽 표를 보세요" 하고 자료를 짚어 주기', session: 1 },
];
