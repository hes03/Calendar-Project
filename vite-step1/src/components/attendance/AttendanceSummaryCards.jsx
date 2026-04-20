import { formatTimeOnly, formatWorkMinutes } from "../../utils/attendanceUtils";

function AttendanceSummaryCards({ record }) {
  const items = [
    {
      label: "출근 시간",
      value: formatTimeOnly(record?.checkInAt),
    },
    {
      label: "퇴근 시간",
      value: formatTimeOnly(record?.checkOutAt),
    },
    {
      label: "총 근무 시간",
      value: formatWorkMinutes(record?.totalWorkMinutes ?? 0),
    },
  ];

  return (
    <section className="attendance-summary-grid">
      {items.map((item) => (
        <article className="attendance-summary-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}

export default AttendanceSummaryCards;
