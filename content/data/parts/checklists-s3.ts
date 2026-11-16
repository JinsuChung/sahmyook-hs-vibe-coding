import type { CheckList } from '../checklists';

export const checklistsS3: Record<string, CheckList> = {
  'prep-3': {
    id: 'prep-3',
    title: '3회차 전에 준비할 것',
    items: [
      { id: 'git', label: 'Git 설치 확인', hint: 'Windows는 Git for Windows. 학교 PC에서 설치가 막히면 전산 담당 선생님과 먼저 상의하세요', href: '/start/setup#git' },
      { id: 'node', label: 'Node.js LTS 버전 설치 확인', hint: '보드를 내 PC에서 띄울 때 씁니다', href: '/start/setup#nodejs' },
      { id: 'github', label: 'GitHub 계정 만들기', hint: '2단계 인증을 요구하면 휴대폰으로 설정합니다. 비밀번호와 인증 코드는 본인이 직접 입력합니다', href: 'https://github.com/signup' },
      { id: 'vercel', label: 'Vercel 가입 (Continue with GitHub)', hint: 'GitHub 계정으로 가입하면 저장소 연결이 가장 쉽습니다', href: 'https://vercel.com/signup' },
      { id: 'calc', label: '2회차에 만든 생기부 글자 수 계산기 폴더 찾아 두기', hint: '없으면 자료실의 3회차 시작 자료(session3-start.zip)를 내려받아 압축을 풉니다', href: '/downloads' },
      { id: 'board', label: '3회차 완성본(session3-assessment-board.zip) 내려받아 압축 풀기', hint: '풀면 assessment-board 폴더가 생깁니다. zip 안에서 바로 열지 말고 꼭 먼저 푸세요', href: '/downloads' },
      { id: 'phone', label: '휴대폰 챙기기', hint: '배포한 주소를 휴대폰으로 열어 봅니다. 학교 무선망에서 접속이 막힐 때 핫스팟으로도 씁니다' },
    ],
  },
  'check-35': {
    id: 'check-35',
    title: '3.5를 마치며 스스로 점검',
    items: [
      { id: 'commit-habit', label: '기능 하나를 마칠 때마다 커밋하고, 메시지만 보고도 무엇을 바꿨는지 알 수 있다' },
      { id: 'three-ways', label: '되돌리는 세 가지 방법을 상황에 맞게 고를 수 있다', hint: 'Claude Code 되돌리기, 커밋으로 돌아가기, GitHub에서 지난 버전 보기' },
      { id: 'private', label: '내 저장소가 모두 비공개(Private)이고, 학생 자료나 키 파일이 올라가 있지 않다' },
      { id: 'pr', label: '브랜치에서 고쳐 풀 리퀘스트를 올리고, 바뀐 줄을 읽은 뒤 직접 합쳐 봤다' },
      { id: 'solo-deploy', label: '완성본 없이 만든 페이지를 내 주소로 배포했다' },
      { id: 'no-pii', label: '배포한 페이지에 학생 이름·사진·연락처·성적이 없다는 것을 직접 확인했다' },
      { id: 'dashboard', label: 'Vercel에서 배포 기록과 빌드 로그를 찾을 수 있다' },
      { id: 'prep4', label: 'Supabase와 Claude Console 계정을 만들었다', hint: '4회차 준비', href: '/start/setup#accounts' },
    ],
  },
};
