import type { CheckList } from '../checklists';

export const checklistsS2: Record<string, CheckList> = {
  'prep-2': {
    id: 'prep-2',
    title: '2회차 전에 준비할 것',
    items: [
      { id: 'homework-1', label: '1회차 과제: 내 업무의 반복 작업 3가지 적어 오기', href: '/sessions/1#과제' },
      {
        id: 'python',
        label: 'Python 설치 확인 (엑셀 처리에 씁니다)',
        hint: 'Claude Code에게 "Python이 설치돼 있는지 확인해 줘"라고 물어보면 됩니다. 학교 PC라 설치가 막혀 있으면 미리 전산 담당 선생님과 상의하세요. 6회차의 스킬에서도 Python(3.9 이상)을 씁니다.',
        href: '/start/setup#python',
      },
      {
        id: 'sample-2',
        label: '2회차 실습 자료(session2-practice.zip) 내려받아 압축 풀기',
        hint: '풀면 2회차_실습자료 폴더가 생깁니다. 바탕화면이나 문서 폴더에 두세요.',
        href: '/downloads',
      },
      { id: 'no-real-data', label: '실제 학생 성적 파일은 준비하지 않기 (실습은 가상 데이터로만)' },
    ],
  },
  'check-25': {
    id: 'check-25',
    title: '스스로 점검 · 2.5를 마치면 이렇게 말할 수 있어요',
    items: [
      { id: 'a', label: 'AI가 엑셀을 암산하지 않고 프로그램을 만들어 계산한다는 것을 설명할 수 있다' },
      { id: 'b', label: '개수·대조·표본 세 가지로 검증 기준을 직접 쓸 수 있다' },
      { id: 'c', label: '출결 통계, 설문 집계, 점수 분포를 혼자 만들어 봤다' },
      { id: 'd', label: '이상값을 고칠지 말지는 교사가 정한다는 원칙으로 요청을 쓴다' },
      { id: 'e', label: '내 업무 도구의 5요소 기획서와 첫 버전을 가짜 데이터로 만들었다' },
      { id: 'f', label: 'CLAUDE.md를 20줄 안쪽으로 다듬었다' },
      { id: 'g', label: 'GitHub 계정과 Git 설치를 확인했다', href: '/start/setup#git' },
    ],
  },
};
