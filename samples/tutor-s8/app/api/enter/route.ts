import { checkAccess } from '@/lib/access';

// 입장 확인 (서버에서만 실행)
// 학생이 첫 화면에서 수업 코드를 넣으면 맞는지 틀린지만 알려 준다.
// 통과해도 서버는 아무것도 기억하지 않는다. 대화를 보낼 때마다 app/api/chat 이 코드를 다시 확인한다.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: unknown };
  const access = checkAccess(req, body.code);
  if (!access.ok) return Response.json({ error: access.error }, { status: access.status });
  return Response.json({ ok: true });
}
