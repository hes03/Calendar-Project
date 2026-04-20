export const isSameDay = (dateA, dateB) => {
  const a = new Date(dateA);
  const b = new Date(dateB);

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfWeek = (date) => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getTodaySchedules = (schedules) => {
  const today = new Date();
  return schedules.filter((schedule) => isSameDay(schedule.start, today));
};

export const getWeekSchedules = (schedules) => {
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);

  return schedules.filter((schedule) => {
    const start = new Date(schedule.start);
    return start >= startOfWeek && start <= endOfWeek;
  });
};

export const getUpcomingSchedules = (schedules, limit = 5) => {
  const now = new Date();

  return [...schedules]
    .filter((schedule) => new Date(schedule.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, limit);
};

export const sortSchedulesByStart = (schedules) => {
  return [...schedules].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${min}`;
};