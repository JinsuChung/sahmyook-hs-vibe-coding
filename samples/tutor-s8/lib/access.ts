import { createHash, timingSafeEqual } from 'node:crypto';
import { isOver, take, MINUTE } from './rate-limit';

// ─────────────────────────────────────────────────────────────
// 수업 코드 확인 (서버에서만 실행)
//
// 수업 코드는 환경변수 CLASS_CODE 에 넣어 둡니다. 비교는 서버에서만 하고,
// 코드 자체는 브라우저로 내려보내지 않습니다.
// 수업 코드는 "아무나 들어와 내 API 요금을 쓰는 것"을 막는 문턱일 뿐,
// 학생 한 명 한 명을 확인하는 로그인이나 연령 확인이 아닙니다.
// ─────────────────────────────────────────────────────────────

const MAX_WRONG_TRIES = 30; // 같은 인터넷 주소에서 10분 동안 틀릴 수 있는 횟수 (한 교실이 같은 주소를 쓰므로 넉넉하게)
const WRONG_WINDOW = 10 * MINUTE;

/** 요청을 보낸 곳의 인터넷 주소(IP). Vercel이 x-forwarded-for 머리말에 넣어 준다 */
export function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}

function digest(value: string) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest();
}

type Access = { ok: true; ip: string } | { ok: false; status: number; error: string };

/** 수업 코드가 맞는지 확인한다. 대소문자와 앞뒤 공백은 구분하지 않는다 */
export function checkAccess(req: Request, code: unknown): Access {
  const expected = process.env.CLASS_CODE?.trim();
  if (!expected) {
    // 코드가 설정되지 않은 서버는 아무도 들여보내지 않는다 (열어 두는 쪽이 아니라 닫는 쪽으로 실패)
    return { ok: false, status: 500, error: '서버에 수업 코드(CLASS_CODE)가 설정되지 않았어요. 선생님께 알려 주세요.' };
  }
  const ip = clientIp(req);
  const failKey = `wrong-code:${ip}`;
  if (isOver(failKey, MAX_WRONG_TRIES)) {
    return { ok: false, status: 429, error: '수업 코드를 여러 번 틀렸어요. 10분쯤 뒤에 다시 시도해 주세요.' };
  }
  const given = typeof code === 'string' ? code.slice(0, 100) : '';
  // 글자를 하나씩 비교하면 걸리는 시간으로 코드를 추측할 수 있어, 길이가 같은 값(해시)으로 바꿔 한 번에 비교한다
  if (!given.trim() || !timingSafeEqual(digest(given), digest(expected))) {
    take(failKey, MAX_WRONG_TRIES, WRONG_WINDOW);
    return { ok: false, status: 401, error: '수업 코드가 맞지 않아요. 선생님이 알려 준 코드를 다시 확인해 주세요.' };
  }
  return { ok: true, ip };
}
