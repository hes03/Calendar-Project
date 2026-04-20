export const isSameDay = (dateA, dateB) => {
  const a = new Date(dateA);
  const b = new Date(dateB);

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const formatKoreanFullDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

export const formatTimeRange = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);

  const startText = s.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const endText = e.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${startText} - ${endText}`;
};

export const sortSchedulesByStart = (schedules = []) => {
  return [...schedules].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
};

export const getTodaySchedules = (schedules = []) => {
  const today = new Date();
  return schedules.filter((schedule) => isSameDay(schedule.start, today));
};

export const getSchedulesByDate = (schedules = [], selectedDate) => {
  if (!selectedDate) return [];
  return schedules.filter((schedule) => isSameDay(schedule.start, selectedDate));
};