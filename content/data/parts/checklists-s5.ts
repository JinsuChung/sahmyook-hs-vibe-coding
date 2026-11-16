import type { CheckList } from '../checklists';

export const checklistsS5: Record<string, CheckList> = {
  'prep-5': {
    id: 'prep-5',
    title: '5회차 전에 준비할 것',
    items: [
      {
        id: 'claude-ready',
        label: 'Claude 데스크톱 앱의 Code 탭이 열리는지 확인하기',
        hint: '1부에서 쓰던 그대로입니다. 새로 설치할 프로그램은 없습니다.',
        href: '/start/setup#claude-code',
      },
      {
        id: 'sample-5',
        label: '5회차 시작 자료 내려받아 압축 풀기',
        hint: 'session5-workspace-start.zip을 풀면 "새봄고_교무수첩" 폴더가 생깁니다. 교무실 공유 드라이브가 아니라 내 PC의 문서 폴더처럼 찾기 쉬운 곳에 두세요.',
        href: '/downloads',
      },
      {
        id: 'sample-7',
        label: '완성본은 다른 곳에 풀어 두기',
        hint: 'session7-workspace-done.zip도 풀면 폴더 이름이 "새봄고_교무수첩"으로 같습니다. "완성본"이라는 폴더를 따로 만들고 그 안에 푸세요. 막혔을 때 견주어 보는 용도입니다.',
        href: '/downloads',
      },
      {
        id: 'hidden-folder',
        label: '숨김 폴더가 보이게 해 두기',
        hint: '스킬이 들어가는 .claude 폴더는 숨김 폴더입니다. Windows 탐색기는 [보기] → [표시] → [숨긴 항목], macOS Finder는 Command + Shift + . 을 누릅니다.',
      },
      {
        id: 'repeat-3',
        label: '매주·매달 되풀이하는 내 업무 세 가지 떠올려 오기',
        hint: '가정통신문, 공문 처리, 회의록, 주간 계획처럼 학생 개인정보가 들어가지 않는 일로 골라 보세요.',
      },
    ],
  },
  'check-55': {
    id: 'check-55',
    title: '스스로 점검 · 깊이 파기 5.5를 마치면 이렇게 말할 수 있어요',
    items: [
      { id: 'a', label: '에이전트가 일하는 세 단계(맥락 모으기, 행동, 확인)를 방금 한 작업에 비추어 설명할 수 있다' },
      { id: 'b', label: '대화가 길어지면 생기는 일과, 규칙을 CLAUDE.md에 적어 두는 까닭을 말할 수 있다' },
      { id: 'c', label: '스킬이 불려야 할 말과 불리면 안 되는 말을 만들어 새 대화에서 시험하고, 설명을 고칠 수 있다' },
      { id: 'd', label: '직접 부를 때만 실행되는 스킬로 바꾸는 설정을 알고, 어떤 일에 쓰는지 예를 들 수 있다' },
      { id: 'e', label: '내 반복 업무 10개를 적고 다섯 기준으로 자동화 후보 3개를 골랐다' },
      { id: 'f', label: '스킬을 하나 더 만들고, 결과물에서 교사가 확인할 곳이 어디인지 짚을 수 있다' },
      { id: 'g', label: 'CLAUDE.md에 둘 것(규칙)과 스킬로 옮길 것(절차)을 가를 수 있다' },
      { id: 'h', label: '학생 정보가 든 파일은 업무 폴더에 두지 않는다는 원칙을 내 폴더에 적용했다' },
    ],
  },
};
