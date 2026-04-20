export const formatKoreanDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatMinutesToHours = (minutes = 0) => {
  const safeMinutes = Number(minutes) || 0;
  const hours = Math.floor(safeMinutes / 60);
  const remainMinutes = safeMinutes % 60;

  return `${hours}시간 ${remainMinutes}분`;
};

export const getAttendanceStatusLabel = (status, hasRecord, hasCheckOut) => {
  if (!hasRecord) return "미출근";
  if (hasCheckOut) return "근무 종료";

  switch (status) {
    case "late":
      return "지각 출근";
    case "present":
      return "근무 중";
    default:
      return "근무 중";
  }
};

export const getAttendanceStatusClassName = (status, hasRecord, hasCheckOut) => {
  if (!hasRecord) return "is-idle";
  if (hasCheckOut) return "is-done";

  switch (status) {
    case "late":
      return "is-late";
    case "present":
      return "is-working";
    default:
      return "is-working";
  }
};