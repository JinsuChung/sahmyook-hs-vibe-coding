import type { Term } from '../glossary';

export const glossaryS3: Term[] = [
  /* ---------- Git·GitHub ---------- */
  { id: 'git', term: 'Git', def: '파일이 언제, 무엇이, 왜 바뀌었는지 기록하고 예전 상태로 되돌릴 수 있게 해 주는 버전 관리 도구. 내 PC에서 돈다.', analogy: '날짜별 기록이 쌓이는 학급 일지', session: 3 },
  { id: 'repository', term: '저장소', en: 'Repository', def: 'Git이 변경 이력을 기록하는 폴더. 겉보기에는 보통 폴더와 같고, 안에 이력이 함께 들어 있다.', analogy: '수정 이력이 붙어 있는 문서철', session: 3 },
  { id: 'commit', term: '커밋', en: 'Commit', def: '지금 상태를 한 줄 메모와 함께 저장한 세이브 포인트. 언제든 이 시점으로 돌아갈 수 있다.', analogy: '학급 일지의 하루 기록(날짜·기록자·한 줄 메모)', session: 3 },
  { id: 'push', term: '푸시', en: 'Push', def: '내 PC에 쌓은 커밋 이력을 GitHub에 올리는 것. Vercel과 연결해 두면 푸시가 곧 다시 배포하라는 신호가 된다.', analogy: '교무실 공용 캐비닛에 최신 사본 넣어 두기', session: 3 },
  { id: 'gitignore', term: '.gitignore', def: 'Git이 기록하지도, 올리지도 않을 파일의 목록. 학생 자료 원본과 비밀번호·키 파일(.env)을 꼭 넣는다.', analogy: '캐비닛에 넣지 않는 서류 목록', session: 3 },
  { id: 'github', term: 'GitHub', def: 'Git 저장소를 인터넷에 보관하고 함께 고칠 수 있게 해 주는 서비스. 내 PC가 고장 나도 이력이 남는다.', analogy: '교무실 공용 캐비닛', session: 3 },
  { id: 'private-repo', term: '비공개 저장소', en: 'Private repository', def: '주인과 초대받은 사람만 볼 수 있는 GitHub 저장소. 학교 업무와 관련된 것은 기본을 비공개로 만든다.', analogy: '열쇠를 가진 사람만 여는 캐비닛', session: 3 },
  { id: 'branch', term: '브랜치', en: 'Branch', def: '확정본(main)을 건드리지 않고 따로 고쳐 보는 작업 사본. 마음에 들면 합치고 아니면 버린다.', analogy: '평가계획서 수정안 사본', session: 3 },
  { id: 'pull-request', term: '풀 리퀘스트', en: 'Pull Request, PR', def: '내 브랜치의 변경을 main에 합쳐 달라고 요청하고, 바뀐 줄을 보며 의견을 주고받는 GitHub 화면.', analogy: '교과협의회에 수정안 올리기', session: 3 },
  { id: 'merge', term: '머지', en: 'Merge', def: '브랜치의 변경을 다른 브랜치(보통 main)에 합치는 것.', analogy: '협의를 마친 수정안을 확정본에 반영', session: 3 },
  { id: 'pull', term: '풀', en: 'Pull', def: 'GitHub에 올라온 최신 변경을 내 PC로 받아 와 맞추는 것. 작업을 시작하기 전에 한다.', analogy: '캐비닛에서 최신 사본 꺼내 오기', session: 3 },
  { id: 'clone', term: '클론', en: 'Clone', def: 'GitHub의 저장소를 이력째로 내 PC에 내려받는 것.', analogy: '문서철 통째로 복사해 받기', session: 3 },
  { id: 'collaborator', term: '협업자', en: 'Collaborator', def: '비공개 저장소에 초대받아 함께 볼 수 있고 고칠 수 있는 사람.', analogy: '캐비닛 열쇠를 받은 동료', session: 3 },
  { id: 'code-review', term: '리뷰', en: 'Code review', def: '합치기 전에 다른 사람이 바뀐 내용을 읽고 의견을 남기는 것.', analogy: '협의회의 검토 의견', session: 3 },
  { id: 'conflict', term: '충돌', en: 'Conflict', def: '두 사람(또는 두 브랜치)이 같은 파일의 같은 줄을 다르게 고쳐서 Git이 알아서 합칠 수 없는 상태. 어느 쪽을 남길지 사람이 고르면 끝난다.', analogy: '같은 문단을 두 선생님이 다르게 고친 수정본', session: 3 },

  /* ---------- 웹·배포 ---------- */
  { id: 'localhost', term: 'localhost', def: '내 PC 안에서만 열리는 시험용 주소(보통 http://localhost:3000). 옆자리 동료의 PC나 휴대폰에서는 열리지 않는다.', analogy: '내 책상 위에서만 펼쳐 본 초안', session: 3 },
  { id: 'dev-server', term: '개발 서버', en: 'Dev server', def: '만들고 있는 웹앱을 내 PC에서 띄워 주는 프로그램. 파일을 저장하면 화면이 바로 바뀐다. 끄면 localhost 주소도 닫힌다.', session: 3 },
  { id: 'deploy', term: '배포', en: 'Deploy', def: '프로그램을 인터넷의 서버에 올려 주소 하나로 누구나 열 수 있게 하는 것.', analogy: '학교 누리집 게시판에 올리기', session: 3 },
  { id: 'vercel', term: 'Vercel', def: 'GitHub 저장소를 연결해 두면 푸시할 때마다 웹앱을 자동으로 다시 배포해 주는 서비스.', session: 3 },
  { id: 'build', term: '빌드', en: 'Build', def: '작성한 코드를 실제로 서비스할 수 있는 형태로 만드는 과정. 배포 직전에 일어나고, 코드에 문법 오류가 있으면 여기서 멈춘다.', analogy: '인쇄 넘기기 전의 최종 교정', session: 3 },
  { id: 'preview-deploy', term: '미리보기 배포', en: 'Preview deployment', def: 'main이 아닌 브랜치나 풀 리퀘스트를 올렸을 때 Vercel이 따로 만들어 주는 시험용 주소. 실제 주소는 바뀌지 않는다.', analogy: '확정 전에 돌려 보는 시안', session: 3 },
  { id: 'nextjs', term: 'Next.js', def: '웹앱의 뼈대를 잡아 주는 도구(프레임워크). Vercel이 만들어 배포 궁합이 좋다. 이 과정의 보드와 이 사이트도 Next.js로 만들었다.', session: 3 },
  { id: 'nodejs', term: 'Node.js', def: 'Next.js 같은 웹앱을 내 PC에서 실행하고 필요한 부품(패키지)을 설치하는 데 쓰는 프로그램. npm이 함께 들어 있다.', session: 3 },
];
