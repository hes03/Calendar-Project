function AttendancePageHeader({ workDate, statusLabel, statusClassName }) {
  return (
    <section className="attendance-page-header">
      <div>
        <p className="attendance-page-header__eyebrow">Attendance Dashboard</p>
        <h1 className="attendance-page-header__title">근태 관리</h1>
        <p className="attendance-page-header__date">{workDate}</p>
      </div>

      <div className={statusClassName}>{statusLabel}</div>
    </section>
  );
}

export default AttendancePageHeader;
