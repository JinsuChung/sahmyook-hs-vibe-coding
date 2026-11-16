import type { CheckList } from '../checklists';

export const checklistsS8: Record<string, CheckList> = {
  'prep-8': {
    id: 'prep-8',
    title: '8회차 전에 준비할 것',
    items: [
      { id: 'sample-8', label: '8회차 완성본(session8-tutor.zip)을 내려받아 압축 풀기', hint: '풀면 saebom-tutor 폴더가 생겨요', href: '/downloads' },
      { id: 'node', label: 'Node.js LTS가 설치되어 있다 (3회차에 설치한 것 그대로)', href: '/start/setup#nodejs' },
      { id: 'console', label: 'Claude Console 계정과 API 크레딧, 그리고 월 사용 한도 설정', hint: '4회차에 쓴 계정 그대로. 한도를 먼저 정하고 키를 만들어요', href: 'https://platform.claude.com/settings/spend-limits' },
      { id: 'unit', label: '내 과목의 단원 하나와 학습 목표 3–4개를 메모해 오기', hint: '평가계획서나 교과서 단원 도입부에서 옮겨 적으면 돼요' },
      { id: 'mistakes', label: '그 단원에서 학생들이 자주 틀리는 생각 3가지 떠올려 오기' },
      { id: 'accounts', label: '(선택 실습) GitHub·Vercel 계정에 로그인할 수 있다', href: '/start/setup#accounts' },
    ],
  },
  'check-85': {
    id: 'check-85',
    title: '스스로 점검 · 4주가 끝나면 이렇게 말할 수 있어요',
    items: [
      { id: 'a', label: '내 에이전트 하나의 운영 계획(무엇을, 누구를 위해, 어떤 데이터로, 사람이 확인하는 지점, 멈추는 조건)을 한 장으로 설명할 수 있다' },
      { id: 'b', label: '시험 질문 세트가 있고, 고칠 때마다 전체를 다시 돌린 기록이 있다' },
      { id: 'c', label: '동료 한 명(또는 학교와 협의를 거친 한 반)이 써 보았고, 그 의견으로 한 번 이상 고쳤다' },
      { id: 'd', label: '한 달 비용과 관리하는 사람, 멈추는 조건을 적어 두었다' },
      { id: 'e', label: '내가 없어도 다음 사람이 이어받을 수 있는 인수인계 문서가 있다' },
      { id: 'f', label: '교과협의회나 전문적 학습공동체에서 잘된 점과 안 된 점을 함께 나누었다' },
      { id: 'g', label: '학생이 쓰는 도구라면, 학교 관리자·정보 담당과 협의하고 학교 절차에 따라 안내를 마쳤다' },
    ],
  },
};
