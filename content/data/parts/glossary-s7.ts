import type { Term } from '../glossary';

export const glossaryS7: Term[] = [
  { id: 'scheduled-task', term: '예약 작업', en: 'Scheduled task', def: '정해 둔 시간과 주기에 맞춰 새 세션을 자동으로 열고, 저장해 둔 지시문대로 일하게 하는 기능. 데스크톱 앱의 로컬 예약 작업은 내 PC의 폴더를 읽고 쓸 수 있지만, 앱이 열려 있고 PC가 깨어 있을 때만 실행된다.', analogy: '당번표. 정해진 시간에 정해진 일을 하고 점검표에 기록을 남긴다', session: 7 },
  { id: 'cloud-task', term: '클라우드 예약 작업', en: 'Cloud scheduled task', def: 'Anthropic이 관리하는 클라우드에서 도는 예약 작업. 예전 이름은 루틴(routine)이다. 내 PC가 꺼져 있어도 실행되지만, 실행할 때마다 GitHub 저장소를 새로 복제해서 일하므로 내 PC에만 있는 파일은 보지 못한다.', analogy: '학교 밖 업체에 맡긴 정기 점검. 내 책상 서랍 속 서류는 볼 수 없다', session: 7 },
  { id: 'loop-command', term: '/loop', en: 'Loop', def: '세션이 열려 있는 동안 같은 지시를 일정한 간격으로 되풀이하게 하는 명령. 예: /loop 5m 배포가 끝났는지 확인해 줘. 세션을 닫으면 멈추고, 반복 작업은 만든 지 7일이 지나면 자동으로 끝난다.', analogy: '자습 감독 중에 10분마다 교실을 한 바퀴 도는 일. 감독이 끝나면 같이 끝난다', session: 7 },
  { id: 'headless', term: '헤드리스 실행', en: 'Headless (claude -p)', def: '대화 창 없이 지시 하나를 실행하고 마지막 답을 출력한 뒤 끝나는 실행 방식. 터미널에서 claude -p "지시"로 쓴다. 승인해 줄 사람이 없으므로 무엇을 허용할지 옵션으로 미리 정해 둔다.', analogy: '쪽지로 남긴 업무 부탁. 받은 사람은 되물을 수 없으니 쪽지에 다 적혀 있어야 한다', session: 7 },
  { id: 'hook', term: '훅', en: 'Hook', def: 'Claude Code가 정해진 시점(파일을 고친 뒤, 입력을 기다릴 때 등)에 자동으로 실행하는 명령. AI의 판단에 맡기지 않고 그 시점이 오면 반드시 실행된다는 점이 지시문과 다르다.', analogy: '수업 종. 누가 기억하지 않아도 시간이 되면 울린다', session: 7 },
  { id: 'permission-mode', term: '권한 모드', en: 'Permission mode', def: '에이전트가 사람에게 묻지 않고 할 수 있는 일의 범위를 정하는 설정. Manual(고치거나 실행하기 전에 묻기), Accept edits(파일 편집은 묻지 않기), Plan(계획만 세우기), Auto(분류기가 대신 검토) 등이 있다. 예약 작업은 작업마다 따로 정한다.', analogy: '위임전결 규정. 어디까지 전결이고 어디부터 결재를 올리는지 정해 둔 것', session: 7 },
  { id: 'human-in-the-loop', term: '사람 확인 지점', en: 'Human in the loop', def: '자동으로 도는 일의 흐름 안에, 사람이 읽고 승인해야 다음으로 넘어가는 자리를 일부러 넣어 두는 설계. 초안과 제안까지는 자동으로, 발송·제출·기록은 사람이 한다.', analogy: '기안은 누가 써도 결재는 사람이 한다', session: 7 },
  { id: 'run-log', term: '실행 기록', en: 'Run log', def: '자동 실행이 언제 돌았고, 무엇을 읽고 썼으며, 무엇을 하지 못했는지 남긴 기록. 데스크톱 앱 예약 작업의 실행 내역(History)과 결과 파일 끝의 실행 메모가 여기에 든다. 남기는 것만큼 정해 놓고 읽는 것이 중요하다.', analogy: '학급 일지와 당직 일지', session: 7 },
  { id: 'catch-up-run', term: '따라잡기 실행', en: 'Catch-up run', def: 'PC가 꺼져 있거나 잠들어 있어 놓친 로컬 예약 실행을, 앱을 열거나 PC가 깨어날 때 한 번 대신 돌리는 것. 지난 7일 안에 놓친 것 가운데 가장 최근 것 한 번만 실행하고 더 오래된 것은 버린다.', analogy: '결석한 날의 가정통신문을 다음 날 한 장만 받는 것', session: 7 },
  { id: 'idempotent', term: '두 번 돌려도 안전하게', en: 'Idempotent', def: '같은 작업을 실수로 다시 실행해도 결과가 겹치거나 망가지지 않게 만드는 설계. "같은 날짜의 결과가 이미 있으면 건너뛴다" 같은 조건을 지시문에 넣는다. 멱등성이라고도 한다.', analogy: '출석부에 이미 표시한 칸은 다시 표시하지 않는다', session: 7 },
  { id: 'permission-rule', term: '허용·거부 규칙', en: 'Permission rule', def: '특정 도구나 경로의 사용을 미리 허용(allow)하거나, 물어보게(ask) 하거나, 막는(deny) 설정. Edit(보낸문서/**)처럼 쓴다. 거부 규칙이 가장 먼저 적용되고, 지시문과 달리 Claude Code가 직접 지킨다.', analogy: '열쇠를 맡길 때 "교무실 캐비닛만"이라고 정해 주는 것', session: 7 },
];
