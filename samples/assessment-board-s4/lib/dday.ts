const DAY = 86_400_000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 한국 시간 기준 오늘 날짜(YYYY-MM-DD). 서버 시계가 UTC여도 자정 무렵에 하루가 어긋나지 않게 9시간을 더한다 */
export function todayInKorea() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 마감일까지 남은 날 수. 오늘이 마감이면 0, 지났으면 음수 */
export function dday(deadline: string, today = todayInKorea()) {
  return Math.round((Date.parse(deadline) - Date.parse(today)) / DAY);
}

export function weekday(date: string) {
  return WEEKDAYS[new Date(date).getUTCDay()];
}
