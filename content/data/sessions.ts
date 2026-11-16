export type SessionMeta = {
  n: number;
  /** 1부(바이브 코딩 기초) 또는 2부(에이전트 개발) */
  part: 1 | 2;
  slug: string;
  title: string;
  short: string;
  minutes: number;
  stage: string;
  oneLiner: string;
  goals: string[];
  output: string;
  tools: string[];
  color: string;
};

export const parts = {
  1: { title: '1부 · 바이브 코딩 기초', desc: '내 PC의 작은 도구에서 배포한 웹앱까지. 말로 만들고, 확인하고, 안전하게 나눕니다.' },
  2: { title: '2부 · 에이전트 개발', desc: '반복 업무를 맡기는 업무 에이전트에서 학생이 쓰는 교육용 에이전트까지.' },
} as const;

export const sessions: SessionMeta[] = [
  {
    n: 1,
    part: 1,
    slug: '/sessions/1',
    title: '바이브 코딩에서 에이전틱 엔지니어링으로',
    short: '개념과 첫 만남',
    minutes: 50,
    stage: '개념',
    oneLiner: '이제 소프트웨어는 사는 것이 아니라, 말로 주문해서 쓰고 버리는 것이 된다.',
    goals: [
      '바이브 코딩과 에이전틱 엔지니어링의 차이를 내 말로 설명할 수 있다',
      '챗봇(웹 채팅)과 에이전트(Claude Code)의 차이를 안다',
      'Claude Code를 설치하고 내 폴더에서 첫 작업을 시킨다',
      '학생 정보를 AI에 넣지 않는 원칙을 안다',
    ],
    output: 'Claude Code 설치, 교무실 공유폴더 부서별 정리와 현황 보고서',
    tools: ['Claude Code 데스크톱 앱'],
    color: '#0b4a9e',
  },
  {
    n: 2,
    part: 1,
    slug: '/sessions/2',
    title: '인스턴트 소프트웨어: 쓰고 지우는 내 업무 도구',
    short: '내 PC에서 만들기',
    minutes: 50,
    stage: '로컬',
    oneLiner: '평가계획서를 쓰듯 요청하면, 그 요청이 곧 프로그램이 된다.',
    goals: [
      '탐색 → 계획 → 실행 → 검증 4단계로 Claude Code에 일을 시킨다',
      '업무 프롬프트 5요소(목적·입력·출력·조건·검증)로 요청을 쓴다',
      'CLAUDE.md로 "우리 학교, 내 업무 규칙"을 AI에게 알려 둔다',
    ],
    output: '반별 수행평가 점수 취합기, 제출물 파일 정리, 한 장짜리 HTML 도구',
    tools: ['Claude Code', '플랜 모드', 'CLAUDE.md'],
    color: '#0e7490',
  },
  {
    n: 3,
    part: 1,
    slug: '/sessions/3',
    title: '안전망과 공유: Git·GitHub, 그리고 배포',
    short: '되돌리고, 링크로 나누기',
    minutes: 50,
    stage: '공유',
    oneLiner: 'Git은 되돌릴 수 있는 세이브 포인트, 배포는 내 도구가 링크 하나로 동료에게 가는 길이다.',
    goals: [
      '저장소·커밋·푸시·.gitignore를 설명하고, Claude Code에게 커밋과 되돌리기를 시킨다',
      '완성본 웹앱을 Claude Code로 열어 내 PC에서 띄우고 고쳐 본다 (localhost)',
      'GitHub → Vercel 연결로 배포하고, 수정이 자동 반영되는 것을 확인한다',
    ],
    output: '커밋 이력이 있는 GitHub 저장소, 링크로 공유하는 수행평가 일정 보드',
    tools: ['Git', 'GitHub', 'Next.js', 'Vercel'],
    color: '#6d28d9',
  },
  {
    n: 4,
    part: 1,
    slug: '/sessions/4',
    title: '데이터와 AI를 붙인 웹앱',
    short: '저장하고, AI 기능 넣기',
    minutes: 50,
    stage: '데이터·AI',
    oneLiner: '데이터베이스는 여럿이 함께 쓰는 공유 엑셀, Claude API는 내 앱 안에서 일하는 AI다. 둘 다 문단속이 먼저다.',
    goals: [
      '테이블·행·열을 엑셀에 빗대어 설명하고, Supabase를 웹앱에 연결한다',
      '환경변수와 행 수준 보안(RLS)이 왜 필요한지 안다',
      'API 키를 안전하게 보관하고, 앱에 추출·요약 기능을 넣는다',
      '학생 개인정보와 AI에 관한 학교 현장의 기준을 안다',
    ],
    output: '화면에서 등록·수정되는 보드, 평가계획 문서에서 일정을 뽑아 주는 AI 기능',
    tools: ['Supabase', 'Claude API', '환경변수'],
    color: '#b45309',
  },
  {
    n: 5,
    part: 2,
    slug: '/sessions/5',
    title: '내 업무를 맡기는 에이전트: 반복 업무에서 시작하기',
    short: '업무 폴더와 첫 스킬',
    minutes: 50,
    stage: '업무 에이전트',
    oneLiner: '에이전트는 사 오는 것이 아니라, 내 업무 폴더와 규칙과 절차를 알려 주며 길러 내는 것이다.',
    goals: [
      '에이전트를 이루는 네 가지(모델·도구·컨텍스트·권한)를 설명할 수 있다',
      '내 반복 업무 가운데 에이전트에게 맡기기 좋은 일을 고르는 기준을 안다',
      '업무 폴더와 CLAUDE.md로 에이전트의 작업장을 만든다',
      '되풀이하는 지시를 스킬로 저장해 한 단어로 부른다',
    ],
    output: '교무수첩 업무 폴더, 가정통신문 스킬, 공문 요약 스킬',
    tools: ['Claude Code', 'CLAUDE.md', '스킬'],
    color: '#047857',
  },
  {
    n: 6,
    part: 2,
    slug: '/sessions/6',
    title: '에이전트 키우기: 스킬·서브에이전트·연결',
    short: '점검하고, 나누고, 연결하기',
    minutes: 50,
    stage: '확장',
    oneLiner: '잘하는 사람은 혼자 다 하지 않는다. 참고자료를 곁에 두고, 검토를 맡기고, 필요한 곳에 연결한다.',
    goals: [
      '스킬에 참고자료와 스크립트를 붙여 결과를 일정하게 만든다',
      '작성과 검토를 나누는 서브에이전트를 만든다',
      'MCP(커넥터)가 무엇이고 언제 연결하는지 안다',
    ],
    output: '생기부 문구 점검 스킬, 검토 전담 서브에이전트',
    tools: ['스킬', '서브에이전트', 'MCP'],
    color: '#0f766e',
  },
  {
    n: 7,
    part: 2,
    slug: '/sessions/7',
    title: '스스로 도는 에이전트: 예약 실행과 자동화',
    short: '시키지 않아도 하게',
    minutes: 50,
    stage: '자동화',
    oneLiner: '자동화는 사람을 빼는 일이 아니라, 사람이 확인할 자리를 정해 두는 일이다.',
    goals: [
      '예약 작업으로 에이전트를 정해진 시간에 돌린다',
      '로컬·클라우드·대화 중 반복(/loop)의 차이를 안다',
      '자동화에 필요한 안전 설계(읽기 전용, 승인 지점, 기록)를 적용한다',
    ],
    output: '월요일 아침 주간 업무 브리핑, 공문함 자동 정리',
    tools: ['예약 작업', '헤드리스 실행', '훅'],
    color: '#be123c',
  },
  {
    n: 8,
    part: 2,
    slug: '/sessions/8',
    title: '교육용 에이전트 만들기, 그리고 책임 있게 쓰기',
    short: '학생이 쓰는 AI',
    minutes: 50,
    stage: '교육 에이전트',
    oneLiner: '좋은 튜터는 답을 주지 않고 질문한다. 교육용 에이전트의 설계도는 선생님의 수업 철학이다.',
    goals: [
      '교사가 쓰는 AI와 학생이 쓰는 AI의 설계가 어떻게 달라야 하는지 안다',
      '시스템 프롬프트로 답 대신 질문하는 튜터를 설계한다',
      '안전장치(범위 제한·개인정보·비용 한도)를 넣고 시험 질문으로 검증한다',
      '학교에서 AI 도구를 운영할 때의 기준을 정리한다',
    ],
    output: '배포된 과목 학습 도우미, 내 에이전트 운영 계획',
    tools: ['Claude API', '시스템 프롬프트', 'Vercel'],
    color: '#7c3aed',
  },
];

