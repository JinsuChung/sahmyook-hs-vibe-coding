export const simMeta = {
  'chat-vs-agent': { title: '챗봇 vs 에이전트', session: 1 },
  'agent-loop': { title: '에이전트 루프와 권한 승인', session: 1 },
  'commit-timeline': { title: '커밋 타임라인', session: 3 },
  'deploy-pipeline': { title: '배포 파이프라인', session: 3 },
  rls: { title: 'RLS(행 수준 보안)', session: 4 },
  keys: { title: '공개 키 vs 비밀 키', session: 4 },
  injection: { title: '프롬프트 인젝션', session: 4 },
  'skill-loading': { title: '스킬이 불리는 순간', session: 5 },
  'schedule-picker': { title: '어디서 돌릴까: 예약 방식 고르기', session: 7 },
  'tutor-compare': { title: '답 주는 챗봇 vs 질문하는 튜터', session: 8 },
} as const;

export type SimName = keyof typeof simMeta;
