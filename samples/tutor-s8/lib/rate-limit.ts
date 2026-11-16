// ─────────────────────────────────────────────────────────────
// 간단한 요청 횟수 제한 (서버 메모리에 횟수를 적어 두는 방식)
//
// 솔직한 한계:
// - 횟수를 서버의 메모리에만 적어 둡니다. Vercel 같은 서버리스 환경에서는
//   서버가 잠들었다 깨어나거나 여러 대로 나뉘어 돌 때 횟수가 0으로 돌아가거나
//   서버마다 따로 셉니다. 그래서 이 제한은 "대략의 과속 방지턱"입니다.
// - 비용의 진짜 상한선은 Claude Console의 월 사용 한도(Spend limits)입니다.
//   이 파일만 믿지 말고 Console 한도를 반드시 걸어 두세요.
// - 정확한 제한이 필요하면 횟수를 외부 저장소(Redis 등)에 적어야 합니다.
// ─────────────────────────────────────────────────────────────

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** 기간이 지난 기록을 치운다 (기록이 많이 쌓였을 때만) */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * key 이름으로 1회를 쓴다. windowMs 동안 limit번까지만 허용한다.
 * 허용되면 ok: true, 넘었으면 ok: false 와 몇 초 뒤에 다시 되는지(retryAfterSec)를 돌려준다.
 */
export function take(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** 횟수를 쓰지 않고, 이미 limit에 닿았는지만 본다 */
export function isOver(key: string, limit: number) {
  const bucket = buckets.get(key);
  return Boolean(bucket && bucket.resetAt > Date.now() && bucket.count >= limit);
}

export const MINUTE = 60_000;
export const DAY = 24 * 60 * MINUTE;
