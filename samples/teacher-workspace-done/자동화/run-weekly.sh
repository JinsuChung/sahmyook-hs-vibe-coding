#!/usr/bin/env bash
# 주간 브리핑을 헤드리스(대화 창 없이)로 한 번 실행하는 예시입니다. macOS·Linux용.
#
#   사용법:  bash 자동화/run-weekly.sh              ← 오늘 날짜 기준
#           bash 자동화/run-weekly.sh 2026-11-16   ← 날짜를 정해서 연습
#
# 이 과정에서는 데스크톱 앱의 예약 작업을 기본으로 씁니다. 이 스크립트는
# "헤드리스 실행이 무엇이고 권한을 어떻게 좁히는지"를 보여 주는 예시입니다.
# 매주 자동으로 돌리려면 이 스크립트를 운영체제의 예약 기능(cron 등)에 등록합니다.
#
# 명령과 옵션은 Claude Code 공식 문서를 따랐습니다. 버전에 따라 달라질 수 있으니
# 동작이 다르면 문서를 확인하세요.
#   https://code.claude.com/docs/en/headless
#   https://code.claude.com/docs/en/permission-modes

set -u

# 1) 업무 폴더(이 스크립트가 든 자동화/ 폴더의 위)로 이동합니다.
#    claude는 실행한 폴더의 CLAUDE.md와 .claude/ 폴더(스킬, 서브에이전트)를 읽습니다.
cd "$(dirname "$0")/.." || exit 1

# 2) 기준 날짜. 인자를 주지 않으면 오늘입니다.
TODAY="${1:-$(date +%F)}"

# 3) 시킬 일. 긴 지시문은 파일에 두고, 여기서는 "그 파일을 읽고 수행하라"고만 합니다.
PROMPT="자동화/주간브리핑_지시문.md 파일을 읽고, '지시문' 제목 아래에 적힌 대로 수행해 줘. 오늘 날짜는 ${TODAY}로 계산해."

# 4) 실행.
#    -p (--print)                 대화 창 없이 한 번 실행하고 마지막 답을 출력합니다.
#    --permission-mode dontAsk    물어봐야 하는 동작은 묻지 않고 모두 거부합니다.
#                                 작업 폴더 안의 파일 읽기와 아래에서 미리 허용한 것만 실행됩니다.
#    --allowedTools "Edit(...)"   보낸문서/ 폴더 안에서만 파일을 만들고 고칠 수 있게 허용합니다.
#                                 새 파일 만들기(Write)도 Edit 규칙으로 허용합니다.
#    --max-turns 40               끝없이 도는 일을 막는 상한입니다.
#
#    일부러 허용하지 않은 것: 명령 실행(ls, cat 같은 읽기 전용 명령은 제외), 인터넷(WebFetch, WebSearch),
#    보낸문서/ 밖의 쓰기.
#    그래서 파일을 지우거나 폴더 밖으로 보내는 동작은 지시문을 어겨도 권한에서 한 번 더 막힙니다.
#    그 대가로 docx처럼 명령을 써야 읽을 수 있는 파일은 "읽지 못함"으로 남습니다.
RESULT="$(claude -p "$PROMPT" \
  --permission-mode dontAsk \
  --allowedTools "Edit(보낸문서/**)" \
  --max-turns 40)"
CODE=$?   # 0이면 성공, 0이 아니면 실패입니다.

# 5) 기록 남기기. 기록은 에이전트가 아니라 이 스크립트가 남깁니다.
#    에이전트에게 자동화/ 폴더의 쓰기 권한을 주지 않기 위해서입니다.
{
  echo
  echo "## $(date '+%F %T') 주간 브리핑 (기준일 ${TODAY}, 종료 코드 ${CODE})"
  echo
  echo "$RESULT"
} >> "자동화/실행기록.md"

echo "$RESULT"
exit "$CODE"
