export const getKoreaDateString = (date = new Date()) => {
  const koreaTime = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getNowIsoString = () => {
  return new Date().toISOString();
};

export const calculateWorkMinutes = (checkInAt, checkOutAt) => {
  const start = new Date(checkInAt).getTime();
  const end = new Date(checkOutAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  return Math.floor((end - start) / 1000 / 60);
};

export const getAttendanceStatus = (checkInAt) => {
  const date = new Date(checkInAt);

  const koreaTime = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const hour = koreaTime.getHours();
  const minute = koreaTime.getMinutes();

  // 예시 기준: 09:00 이후 출근이면 지각
  if (hour > 9 || (hour === 9 && minute > 0)) {
    return "late";
  }

  return "present";
};