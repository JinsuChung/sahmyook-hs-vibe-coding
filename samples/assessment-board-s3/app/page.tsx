import { assessments } from '@/data/assessments';

// 오늘 날짜 기준 D-day를 매번 새로 계산하도록 요청마다 렌더링
export const dynamic = 'force-dynamic';

const DAY = 86_400_000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 한국 시간 기준 오늘 날짜(YYYY-MM-DD). 서버 시계가 UTC여도 자정 무렵에 하루가 어긋나지 않게 9시간을 더한다 */
function todayInKorea() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 마감일까지 남은 날 수. 오늘이 마감이면 0, 지났으면 음수 */
function dday(deadline: string, today: string) {
  return Math.round((Date.parse(deadline) - Date.parse(today)) / DAY);
}

function weekday(date: string) {
  return WEEKDAYS[new Date(date).getUTCDay()];
}

export default function Page() {
  const today = todayInKorea();
  const list = [...assessments].sort((a, b) => a.deadline.localeCompare(b.deadline));
  const urgentCount = list.filter((a) => {
    const d = dday(a.deadline, today);
    return d >= 0 && d <= 7;
  }).length;

  return (
    <main>
      <h1>새봄고 수행평가 일정 보드</h1>
      <p className="summary">
        오늘 {today}({weekday(today)}) 기준 · 전체 {list.length}건 · 7일 안에 마감 <b>{urgentCount}건</b>
      </p>
      <div className="grid">
        {list.map((a) => {
          const d = dday(a.deadline, today);
          return (
            <article key={a.id} className={`card ${d >= 0 && d <= 7 ? 'urgent' : ''} ${d < 0 ? 'past' : ''}`}>
              <div className="dday">{d < 0 ? '마감' : d === 0 ? 'D-DAY' : `D-${d}`}</div>
              <strong>{a.title}</strong>
              <div className="meta">
                {a.grade}학년 · {a.subject} · 담당 {a.teacher}
              </div>
              <div className="meta">
                마감 {a.deadline}({weekday(a.deadline)})
              </div>
            </article>
          );
        })}
      </div>
      <p className="meta foot">교육용 가상 데이터 — 실제 기관·인물과 관계없음</p>
    </main>
  );
}
