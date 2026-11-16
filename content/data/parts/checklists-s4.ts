import type { CheckList } from '../checklists';

export const checklistsS4: Record<string, CheckList> = {
  'prep-4': {
    id: 'prep-4',
    title: '4회차 전에 준비할 것',
    items: [
      { id: 'supabase', label: 'Supabase 가입 (무료 요금제)', hint: '무료 프로젝트는 2개까지입니다. 이미 2개가 있으면 하나를 정리해 두세요.', href: 'https://supabase.com' },
      { id: 'console', label: 'Claude Console 가입', hint: 'Claude 구독과는 다른 곳입니다. API 키와 사용 한도는 수업에서 함께 만듭니다.', href: 'https://platform.claude.com' },
      { id: 'node', label: 'Node.js가 설치돼 있음 (3회차에 설치)', href: '/start/setup#nodejs' },
      { id: 'sample', label: '4회차 완성본(session4-assessment-board.zip)을 내려받아 실습 폴더에 풀기', hint: '3회차 폴더와 이름이 같습니다(assessment-board). 다른 위치에 풀어 주세요.', href: '/downloads' },
      { id: 'materials', label: '4회차 실습 자료(session4-practice.zip)를 내려받아 풀기', href: '/downloads' },
      { id: 'accounts-3', label: '(선택 실습용) 3회차의 GitHub·Vercel 계정으로 로그인돼 있음', href: '/start/setup#accounts' },
    ],
  },
  'privacy-4': {
    id: 'privacy-4',
    title: '내 폴더와 내 앱 개인정보 점검표',
    items: [
      { id: 'folder', label: 'Claude Code로 연 폴더에 학생 명단·성적·상담 기록, 나이스에서 내려받은 원본이 없다' },
      { id: 'gitignore', label: '.env.local과 원본 데이터 파일이 .gitignore에 들어 있고 GitHub에 올라가지 않았다' },
      { id: 'table', label: '내 앱의 테이블에 개인을 알아볼 수 있는 열이 없다 (있다면 꼭 필요한 이유를 말할 수 있다)' },
      { id: 'paste', label: 'AI 기능 입력칸에 "개인정보가 든 글은 넣지 마세요" 안내가 있다' },
      { id: 'log', label: '서버 기록(로그)에 붙여 넣은 글이 남지 않는다' },
      { id: 'limit', label: 'Claude Console에 월 사용 한도가 걸려 있다', href: 'https://platform.claude.com/settings/spend-limits' },
      { id: 'key', label: '키를 채팅창·메신저·문서에 적은 적이 없다 (있다면 그 키를 지우고 새로 만들었다)' },
      { id: 'account', label: '내 Claude 계정의 데이터 설정(모델 학습에 쓰도록 허용할지)을 확인했다', href: 'https://claude.ai/settings/data-privacy-controls' },
    ],
  },
  'check-45': {
    id: 'check-45',
    title: '스스로 점검 · 4.5를 마치면 이렇게 말할 수 있어요',
    items: [
      { id: 'a', label: 'select·insert·update·delete가 든 SQL을 읽고, where가 빠진 위험한 문장을 가려낼 수 있다' },
      { id: 'b', label: '정책 네 개를 읽고 "누가 무엇을 할 수 있는지" 말할 수 있다' },
      { id: 'c', label: '두 계정으로 시험해 남이 등록한 평가를 고치거나 지울 수 없는 것을 확인했다' },
      { id: 'd', label: '항목을 하나 추가하고 데이터베이스·화면·설계 파일 세 곳에 반영했다' },
      { id: 'e', label: 'AI 추출 결과를 정답표와 대조해 틀리는 유형을 하나 이상 말할 수 있다' },
      { id: 'f', label: '한 건과 한 학기 분량의 API 비용을 어림할 수 있다' },
      { id: 'g', label: '가명 처리를 가상 명단으로 해 보았고, 대응표를 어디에 두어야 하는지 안다' },
    ],
  },
};
