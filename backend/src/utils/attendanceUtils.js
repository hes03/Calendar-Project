export const getKoreaNow = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
};

export const getKoreaDateString = () => {
  const date = getKoreaNow();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getNowIsoString = () => {
  return new Date().toISOString();
};

export const calculateWorkMinutes = (checkInAt, checkOutAt) => {
  if (!checkInAt || !checkOutAt) return 0;

  const checkInDate = new Date(checkInAt);
  const checkOutDate = new Date(checkOutAt);

  const diffMs = checkOutDate.getTime() - checkInDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
};

export const getAttendanceStatus = (checkInAt) => {
  if (!checkInAt) return "ABSENT";

  const date = new Date(checkInAt);
  const koreaTime = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const hour = koreaTime.getHours();
  const minute = koreaTime.getMinutes();

  if (hour < 9 || (hour === 9 && minute <= 0)) {
    return "ON_TIME";
  }

  return "LATE";
};

export const getMonthStartDateString = (year, month) => {
  const monthString = String(month).padStart(2, "0");
  return `${year}-${monthString}-01`;
};

export const getNextMonthStartDateString = (year, month) => {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonthString = String(nextMonth).padStart(2, "0");

  return `${nextYear}-${nextMonthString}-01`;
};