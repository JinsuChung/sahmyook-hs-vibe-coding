/**
 * 바뀔 수 있는 사실 정보는 모두 여기서 관리합니다.
 * 학기 시작 전에 출처를 열어 값과 checked 날짜를 갱신하세요.
 */
export type Fact = { value: string; checked: string; source: string };

export const facts = {
  'claude.plan': {
    value: 'Pro·Max·Ultra·Team·Enterprise 가운데 하나의 유료 플랜 (무료 플랜에는 Claude Code가 들어 있지 않음)',
    checked: '2026-11-16',
    source: 'https://code.claude.com/docs/en/setup',
  },
  'claude.install.mac': {
    value: 'curl -fsSL https://claude.ai/install.sh | bash',
    checked: '2026-11-16',
    source: 'https://code.claude.com/docs/en/setup',
  },
  'claude.install.win': {
    value: 'irm https://claude.ai/install.ps1 | iex',
    checked: '2026-11-16',
    source: 'https://code.claude.com/docs/en/setup',
  },
  /** 데스크톱 앱(Code 탭)을 내려받는 곳 */
  'claude.desktop.download': {
    value: 'claude.com/download',
    checked: '2026-11-16',
    source: 'https://code.claude.com/docs/en/desktop-quickstart',
  },
  /** Claude Code가 도는 운영체제 */
  'claude.os': {
    value: 'Windows 10 (1809 이상) 또는 macOS 13 이상, 메모리 4GB 이상, 인터넷 연결',
    checked: '2026-11-16',
    source: 'https://code.claude.com/docs/en/setup',
  },
  /** Claude Code가 접속해야 하는 주소 가운데 로그인과 대화에 꼭 필요한 것 (전체 목록은 출처 문서) */
  'claude.network': {
    value: 'api.anthropic.com, claude.ai, claude.com, platform.claude.com',
    checked: '2026-11-16',
    source: 'https://code.claude.com/docs/en/network-config#network-access-requirements',
  },
  'vercel.hobby': {
    value: '무료, 프로젝트 200개, 하루 배포 100회',
    checked: '2026-11-16',
    source: 'https://vercel.com/docs/plans/hobby',
  },
  /**
   * Hobby 요금제의 용도 제한. 2026-11-16에 출처 페이지를 다시 열었을 때 이 문구를 찾지 못해
   * 값과 확인일을 예전 그대로 두었습니다. 다음 점검 때 Vercel 약관에서 다시 확인하세요.
   */
  'vercel.hobby.use': {
    value: '비상업·개인 용도',
    checked: '2026-10-06',
    source: 'https://vercel.com/docs/plans/hobby',
  },
  'vercel.pro': {
    value: '개발자 1인당 월 20달러',
    checked: '2026-11-16',
    source: 'https://vercel.com/docs/plans/hobby',
  },
  'supabase.free': {
    value: '활성 프로젝트 2개, DB 500MB, 1주일 미사용 시 일시정지',
    checked: '2026-11-16',
    source: 'https://supabase.com/pricing',
  },
  'supabase.pro': { value: '월 25달러부터', checked: '2026-11-16', source: 'https://supabase.com/pricing' },
  'neon.free': {
    value: '프로젝트 100개, 프로젝트당 1GB(전체 합계 20GB까지), 5분 미사용 시 자동 절전',
    checked: '2026-11-16',
    source: 'https://neon.com/docs/introduction/plans',
  },
} satisfies Record<string, Fact>;

export type FactKey = keyof typeof facts;

export type ModelPrice = {
  id: string;
  name: string;
  /** 입력 100만 토큰당 달러 */
  input: number;
  /** 출력 100만 토큰당 달러 */
  output: number;
  note: string;
  /** 요금에 붙는 조건이 있으면 화면에 함께 보여 준다 */
  cond?: string;
  /** 요청 한 번의 프롬프트(입력)가 over 토큰을 넘으면 적용되는 요금 */
  long?: { over: number; input: number; output: number };
};

/**
 * Claude API 요금 (100만 토큰당 달러) — 2026-11-16 확인.
 * Claude Haiku 5.5의 $0.10 / $0.50은 요청 한 번의 프롬프트가 10만 토큰 이하일 때의 요금이다.
 * 10만 토큰을 넘는 요청은 $0.50 / $2.50이 적용된다(요청마다 따로 계산).
 */
export const modelPricing: ModelPrice[] = [
  {
    id: 'claude-haiku-5-5',
    name: 'Claude Haiku 5.5',
    input: 0.1,
    output: 0.5,
    note: '가장 빠르고 저렴, 추출·분류·짧은 대화',
    cond: '프롬프트 10만 토큰 이하 기준',
    long: { over: 100_000, input: 0.5, output: 2.5 },
  },
  { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5', input: 2, output: 10, note: '속도와 성능의 균형, 일반 업무' },
  { id: 'claude-opus-5-5', name: 'Claude Opus 5.5', input: 4, output: 20, note: '복잡한 분석·긴 문서' },
];
export const pricingChecked = '2026-11-16';
export const pricingSource = 'https://platform.claude.com/docs/en/about-claude/pricing';
