import type { CheckList } from '../checklists';

export const checklistsS1: Record<string, CheckList> = {
  'prep-1': {
    id: 'prep-1',
    title: '1회차 전에 준비할 것',
    items: [
      {
        id: 'laptop',
        label: '노트북 (Windows 10 이상 또는 macOS 13 이상)',
        hint: '메모리 4GB 이상, 인터넷 연결. 학교 업무용 PC라면 설치 권한과 무선망을 미리 확인하세요.',
        href: '/start/setup#school-pc',
      },
      {
        id: 'claude-plan',
        label: 'Claude 유료 플랜(Pro 이상) 계정',
        hint: '무료 플랜에는 Claude Code가 들어 있지 않습니다. 가입과 결제 순서는 연수 전 준비 안내를 따라 하세요.',
        href: '/start/signup#claude-pro',
      },
      { id: 'desktop-app', label: 'Claude 데스크톱 앱 설치하고 로그인하기', hint: '사이드바 위쪽에 Code 탭이 보이면 준비 끝', href: '/start/signup#claude-desktop' },
      { id: 'github', label: 'GitHub 가입하기 (무료)', hint: '사용자 이름은 내 저장소 주소에 들어가고 다른 사람에게 보입니다.', href: '/start/signup#github' },
      { id: 'vercel', label: 'Vercel 가입하기 (GitHub로, Hobby)', hint: 'Continue with GitHub로 가입해야 3회차 배포가 매끄럽습니다.', href: '/start/signup#vercel' },
      {
        id: 'sample-1',
        label: '1회차 실습 자료 내려받아 압축 풀기',
        hint: 'session1-practice.zip을 풀면 "새봄고_교무실_공유폴더_정리전" 폴더가 생깁니다. 바탕화면에 실습용 폴더를 하나 만들고 그 안에 풀어 두세요.',
        href: '/downloads',
      },
    ],
  },
  'check-15': {
    id: 'check-15',
    title: '스스로 점검 · 깊이 파기 1.5를 마치면 이렇게 말할 수 있어요',
    items: [
      { id: 'a', label: 'Code 탭에서 폴더를 열고, 모드 칸을 확인한 뒤 첫 지시를 보낼 수 있다' },
      { id: 'b', label: '같은 일을 아쉬운 지시와 좋은 지시로 시켜 보고 차이를 설명할 수 있다' },
      { id: 'c', label: '"아직 실행하지 말고 계획만"을 넣거나 플랜 모드(Plan)를 골라 계획부터 받을 수 있다' },
      { id: 'd', label: '권한 승인 창을 읽고 허용할지 거부할지 판단할 수 있다' },
      { id: 'e', label: '옮긴 파일은 이동 기록으로, AI가 고친 파일은 되돌리기 기능으로 돌려놓을 수 있다' },
      { id: 'f', label: '가정통신문 초안을 맡기고, 날짜와 숫자를 원문과 대조할 수 있다' },
      { id: 'g', label: '한글(HWP) 문서를 PDF·DOCX·HWPX로 저장해 맡기고, 결과를 한글 양식에 옮길 수 있다' },
      { id: 'h', label: '학생 정보가 든 파일은 AI에게 넘기지 않는다는 원칙을 내 말로 설명할 수 있다' },
    ],
  },
};
