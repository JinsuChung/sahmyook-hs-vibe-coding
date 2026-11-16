// ─────────────────────────────────────────────────────────────
// 새봄 학습 도우미 설정 파일
//
// 선생님이 고치는 곳은 이 파일 하나입니다.
// 과목·단원·학습 목표·다루는 범위·말투·사용 제한을 여기서 정하면
// lib/tutor-prompt.ts 가 이 값으로 튜터의 지시문(시스템 프롬프트)을 만듭니다.
//
// 고치는 요령
// - 따옴표('  ') 안의 글만 바꾸세요. 쉼표와 괄호는 그대로 둡니다.
// - 목록(대괄호 [ ])은 줄을 더하거나 빼도 됩니다. 줄 끝의 쉼표를 잊지 마세요.
// - 고친 뒤에는 eval/questions.md 의 시험 질문을 다시 넣어 보세요.
// - 여기에 학생 이름·성적 같은 개인정보나 비밀번호·API 키를 적지 마세요.
//   (이 파일의 과목·단원·학습 목표·예시 질문은 학생 화면에 그대로 보입니다.)
// ─────────────────────────────────────────────────────────────

export type TutorConfig = {
  appName: string;
  school: string;
  grade: string;
  subject: string;
  unit: string;
  goals: string[];
  scope: string[];
  prerequisites: string[];
  outOfScope: string[];
  misconceptions: string[];
  tone: string;
  starters: string[];
  effort: 'low' | 'medium' | 'high';
  limits: {
    turnsPerChat: number;
    messageChars: number;
    maxTokens: number;
    perMinute: number;
    perDay: number;
    totalPerDay: number;
  };
};

export const tutorConfig: TutorConfig = {
  // 화면 맨 위에 보이는 이름
  appName: '새봄 학습 도우미',

  // 학교·학년·과목·단원 (예시 설정: 통합과학 · 역학적 에너지 보존)
  school: '새봄고등학교(가상)',
  grade: '1학년',
  subject: '통합과학',
  unit: '역학적 에너지 보존',

  // 이 단원의 학습 목표. 학생 화면에도 보이고, 튜터가 대화의 방향을 잡는 기준이 됩니다.
  // 아래는 예시입니다. 실제 수업에서는 교과서와 평가계획의 성취기준에 맞춰 바꾸세요.
  goals: [
    '위치 에너지와 운동 에너지가 각각 무엇에 따라 달라지는지 설명할 수 있다.',
    '물체가 떨어지거나 올라갈 때 위치 에너지와 운동 에너지가 서로 전환됨을 설명할 수 있다.',
    '마찰과 공기 저항을 무시할 때 역학적 에너지가 보존됨을 이용해 물체의 속력이나 높이를 구할 수 있다.',
    '실제 상황에서는 마찰과 공기 저항 때문에 역학적 에너지의 일부가 열 등으로 전환됨을 사례로 설명할 수 있다.',
  ],

  // 다루는 범위. 튜터는 이 안의 질문만 돕습니다.
  scope: [
    '중력에 의한 위치 에너지 (Ep = mgh, g는 약 9.8 m/s²)',
    '운동 에너지 (Ek = (1/2)mv²)',
    '역학적 에너지 = 위치 에너지 + 운동 에너지, 그리고 그 보존',
    '자유 낙하, 위로 던진 물체, 롤러코스터, 진자, 빗면 같은 사례',
    '마찰·공기 저항이 있을 때 역학적 에너지가 줄어드는 까닭',
  ],

  // 이 단원을 이해하는 데 필요한 앞 단계 개념. 물어보면 짧게 도와줍니다.
  prerequisites: ['속력과 속도', '질량과 무게', '일과 에너지의 단위(J)', '간단한 식 계산과 제곱근'],

  // 범위 밖의 예. 이런 질문은 정중히 거절하고 선생님께 묻도록 안내합니다.
  outOfScope: ['운동량과 충격량 등 다른 단원', '다른 과목 질문', '시험 범위·점수·성적에 대한 판단', '공부와 관계없는 잡담이나 시사 문제'],

  // 학생들이 자주 틀리는 생각. 튜터가 이런 오개념을 만나면 질문으로 스스로 알아차리게 돕습니다.
  misconceptions: [
    '무거운 물체가 가벼운 물체보다 빨리 떨어진다고 생각한다.',
    '가장 높은 곳에서는 에너지가 전혀 없다고 생각한다(운동 에너지만 0일 수 있다).',
    '속력이 2배가 되면 운동 에너지도 2배가 된다고 생각한다(4배).',
    '마찰이 있으면 에너지가 사라진다고 생각한다(다른 형태로 전환된다).',
  ],

  // 튜터의 말투
  tone: '고등학생에게 말하듯 친근한 존댓말("-요")을 쓴다. 어려운 용어는 풀어서 말하고, 틀린 답에도 면박을 주지 않는다.',

  // 첫 화면에 보이는 예시 질문 (학생이 눌러서 바로 물어볼 수 있습니다)
  starters: [
    '위치 에너지랑 운동 에너지가 헷갈려요.',
    '10 m 높이에서 공을 떨어뜨리면 땅에 닿을 때 속력을 어떻게 구해요?',
    '롤러코스터는 왜 첫 언덕이 제일 높아요?',
  ],

  // AI가 답하기 전에 얼마나 깊이 생각할지: 'low'(빠르고 저렴) · 'medium'(기본) · 'high'(규칙을 더 꼼꼼히 지키지만 느리고 비쌈)
  effort: 'medium',

  // 사용 제한. 비용과 오남용을 막는 값입니다. 숫자만 바꾸세요.
  limits: {
    turnsPerChat: 20, // 대화 하나에서 학생이 보낼 수 있는 메시지 수. 넘으면 [대화 초기화] 안내
    messageChars: 500, // 학생 메시지 한 번의 최대 글자 수
    maxTokens: 1500, // AI 답변 한 번의 최대 분량(토큰, 생각하는 분량 포함). 한글 한 글자가 대략 1–2토큰
    perMinute: 6, // 한 학생(한 브라우저 창)이 1분에 보낼 수 있는 횟수
    perDay: 80, // 한 학생(한 브라우저 창)이 하루에 보낼 수 있는 횟수
    totalPerDay: 2000, // 앱 전체가 하루에 받는 횟수. 한 반 28명 × 20번 = 560번을 기준으로 넉넉히 잡은 값
  },
};

/** 학생 화면(브라우저)으로 내려보내도 되는 값만 골라낸 것 */
export const publicConfig = {
  appName: tutorConfig.appName,
  grade: tutorConfig.grade,
  subject: tutorConfig.subject,
  unit: tutorConfig.unit,
  goals: tutorConfig.goals,
  starters: tutorConfig.starters,
  turnsPerChat: tutorConfig.limits.turnsPerChat,
  messageChars: tutorConfig.limits.messageChars,
};

export type PublicConfig = typeof publicConfig;
