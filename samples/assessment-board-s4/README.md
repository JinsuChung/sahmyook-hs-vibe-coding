# 수행평가 일정 보드 — 4회차 완성본 (Supabase + Claude API)

3회차 보드에 두 가지를 더한 버전입니다.

1. **데이터베이스(Supabase):** 평가 일정을 코드가 아니라 데이터베이스에 둡니다. 교사가 로그인해 화면에서 등록·수정·삭제합니다.
2. **AI 추출(Claude API):** 평가계획 문서의 글을 붙여 넣으면 AI가 평가명·과목·학년·마감일·담당 교사를 뽑아 목록으로 보여 줍니다. 교사가 확인하고 **직접 저장**합니다.

학생 이름·성적 같은 개인정보는 다루지 않습니다. 평가계획 문서에 학생 정보가 섞여 있으면 지우고 넣으세요.

## 준비물

- [Node.js](https://nodejs.org) LTS 버전
- [Supabase](https://supabase.com) 계정과 프로젝트 1개 (무료 요금제로 충분)
- [Claude Console](https://platform.claude.com) 계정과 API 키 (선불 크레딧 필요)

## 실행 순서

### 1. Supabase 준비

1. Supabase 대시보드에서 새 프로젝트를 만듭니다.
2. **SQL Editor**를 열어 `supabase/schema.sql` 내용을 통째로 붙여 넣고 **Run**을 누릅니다. 테이블 `public.assessments`, RLS 정책 4개, 가상 데이터 10건이 만들어집니다.
3. **Authentication → Users**에서 교사 계정(이메일·비밀번호)을 만듭니다. 이 앱에는 가입 화면이 없습니다. 계정은 관리자가 여기서 만들어 줍니다.
4. 화면 위쪽의 **Connect** 또는 **Settings → API Keys**에서 프로젝트 주소(URL)와 공개 키(Publishable key, 예전 이름 anon)를 확인합니다. 비밀 키(Secret key, 예전 이름 `service_role`)는 쓰지 않습니다. 메뉴 이름이 다르면 [Supabase 공식 문서](https://supabase.com/docs/guides/api/api-keys)를 보세요.

### 2. Claude API 키 준비

1. [Claude Console](https://platform.claude.com)에서 크레딧을 충전합니다.
2. **키를 만들기 전에 월 사용 한도를 먼저 정합니다.** [Spend limits](https://platform.claude.com/settings/spend-limits) 화면에서 **Monthly spend limit** 옆의 **Set limit**(또는 **Adjust limit**)을 눌러 금액을 넣습니다. 실습용이면 몇 달러면 충분합니다.
3. API 키를 발급합니다. 키는 한 번만 보이므로 바로 다음 단계의 파일에 넣습니다.

### 3. 환경변수 넣기

`.env.local.example`을 복사해 `.env.local`로 이름을 바꾸고 값을 넣습니다. **키는 Claude Code 채팅창에 붙여 넣지 말고 파일에 직접** 넣으세요.

| 이름 | 어디서 쓰이나 | 설명 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 브라우저·서버 | Supabase 프로젝트 주소 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 브라우저·서버 | Supabase 공개 키. 화면에 보여도 되는 키이며 권한은 RLS 정책이 지킵니다 |
| `ANTHROPIC_API_KEY` | **서버만** | Claude API 키. `NEXT_PUBLIC_`이 붙지 않아 브라우저로 내려가지 않습니다 |
| `CLAUDE_MODEL` | 서버만 (선택) | 추출에 쓸 모델. 비우면 `claude-haiku-5-5` |

### 4. 실행

```bash
npm install
npm run dev
```

http://localhost:3000 을 엽니다. 로그인 → **평가계획 문서로 등록**에 문서를 붙여 넣고 **AI로 항목 뽑기** → 목록에서 **등록 폼에 채우기** → 값 확인·수정 → **저장**.

## 어떻게 동작하나요

| 파일 | 하는 일 |
| --- | --- |
| `supabase/schema.sql` | 테이블, RLS 정책 4개, 가상 데이터 10건 |
| `lib/supabase.ts` | Supabase 연결(공개 키만 사용)과 데이터 모양(타입) |
| `lib/dday.ts` | 한국 시간 기준 오늘 날짜, D-day, 요일 계산 |
| `components/board.tsx` | 목록, 교사 로그인, 등록·수정 폼, 삭제 |
| `components/extract-panel.tsx` | 문서 입력칸, AI 결과 목록, 숨은 지시문 경고 |
| `app/api/extract/route.ts` | **서버에서만 실행.** 로그인 확인 → Claude API 호출 → 결과 검사 → 목록 반환 |
| `app/page.tsx`, `app/layout.tsx`, `app/globals.css` | 화면 틀과 꾸밈 |

### RLS 정책 (누가 무엇을 할 수 있나)

| 정책 이름 | 뜻 |
| --- | --- |
| 누구나 읽기 | 로그인하지 않아도 일정을 볼 수 있다 |
| 로그인한 교사만 추가 | 로그인해야 등록할 수 있다 |
| 등록한 본인만 수정 | 내가 등록한 평가만 고칠 수 있다 |
| 등록한 본인만 삭제 | 내가 등록한 평가만 지울 수 있다 |

화면의 **수정**·**삭제** 버튼은 로그인한 모든 교사에게 보입니다. 남이 등록한 평가에 누르면 데이터베이스가 거절하고 "본인이 등록한 평가만 …" 안내가 뜹니다. 버튼을 숨겨서가 아니라 **데이터베이스가 막는다**는 것을 확인해 보세요(교사 계정 두 개로 시험). SQL로 넣은 가상 데이터 10건은 등록한 사람이 비어 있어 앱에서는 아무도 고치거나 지울 수 없습니다.

### AI 추출

- **모델:** Claude Haiku 5.5 (`claude-haiku-5-5`). 정해진 항목을 뽑는 일이라 가장 빠르고 저렴한 모델에 `effort: 'low'`로 충분합니다. 결과가 아쉬우면 `.env.local`의 `CLAUDE_MODEL`을 `claude-sonnet-5-5`로 바꿔 비교해 보세요.
- **결과 모양 고정:** 구조화 출력(`output_config.format`의 JSON 스키마)으로 항상 `title, subject, grade, deadline, teacher` 목록과 경고 여부만 받습니다.
- **비용 어림:** A4 한두 쪽 문서 한 번에 많이 잡아도 0.3센트(몇 원) 수준입니다(2026-11-16 기준 Haiku 5.5: 입력 100만 토큰당 $0.10, 출력 $0.50, `max_tokens` 4,000 기준). 정확한 요금은 [공식 요금표](https://platform.claude.com/docs/en/about-claude/pricing)를 확인하세요.

## 안전장치

- **API 키는 서버에서만:** `ANTHROPIC_API_KEY`는 `app/api/extract/route.ts`에서만 읽습니다. 브라우저 코드에는 들어가지 않습니다.
- **로그인한 교사만 AI 호출:** 로그인하지 않은 사람이 내 키로 요금을 쓰지 못하게, 브라우저가 보낸 Supabase 로그인 토큰을 서버에서 확인합니다.
- **문서는 자료로만:** 문서를 `<document>` 태그로 감싸고, 그 안의 지시는 따르지 않도록 시스템 프롬프트에 적었습니다.
- **숨은 지시문 경고(두 겹):** AI가 "지시문으로 보이는 문장이 있다"고 표시하거나, 서버 코드가 "이전 지시를 무시" 같은 표현을 직접 찾으면 화면에 빨간 경고와 그 문장을 보여 줍니다. 4회차 자료의 평가계획 문서 중 숨은 지시문이 든 문서로 시험해 보세요.
- **AI 답을 그대로 믿지 않기:** 서버가 결과를 다시 검사합니다. 날짜 형식이 아니거나 오늘 기준 60일 전 – 400일 뒤를 벗어난 마감일(예: 2099-12-31)은 비우고 이유를 보여 줍니다.
- **저장은 사람이:** AI는 목록만 만들고, 폼에 채우기와 저장은 교사가 누릅니다. 자동 등록은 없습니다.
- **길이·분량 제한:** 문서는 12,000자까지, AI 응답은 `max_tokens` 4,000까지, 한 번에 20건까지 받습니다.

이 장치들은 사고를 줄여 줄 뿐 완벽하지 않습니다. 저장 전 원문 대조가 마지막 안전장치입니다.

## 배포 방법 (Vercel)

1. 이 폴더를 GitHub 저장소에 올립니다. `.env.local`은 `.gitignore`에 들어 있어 올라가지 않습니다.
2. Vercel에서 저장소를 가져온 뒤 **Settings → Environment Variables**에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`를 등록합니다.
3. 환경변수를 넣거나 바꾼 뒤에는 **다시 배포(Redeploy)** 해야 반영됩니다.

메뉴 이름이 다르게 보이면 [Vercel](https://vercel.com/docs), [Supabase](https://supabase.com/docs), [Claude Console](https://platform.claude.com/docs) 공식 문서를 확인하세요.

## 자주 막히는 곳

| 증상 | 확인할 것 |
| --- | --- |
| "Supabase 연결 정보가 없어요" | `.env.local` 파일 이름과 값. 고친 뒤 개발 서버를 껐다 켜기 |
| 목록이 비어 있음 | `schema.sql`을 실행했는지, "누구나 읽기" 정책이 있는지 |
| 로그인 실패 | Supabase **Authentication → Users**에 계정이 있는지 |
| "서버에 ANTHROPIC_API_KEY가 설정되지 않았어요" | `.env.local`(내 PC) 또는 Vercel 환경변수(배포본)에 키가 있는지 |
| "AI가 요청을 받지 않았어요" | Console의 크레딧 잔액과 사용 한도 |

## 가상 데이터 고지

학교 이름, 교사 이름, 평가명, 날짜는 모두 실습용으로 지어낸 것입니다.

교육용 가상 데이터 — 실제 기관·인물과 관계없음
