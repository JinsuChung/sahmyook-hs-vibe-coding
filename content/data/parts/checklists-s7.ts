import type { CheckList } from '../checklists';

export const checklistsS7: Record<string, CheckList> = {
  'prep-7': {
    id: 'prep-7',
    title: '7회차 전에 준비할 것',
    items: [
      {
        id: 'workspace',
        label: '5–6회차에 쓰던 내 "새봄고_교무수첩" 폴더',
        hint: 'CLAUDE.md와 스킬이 들어 있는 그 폴더에서 이어서 합니다. 없으면 자료실의 7회차 완성본을 풀어 그 폴더로 실습하세요.',
        href: '/downloads',
      },
      {
        id: 'todo-table',
        label: '보낸문서/공문_할일표.md가 있는지 확인하기',
        hint: '5회차에서 /doc-digest로 만든 표입니다. 없으면 폴더를 열고 /doc-digest를 한 번 실행해 두세요. 주간 브리핑이 이 표를 읽습니다.',
      },
      {
        id: 'done-kit',
        label: '7회차 완성본(session7-workspace-done.zip)을 내려받아 다른 곳에 풀어 두기',
        hint: '풀면 같은 이름(새봄고_교무수첩)의 폴더가 생깁니다. 내 폴더와 겹치지 않게 "완성본" 같은 폴더를 따로 만들고 그 안에 푸세요.',
        href: '/downloads',
      },
      {
        id: 'app-update',
        label: 'Claude 데스크톱 앱을 최신 버전으로 업데이트하기',
        hint: '로컬 예약 작업은 Claude Desktop 1.1.5368 이상에서 쓸 수 있습니다. Code 탭 사이드바에 Scheduled(또는 Routines)가 보이면 준비 끝.',
        href: 'https://code.claude.com/docs/en/desktop-scheduled-tasks',
      },
      {
        id: 'cli-optional',
        label: '(선택) 터미널용 Claude Code 설치',
        hint: '심화 시연 "한 줄로 실행하기"를 직접 따라 해 보고 싶은 분만. 데스크톱 앱만으로도 이 회차의 필수 실습은 모두 할 수 있습니다.',
        href: '/start/setup#claude-code',
      },
    ],
  },
  'check-75': {
    id: 'check-75',
    title: '스스로 점검 · 깊이 파기 7.5를 마치면 이렇게 말할 수 있어요',
    items: [
      { id: 'a', label: '어떤 일을 로컬 예약 작업, 클라우드 예약 작업, /loop 가운데 어디서 돌릴지 질문 세 개로 고를 수 있다' },
      { id: 'b', label: '클라우드 예약 작업이 내 PC의 파일을 보지 못하는 까닭을 설명할 수 있다' },
      { id: 'c', label: '실행 기록에서 빠진 실행, 읽지 못한 파일, 하지 못한 일을 찾아낼 수 있다' },
      { id: 'd', label: '지시문에 결과물 형식, "해당 없음", 건너뛰는 조건을 넣어 고칠 수 있다' },
      { id: 'e', label: '내 예약 작업의 권한 모드와 항상 허용해 둔 항목을 확인하고 필요 없는 것을 거둘 수 있다' },
      { id: 'f', label: '지시문(부탁)과 권한 규칙(잠금장치)의 차이를 예를 들어 말할 수 있다' },
      { id: 'g', label: 'claude -p 명령의 옵션이 무엇을 허용하고 무엇을 막는지 읽을 수 있다' },
      { id: 'h', label: '내 자동화 후보를 "자동으로 / 초안까지만 / 하면 안 되는 일"로 나누고 까닭을 댈 수 있다' },
    ],
  },
};
