# 작업 규칙
- 답변과 화면 문구는 한국어로 쓴다. 학생이 읽는 문구는 고등학생 눈높이의 존댓말로 쓴다
- 과목·단원·학습 목표·제한 값은 lib/tutor-config.ts 한 곳에서만 고친다. 튜터의 행동 규칙은 lib/tutor-prompt.ts에 있다
- ANTHROPIC_API_KEY와 CLASS_CODE는 .env.local과 Vercel 환경변수에만 둔다. 브라우저 코드('use client' 파일)에서 읽지 않는다
- Claude API는 app/api 아래 서버 코드에서만 호출한다
- 학생의 대화 내용과 개인정보를 저장하지 않는다. 서버 기록(console.log 등)에도 대화 본문을 남기지 않는다
- 튜터 규칙이나 설정을 고치면 eval/questions.md의 시험 질문을 다시 넣어 보고, npm run build가 통과하는지 확인한다
