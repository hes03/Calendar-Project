import { FiClock, FiCalendar, FiActivity } from "react-icons/fi";

function AttendancePageHeader({ workDate, statusLabel, statusClassName }) {
  return (
    <section className="attendance-page-header">
      <div className="attendance-page-header__left">
        <div className="attendance-page-header__badge">
          <FiClock />
          <span>Attendance</span>
        </div>

        <h1 className="attendance-page-header__title">근태 관리</h1>
        <p className="attendance-page-header__desc">
          오늘의 출근 상태와 근무 시간을 확인하고, 출근/퇴근을 간편하게
          기록하세요.
        </p>
      </div>

      <div className="attendance-page-header__meta">
        <div className="attendance-meta-card">
          <span className="attendance-meta-card__label">
            <FiCalendar />
            오늘 날짜
          </span>
          <strong>{workDate || "-"}</strong>
        </div>

        <div className="attendance-meta-card">
          <span className="attendance-meta-card__label">
            <FiActivity />
            현재 상태
          </span>
          <strong className={`attendance-status-badge ${statusClassName}`}>
            {statusLabel}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default AttendancePageHeader;
