import type { Term } from '../glossary';

export const glossaryS5: Term[] = [
  { id: 'agent-loop', term: '에이전트 루프', en: 'Agentic loop', def: '에이전트가 일하는 순서. 맥락을 모으고(읽기·찾기), 행동하고(만들기·고치기·실행), 결과를 확인하는 세 가지를 일이 끝날 때까지 되풀이한다. 사람은 언제든 끼어들어 방향을 바꿀 수 있다.', analogy: '자료 찾기 → 기안 → 검토를 일이 끝날 때까지 되풀이하는 업무 처리', session: 5 },
  { id: 'tool', term: '도구', en: 'Tool', def: '에이전트가 말이 아니라 행동을 하게 해 주는 기능. 파일 읽기·쓰기, 찾기, 명령 실행, 웹 검색 등이 있다. 도구가 없으면 모델은 글로 답하는 것밖에 하지 못한다.', analogy: '업무 담당자의 손과 사무기기', session: 5 },
  { id: 'system-prompt', term: '시스템 프롬프트', en: 'System prompt', def: '대화가 시작되기 전에 모델에게 먼저 주어지는 기본 지시문. 역할과 지켜야 할 것을 정한다. Claude Code에는 기본 지시문이 들어 있고, 내가 쓴 CLAUDE.md는 그 뒤에 덧붙여 전달된다. 8회차에서는 학습 도우미의 시스템 프롬프트를 직접 쓴다.', analogy: '첫 출근 날 받는 복무 안내', session: 5 },
  { id: 'skill', term: '스킬', en: 'Skill', def: '되풀이하는 일의 절차를 적어 둔 지시문. 폴더 하나에 SKILL.md 파일을 두면 Claude Code가 필요할 때 읽어서 따른다. /이름으로 직접 부르거나, 요청이 설명과 맞으면 Claude가 스스로 불러온다.', analogy: '업무 매뉴얼의 한 장. 예: "가정통신문 초안 쓰는 순서"', session: 5 },
  { id: 'skill-description', term: '스킬 설명', en: 'description', def: 'SKILL.md 맨 위에 적는 한두 문장. 무엇을 하는 스킬이고 언제 쓰는지를 쓴다. Claude는 대화를 시작할 때 스킬의 이름과 설명만 보고 있다가, 요청이 설명과 맞으면 본문을 읽어 온다. 모호하면 불리지 않거나 엉뚱한 때 불린다.', analogy: '매뉴얼 책등에 붙인 제목. 제목이 분명해야 필요한 때 꺼내 본다', session: 5 },
  { id: 'slash-command', term: '슬래시 명령', en: 'Slash command', def: '입력창에 /로 시작해서 치는 명령. /clear 같은 기본 명령이 있고, 내가 만든 스킬도 /home-letter처럼 폴더 이름(또는 name)으로 부른다. 메시지 맨 앞에 써야 바로 실행된다.', analogy: '"3번 서식으로 해 주세요"처럼 미리 약속해 둔 짧은 말', session: 5 },
  { id: 'work-folder', term: '업무 폴더', en: 'Working folder', def: '에이전트에게 열어 주는 작업장. Claude Code는 연 폴더와 그 하위 폴더의 파일을 묻지 않고 읽을 수 있으므로, 맡길 일에 필요한 자료만 든 폴더를 따로 만들어 연다. 학생 정보가 든 파일은 두지 않는다.', analogy: '업무 지원 인력에게 내어 주는 책상과 서류함', session: 5 },
  { id: 'automation-candidate', term: '자동화 후보', en: 'Automation candidate', def: '에이전트에게 맡길 만한 반복 업무. 자주 하고, 절차가 정해져 있고, 입력과 결과물이 파일이고, 틀려도 사람이 확인해 고칠 수 있고, 학생 개인정보가 없거나 뺄 수 있는 일이다. 판단·상담·되돌릴 수 없는 발송은 후보가 아니다.', analogy: '업무 분장에서 지원 인력에게 넘겨도 되는 일', session: 5 },
  { id: 'skill-argument', term: '스킬 인자', en: 'Arguments', def: '/home-letter 뒤에 덧붙여 쓰는 말. 스킬 본문의 $ARGUMENTS 자리에 그대로 들어간다. 같은 절차에 그때그때 다른 내용을 넣을 수 있게 해 준다.', analogy: '서식의 빈칸에 써넣는 이번 건의 내용', session: 5 },
  { id: 'compaction', term: '자동 요약', en: 'Compaction', def: '대화가 길어져 컨텍스트 창이 차면 Claude Code가 앞부분을 요약해 자리를 비우는 일. 요청과 핵심은 남지만 초반의 자세한 지시는 빠질 수 있어서, 늘 지켜야 할 규칙은 CLAUDE.md에 적어 둔다.', analogy: '긴 회의 끝에 앞 안건을 요약본으로 갈음하기', session: 5 },
];
