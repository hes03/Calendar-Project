export const formatKoreanDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

export const formatDateOnly = (value) => {
  if (!value) return "-";
  return value;
};

export const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatTimeOnly = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatTime = (value) => {
  return formatTimeOnly(value);
};

export const formatWorkMinutes = (minutes) => {
  if (minutes == null) return "-";

  const safeMinutes = Number(minutes) || 0;
  const hour = Math.floor(safeMinutes / 60);
  const minute = safeMinutes % 60;

  if (hour === 0) return `${minute}분`;
  if (minute === 0) return `${hour}시간`;

  return `${hour}시간 ${minute}분`;
};

export const formatMinutesToHours = (minutes = 0) => {
  return formatWorkMinutes(minutes);
};

export const getAttendanceStatusLabel = (status, hasRecord, hasCheckOut) => {
  if (!hasRecord) return "미출근";
  if (status === "VACATION") return "휴가";
  if (hasCheckOut) return "퇴근 완료";

  switch (status) {
    case "ON_TIME":
      return "정상 출근";
    case "LATE":
      return "지각";
    case "late":
      return "지각 출근";
    case "present":
      return "근무 중";
    default:
      return "근무 중";
  }
};

export const getAttendanceStatusClassName = (
  status,
  hasRecord,
  hasCheckOut
) => {
  if (!hasRecord) return "attendance-badge attendance-badge--idle";
  if (status === "VACATION") {
    return "attendance-badge attendance-badge--vacation";
  }
  if (hasCheckOut) return "attendance-badge attendance-badge--done";

  switch (status) {
    case "ON_TIME":
      return "attendance-badge attendance-badge--success";
    case "LATE":
      return "attendance-badge attendance-badge--warning";
    case "late":
      return "is-late";
    case "present":
      return "is-working";
    default:
      return "attendance-badge attendance-badge--working";
  }
};

export const getAttendanceTypeLabel = (attendanceType) => {
  switch (attendanceType) {
    case "EARLY_LEAVE":
      return "조퇴";
    case "VACATION":
      return "휴가";
    case "NORMAL":
    default:
      return "일반";
  }
};