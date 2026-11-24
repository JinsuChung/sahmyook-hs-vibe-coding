# 작업 규칙

- 이 저장소는 서울삼육고등학교 교사 대상 강의 사이트다(코딩 경험 없는 독자). 본문은 한국어, 존댓말("-습니다"), 버튼·안내는 "-요".
- 구성: 1부 바이브 코딩 기초(1–4회차), 2부 에이전트 개발(5–8회차). 회차 페이지(`sessions/{n}.mdx`)는 수업용 굵직한 흐름, 깊이 파기(`sessions/self-{n}.mdx`, 번호 n.5)는 혼자 보는 심화다.
- 예시와 비유는 학교 현장(수업·평가·학급 운영·교무·공문)에서 가져온다.
- 실습 데이터·예시는 모두 가상이다(새봄고등학교). 실제 학생·교사 정보나 실존 학교의 내부 정보를 넣지 않는다.
- 학생 개인정보를 AI에 넣지 않는다는 원칙과 "평가·기록의 최종 판단은 교사"라는 원칙을 흐리는 내용을 쓰지 않는다.
- 프롬프트는 `content/data/parts/prompts-s{n}.ts`(공용은 `prompts-common.ts`)가 단일 출처다. MDX에서는 `<PromptCard id="..." />`로 참조한다. 퀴즈·용어·체크리스트도 `content/data/parts/`에 회차별 파일로 둔다.
- 바뀔 수 있는 사실(요금·한도·버전)은 `content/data/facts.ts`에 두고 확인일을 갱신한다. 트렌드·통계·제도는 출처 링크가 있는 확인된 사실만 쓴다.
- 숫자 범위는 "2–4"처럼 en dash로 쓴다("2~4"는 MDX에서 취소선이 된다). 굵게 표시가 괄호·따옴표로 끝나고 바로 한글이 이어지면 `<b>`를 쓴다.
- 색은 `app/global.css`의 토큰을 쓴다. 글꼴은 Pretendard, 기본 자간 -0.02em.
- 패키지를 넣거나 버전을 바꾸면 `pnpm audit --audit-level critical`을 통과시킨다(완성본 샘플은 각 폴더에서 `npm audit --audit-level=critical`).
- 변경 후 `node scripts/check-content.mjs`와 `pnpm build`가 통과하는지 확인한다.
- 인쇄용 교재는 `/book`(app/book)이 사이트 내용을 모아 그리고, `public/downloads/sahmyook-hs-vibe-coding-book.pdf`는 `scripts/make-book-pdf.mjs`로 만든다(사용법은 파일 머리말). 본문을 고치면 PDF도 다시 만든다. 인쇄에서만 달라지는 부품 모양은 `usePrintMode()`로 고른다.