export const getSession = (n: number) => sessions.find((s) => s.n === n)!;

/** 회차 뒤에 혼자 차분히 보는 심화 과정 (n.5) */
export type SelfStudyMeta = {
  n: number;
  slug: string;
  title: string;
  short: string;
  minutes: number;
  focus: string;
  plan: { day: string; minutes: number; what: string; href: string }[];
};

/**
 * plan의 href는 self-{n}.mdx의 제목(##)과 맞춰야 한다.
 * 각 깊이 파기 페이지는 아래 다섯(또는 네) 개의 ## 제목을 그대로 쓴다.
 */
export const selfStudies: SelfStudyMeta[] = [
  {
    n: 1.5,
    slug: '/sessions/self-1',
    title: '1.5 · 깊이 파기: Claude Code와 친해지기',
    short: 'Claude Code와 친해지기',
    minutes: 90,
    focus: '지시하는 법, 계획 보기, 되돌리기를 손에 익히고 문서 작성과 한글(HWP) 파일 다루기까지 해 봅니다.',
    plan: [
      { day: '1단계', minutes: 15, what: '1회차 복습과 Claude Code 화면 다시 보기', href: '#1단계-복습과-화면-익히기' },
      { day: '2단계', minutes: 20, what: '좋은 지시 vs 아쉬운 지시 직접 비교', href: '#2단계-지시를-바꾸면-결과가-바뀐다' },
      { day: '3단계', minutes: 20, what: '플랜 모드와 되돌리기 연습', href: '#3단계-계획-보기와-되돌리기' },
      { day: '4단계', minutes: 20, what: '문서 맡기기 (가정통신문·안내문)와 한글 파일', href: '#4단계-문서도-맡겨-보기' },
      { day: '5단계', minutes: 15, what: '내 반복 업무 적어 보기, 2회차 준비', href: '#5단계-내-업무-정리와-2회차-준비' },
    ],
  },
  {
    n: 2.5,
    slug: '/sessions/self-2',
    title: '2.5 · 깊이 파기: 엑셀·파일 도구 더 만들기',
    short: '엑셀·파일 도구 더 만들기',
    minutes: 90,
    focus: '검증 기준을 스스로 쓰고, 출결·설문·점수 분포 같은 엑셀 작업을 혼자 도구로 만들어 봅니다.',
    plan: [
      { day: '1단계', minutes: 15, what: '2회차 복습, AI가 엑셀을 다루는 원리', href: '#1단계-ai는-엑셀을-어떻게-다루나' },
      { day: '2단계', minutes: 20, what: '이상값 찾기와 검증 기준 쓰기', href: '#2단계-검증-기준을-내가-쓴다' },
      { day: '3단계', minutes: 20, what: '집계표와 분포 보고서 만들기', href: '#3단계-집계와-보고서' },
      { day: '4단계', minutes: 25, what: '내 업무 도구 기획서와 첫 버전', href: '#4단계-내-업무-도구-첫-버전' },
      { day: '5단계', minutes: 10, what: 'CLAUDE.md 다듬기, 3회차 준비', href: '#5단계-claudemd-다듬기와-3회차-준비' },
    ],
  },
  {
    n: 3.5,
    slug: '/sessions/self-3',
    title: '3.5 · 깊이 파기: 커밋하는 습관과 혼자 배포하기',
    short: '커밋 습관과 혼자 배포하기',
    minutes: 110,
    focus: '되돌리는 세 가지 방법을 익히고, 완성본으로 혼자 처음부터 배포한 뒤 보드에 기능을 붙여 봅니다.',
    plan: [
      { day: '1단계', minutes: 15, what: '3회차 복습, Git이 기록하는 것', href: '#1단계-git은-무엇을-기록하나' },
      { day: '2단계', minutes: 25, what: '커밋 쌓기와 되돌리는 세 가지 방법', href: '#2단계-커밋을-쌓고-되돌려-보기' },
      { day: '3단계', minutes: 20, what: '함께 고치기: 브랜치와 풀 리퀘스트', href: '#3단계-함께-고치는-법' },
      { day: '4단계', minutes: 30, what: '혼자 처음부터 배포하고 기능 붙이기', href: '#4단계-혼자서-처음부터-배포' },
      { day: '5단계', minutes: 20, what: 'Vercel 대시보드 익히기, 4회차 준비', href: '#5단계-vercel-대시보드와-4회차-준비' },
    ],
  },
  {
    n: 4.5,
    slug: '/sessions/self-4',
    title: '4.5 · 깊이 파기: 데이터·보안·AI 기능 손에 익히기',
    short: '데이터·보안·AI 기능',
    minutes: 110,
    focus: 'SQL과 RLS 정책을 읽는 눈을 기르고, AI 기능의 비용과 숨은 지시문을 직접 시험해 봅니다.',
    plan: [
      { day: '1단계', minutes: 15, what: '4회차 복습, SQL 네 문장 읽기', href: '#1단계-sql-네-문장만-읽자' },
      { day: '2단계', minutes: 25, what: 'RLS 정책 읽고 두 계정으로 시험', href: '#2단계-rls를-직접-시험한다' },
      { day: '3단계', minutes: 25, what: '항목 하나 추가하고 화면까지 반영', href: '#3단계-항목-하나-추가하기' },
      { day: '4단계', minutes: 25, what: 'AI 기능 비용 어림과 숨은 지시문 시험', href: '#4단계-ai-기능을-의심하며-써-보기' },
      { day: '5단계', minutes: 20, what: '학생 개인정보 점검표, 2부 준비', href: '#5단계-개인정보-점검과-2부-준비' },
    ],
  },
  {
    n: 5.5,
    slug: '/sessions/self-5',
    title: '5.5 · 깊이 파기: 스킬 다듬기와 내 업무 지도 그리기',
    short: '스킬 다듬기와 업무 지도',
    minutes: 110,
    focus: '스킬이 언제 불리는지 시험하며 다듬고, 내 반복 업무를 펼쳐 놓고 맡길 일을 고릅니다.',
    plan: [
      { day: '1단계', minutes: 15, what: '5회차 복습, 에이전트가 일하는 순서', href: '#1단계-에이전트는-어떻게-일하나' },
      { day: '2단계', minutes: 25, what: '스킬 설명을 고치며 불리는 조건 시험', href: '#2단계-스킬이-불리는-순간' },
      { day: '3단계', minutes: 25, what: '내 반복 업무 10개와 자동화 후보 3개', href: '#3단계-내-업무-지도-그리기' },
      { day: '4단계', minutes: 30, what: '스킬 세 개 더 만들기', href: '#4단계-스킬-세-개-더' },
      { day: '5단계', minutes: 15, what: 'CLAUDE.md와 스킬의 역할 나누기, 6회차 준비', href: '#5단계-규칙과-절차-나누기' },
    ],
  },
  {
    n: 6.5,
    slug: '/sessions/self-6',
    title: '6.5 · 깊이 파기: 스크립트 붙이기와 연결 넓히기',
    short: '스크립트와 연결 넓히기',
    minutes: 110,
    focus: '스킬에 스크립트를 붙여 계산은 정확하게 하고, 서브에이전트와 연결을 내 업무에 맞게 설계합니다.',
    plan: [
      { day: '1단계', minutes: 15, what: '6회차 복습, 스킬 폴더 들여다보기', href: '#1단계-스킬-폴더-들여다보기' },
      { day: '2단계', minutes: 25, what: '계산은 스크립트에게: 점검 스킬 고치기', href: '#2단계-계산은-스크립트에게' },
      { day: '3단계', minutes: 25, what: '서브에이전트 설계 세 가지 패턴', href: '#3단계-서브에이전트-설계' },
      { day: '4단계', minutes: 25, what: '연결(MCP) 하나 붙여 보기', href: '#4단계-연결-하나-붙여-보기' },
      { day: '5단계', minutes: 20, what: '동료와 나누기, 7회차 준비', href: '#5단계-동료와-나누기' },
    ],
  },
  {
    n: 7.5,
    slug: '/sessions/self-7',
    title: '7.5 · 깊이 파기: 자동화 운영하기',
    short: '자동화 운영하기',
    minutes: 110,
    focus: '예약 작업의 기록을 읽고 고치는 법, 권한을 좁히는 법, 자동화하면 안 되는 일을 가려내는 법을 익힙니다.',
    plan: [
      { day: '1단계', minutes: 15, what: '7회차 복습, 세 가지 예약 방식 고르기', href: '#1단계-어디서-돌릴-것인가' },
      { day: '2단계', minutes: 25, what: '실행 기록 읽고 지시문 고치기', href: '#2단계-기록을-읽고-고친다' },
      { day: '3단계', minutes: 25, what: '권한 좁히기와 승인 지점 정하기', href: '#3단계-권한과-승인-지점' },
      { day: '4단계', minutes: 25, what: '터미널에서 한 줄로 실행해 보기', href: '#4단계-한-줄로-실행하기' },
      { day: '5단계', minutes: 20, what: '자동화하면 안 되는 일, 8회차 준비', href: '#5단계-자동화하면-안-되는-일' },
    ],
  },
  {
    n: 8.5,
    slug: '/sessions/self-8',
    title: '8.5 · 과정 이후 4주 로드맵',
    short: '과정 이후 4주 로드맵',
    minutes: 150,
    focus: '4주 동안 내 에이전트 하나를 실제 업무에 올리고, 동료와 나누는 단계까지 갑니다.',
    plan: [
      { day: '1주차', minutes: 40, what: '하나만 고르고 운영 계획 쓰기', href: '#1주차-하나만-고른다' },
      { day: '2주차', minutes: 40, what: '첫 버전과 시험 질문 세트로 검증', href: '#2주차-첫-버전과-검증' },
      { day: '3주차', minutes: 40, what: '동료 1명(또는 한 반)에게 시범 운영', href: '#3주차-시범-운영' },
      { day: '4주차', minutes: 30, what: '계속 쓸지 정하고 나누기', href: '#4주차-계속-쓸지-정하기' },
    ],
  },
];

export const getSelfStudy = (n: number) => selfStudies.find((s) => s.n === n);

/** 진도 합계에 쓰는 모든 과정 번호 (회차 + n.5) */
export const allTracks = [...sessions.map((s) => s.n), ...selfStudies.map((s) => s.n)].sort((a, b) => a - b);
