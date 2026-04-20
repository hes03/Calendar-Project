import { formatWorkMinutes } from "../../utils/attendanceUtils";

function AttendanceMonthlyStats({ summary }) {
  const stats = [
    { label: "근무일수", value: `${summary?.totalDays ?? 0}일` },
    {
      label: "총 근무시간",
      value: formatWorkMinutes(summary?.totalWorkMinutes ?? 0),
    },
    {
      label: "평균 근무시간",
      value: formatWorkMinutes(summary?.averageWorkMinutes ?? 0),
    },
    { label: "정상 출근", value: `${summary?.onTimeCount ?? 0}회` },
    { label: "지각", value: `${summary?.lateCount ?? 0}회` },
    { label: "퇴근 완료", value: `${summary?.checkedOutCount ?? 0}회` },
    { label: "조퇴", value: `${summary?.earlyLeaveCount ?? 0}회` },
    { label: "휴가", value: `${summary?.vacationCount ?? 0}회` },
  ];

  return (
    <section className="attendance-panel-card">
      <div className="attendance-panel-card__header">
        <div>
          <h2>월간 통계</h2>
          <p>선택한 월 기준 근태 통계를 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="attendance-stats-grid">
        {stats.map((item) => (
          <article className="attendance-stats-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AttendanceMonthlyStats;
