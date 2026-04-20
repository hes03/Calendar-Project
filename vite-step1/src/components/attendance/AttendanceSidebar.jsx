import {
  formatTimeOnly,
  formatWorkMinutes,
  getAttendanceStatusLabel,
  getAttendanceTypeLabel,
} from "../../utils/attendanceUtils";

function AttendanceSidebar({
  todayAttendance,
  onCheckIn,
  onCheckOut,
  onEarlyLeave,
  actionLoading,
  canCheckIn,
  canCheckOut,
  canEarlyLeave,
}) {
  const record = todayAttendance?.record;
  const hasRecord = !!todayAttendance?.hasRecord;
  const hasCheckOut = !!record?.checkOutAt;

  const statusLabel = getAttendanceStatusLabel(
    record?.status,
    hasRecord,
    hasCheckOut,
  );

  return (
    <aside className="attendance-sidebar">
      <section className="attendance-panel-card">
        <div className="attendance-panel-card__header">
          <div>
            <h2>오늘 근무</h2>
            <p>출근, 퇴근, 조퇴를 처리할 수 있습니다.</p>
          </div>
        </div>

        <div className="attendance-sidebar-status">
          <span>현재 상태</span>
          <strong>{statusLabel}</strong>
        </div>

        <div className="attendance-sidebar-list">
          <div className="attendance-sidebar-list__item">
            <span>근태 유형</span>
            <strong>{getAttendanceTypeLabel(record?.attendanceType)}</strong>
          </div>
        </div>

        <div className="attendance-sidebar-actions">
          <button
            type="button"
            className="attendance-button attendance-button--primary"
            onClick={onCheckIn}
            disabled={actionLoading || !canCheckIn}
          >
            {canCheckIn ? "출근하기" : "출근 완료"}
          </button>

          <button
            type="button"
            className="attendance-button attendance-button--secondary"
            onClick={onCheckOut}
            disabled={actionLoading || !canCheckOut}
          >
            {canCheckOut ? "퇴근하기" : "퇴근 완료"}
          </button>

          <button
            type="button"
            className="attendance-button attendance-button--danger"
            onClick={onEarlyLeave}
            disabled={actionLoading || !canEarlyLeave}
          >
            {canEarlyLeave ? "조퇴 처리" : "조퇴 불가"}
          </button>
        </div>
      </section>

      <section className="attendance-panel-card">
        <div className="attendance-panel-card__header">
          <div>
            <h2>오늘 요약</h2>
            <p>오늘 기록 기준 핵심 정보입니다.</p>
          </div>
        </div>

        <div className="attendance-sidebar-list">
          <div className="attendance-sidebar-list__item">
            <span>출근 시간</span>
            <strong>{formatTimeOnly(record?.checkInAt)}</strong>
          </div>

          <div className="attendance-sidebar-list__item">
            <span>퇴근 시간</span>
            <strong>{formatTimeOnly(record?.checkOutAt)}</strong>
          </div>

          <div className="attendance-sidebar-list__item">
            <span>근무 시간</span>
            <strong>{formatWorkMinutes(record?.totalWorkMinutes ?? 0)}</strong>
          </div>
        </div>
      </section>
    </aside>
  );
}

export default AttendanceSidebar;
