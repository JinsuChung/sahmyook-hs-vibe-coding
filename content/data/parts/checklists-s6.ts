import type { CheckList } from '../checklists';

export const checklistsS6: Record<string, CheckList> = {
  'prep-6': {
    id: 'prep-6',
    title: '6회차 전에 준비할 것',
    items: [
      {
        id: 'p6-folder',
        label: '5회차에 쓰던 새봄고_교무수첩 폴더가 있다',
        hint: 'CLAUDE.md와 .claude/skills/home-letter, doc-digest가 들어 있는 폴더입니다. 없으면 자료실의 5회차 시작 자료로 다시 시작해도 됩니다.',
        href: '/downloads',
      },
      {
        id: 'p6-done',
        label: '완성본(session7-workspace-done.zip)을 내려받아 다른 곳에 풀어 두었다',
        hint: '풀면 폴더 이름이 같은 새봄고_교무수첩입니다. 내 폴더와 겹치지 않게 다운로드 폴더 같은 다른 위치에 푸세요. 자료 두 개를 여기서 가져다 씁니다.',
        href: '/downloads',
      },
      {
        id: 'p6-python',
        label: 'Python 3.9 이상이 설치되어 있다 (2회차에 확인한 것)',
        hint: '바이트 세는 스크립트를 실행할 때 씁니다. Claude Code에 "파이썬이 설치되어 있는지 확인해 줘"라고 물어보면 됩니다.',
        href: '/start/setup#python',
      },
      {
        id: 'p6-hidden',
        label: '.claude 폴더가 탐색기나 Finder에서 보이게 해 두었다',
        hint: 'Windows 탐색기는 [보기] → [표시] → [숨긴 항목], macOS Finder는 Command + Shift + . 입니다.',
      },
      {
        id: 'p6-account',
        label: '(선택 실습) 연결해 볼 개인 계정을 정했다',
        hint: '학생 정보가 없는 개인 캘린더 정도가 알맞습니다. 학교·교육청 계정은 정보 담당 선생님께 외부 앱 연결이 허용되는지 먼저 확인하세요.',
      },
    ],
  },
  'check-connect': {
    id: 'check-connect',
    title: '연결하기 전 점검표',
    items: [
      { id: 'cc-need', label: '복사해 붙여 넣는 일이 실제로 되풀이되는 곳인가', hint: '한두 번 쓸 자료라면 파일로 내려받아 폴더에 넣는 편이 간단하고 안전합니다.' },
      { id: 'cc-read', label: '연결하면 무엇을 읽을 수 있게 되는지 적어 보았다', hint: '캘린더라면 모든 일정의 제목, 참석자, 메모까지. 드라이브라면 어느 폴더까지인지.' },
      { id: 'cc-write', label: '연결하면 무엇을 만들고, 보내고, 지울 수 있게 되는지 확인했다', hint: '로그인할 때 나오는 권한 요청 화면에 적혀 있습니다. 보기만인지 수정·삭제까지인지 읽으세요.' },
      { id: 'cc-student', label: '학생 개인정보가 있는 곳이 아니다', hint: '학급 명렬, 성적, 상담 기록이 있는 드라이브나 메일함은 연결하지 않습니다.' },
      { id: 'cc-policy', label: '학교·교육청 계정이라면 정보 담당 선생님께 확인했다', hint: '기관 계정은 관리자 정책으로 외부 앱 연결이 막혀 있거나 승인이 필요할 수 있습니다.' },
      { id: 'cc-off', label: '끊는 방법을 알고 있다', hint: '데스크톱 앱 사이드바의 Customize → Connectors, 또는 claude.ai/customize/connectors.' },
      { id: 'cc-readfirst', label: '처음 한동안은 읽는 일만 시키기로 했다', hint: '만들기·보내기·지우기 승인 창이 뜨면 내용을 읽고, 시키지 않은 일이면 거절합니다.' },
    ],
  },
  'check-65': {
    id: 'check-65',
    title: '6.5를 마치며 스스로 점검',
    items: [
      { id: 'c65-folder', label: '스킬 폴더에서 절차서, 참고자료, 스크립트가 각각 무엇인지 가리킬 수 있다' },
      { id: 'c65-script', label: '정확해야 하는 계산을 스크립트에게 맡기고, 손으로 셀 수 있는 예로 검산해 보았다' },
      { id: 'c65-ref', label: '기재요령 요약 파일을 해당 학년도 원문과 한 군데 이상 직접 대조해 보았다' },
      { id: 'c65-norewrite', label: '점검 스킬이 글을 고쳐 쓰지 않고 지적만 하는지 확인했다' },
      { id: 'c65-pattern', label: '검토자, 조사자, 병렬 처리 가운데 내 업무에 맞는 패턴 하나를 골랐다' },
      { id: 'c65-connect', label: '연결을 하나 붙였다가 끊어 보았다' },
      { id: 'c65-share', label: '나누기 전에 스킬 폴더에 개인정보와 학교 내부 정보가 없는지 점검했다' },
    ],
  },
};
