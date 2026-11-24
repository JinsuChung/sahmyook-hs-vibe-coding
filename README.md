# 교실과 교무실을 바꾸는 바이브 코딩

서울삼육고등학교 선생님을 위한 Claude Code 바이브 코딩·AI 에이전트 실습 사이트입니다.
수업에서는 굵직한 흐름을 함께 하고, 수업 뒤에는 회차마다 짝지어 둔 "깊이 파기"로 혼자 차분히 공부할 수 있습니다.

- 사이트: https://sahmyook-hs-vibe-coding.vercel.app
- 강의: 정진수
- 기술: Next.js 16 + Fumadocs + MDX (Vercel 배포)

## 과정 구성

| 부 | 회차 | 내용 |
| --- | --- | --- |
| 1부 · 바이브 코딩 기초 | 1 | 바이브 코딩에서 에이전틱 엔지니어링으로 |
| | 2 | 인스턴트 소프트웨어: 쓰고 지우는 내 업무 도구 |
| | 3 | 안전망과 공유: Git·GitHub, 그리고 배포 |
| | 4 | 데이터와 AI를 붙인 웹앱 |
| 2부 · 에이전트 개발 | 5 | 내 업무를 맡기는 에이전트: 반복 업무에서 시작하기 |
| | 6 | 에이전트 키우기: 스킬·서브에이전트·연결 |
| | 7 | 스스로 도는 에이전트: 예약 실행과 자동화 |
| | 8 | 교육용 에이전트 만들기, 그리고 책임 있게 쓰기 |

회차마다 n.5 "깊이 파기" 페이지가 있습니다.

## 로컬에서 실행

```bash
pnpm install
pnpm dev
```

## 콘텐츠 고치기

| 고칠 것 | 파일 |
| --- | --- |
| 회차 본문 / 깊이 파기 | `content/docs/sessions/{n}.mdx`, `self-{n}.mdx` |
| 회차 제목·목표·깊이 파기 계획 | `content/data/sessions.ts` |
| 프롬프트 | `content/data/parts/prompts-s{n}.ts`, `prompts-common.ts` |
| 퀴즈 / 용어 / 준비 체크리스트 | `content/data/parts/quiz-s{n}.ts`, `glossary-s{n}.ts`, `checklists-s{n}.ts` |
| 학교 업무 예시 / FAQ | `content/data/examples.ts`, `content/data/faq.ts` |
| 요금·버전 등 바뀌는 정보 | `content/data/facts.ts` |
| 회차별 완성본 | `samples/` (수행평가 일정 보드, 교무수첩 업무 폴더, 학습 도우미) |
| 자료실 zip 다시 만들기 | `scripts/` 의 Python 스크립트 (openpyxl, pillow, reportlab, python-docx 필요) |

고친 뒤에는 `node scripts/check-content.mjs`(끊어진 참조 검사)와 `pnpm build`를 돌려 확인합니다.
`main` 브랜치에 푸시하면 Vercel이 자동으로 다시 배포합니다.

## 약속

- 실습 자료는 모두 교육용 가상 데이터입니다(새봄고등학교). 실제 학교·학생·교사와 관계없습니다.
- 학생 개인정보는 AI에 넣지 않습니다.
- 평가와 기록의 최종 판단은 교사가 합니다. AI는 초안·점검·취합을 돕습니다.

## 라이선스

이 저장소를 가져다 내 수업 사이트로 고쳐 써도 됩니다. 출처만 밝혀 주세요. 방법은 사이트의 [내 수업 사이트 만들기](https://sahmyook-hs-vibe-coding.vercel.app/remix)에 있습니다.

- 코드: [MIT](LICENSE)
- 글과 교육 자료(`content/`, 교재 PDF, 실습 문서): [CC BY 4.0](content/LICENSE.md)
- 김소월 「진달래꽃」 본문은 저작권 보호 기간이 끝난 공유 저작물입니다.
