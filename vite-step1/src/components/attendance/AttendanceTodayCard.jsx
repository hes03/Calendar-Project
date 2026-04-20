import {
  formatTimeOnly,
  formatWorkMinutes,
  getAttendanceStatusLabel,
  getAttendanceTypeLabel,
} from "../../utils/attendanceUtils";

function AttendanceTodayCard({ record }) {
  const hasRecord = !!record;
  const hasCheckOut = !!record?.checkOutAt;

  const statusLabel = getAttendanceStatusLabel(
    record?.status,
    hasRecord,
    hasCheckOut,
  );

  return (
    <section className="attendance-panel-card">
      <div className="attendance-panel-card__header">
        <div>
          <h2>오늘 상세 기록</h2>
          <p>오늘의 출퇴근 기록과 상태를 확인할 수 있습니다.</p>
        </div>
      </div>

      {!hasRecord ? (
        <div className="attendance-empty-card">
          오늘 등록된 근태 기록이 없습니다.
        </div>
      ) : (
        <div className="attendance-detail-grid">
          <div className="attendance-detail-item">
            <span>출근 시간</span>
            <strong>{formatTimeOnly(record?.checkInAt)}</strong>
          </div>

          <div className="attendance-detail-item">
            <span>퇴근 시간</span>
            <strong>{formatTimeOnly(record?.checkOutAt)}</strong>
          </div>

          <div className="attendance-detail-item">
            <span>상태</span>
            <strong>{statusLabel}</strong>
          </div>

          <div className="attendance-detail-item">
            <span>근태 유형</span>
            <strong>{getAttendanceTypeLabel(record?.attendanceType)}</strong>
          </div>

          <div className="attendance-detail-item">
            <span>총 근무 시간</span>
            <strong>{formatWorkMinutes(record?.totalWorkMinutes ?? 0)}</strong>
          </div>

          <div className="attendance-detail-item attendance-detail-item--full">
            <span>메모</span>
            <strong>{record?.note?.trim() ? record.note : "-"}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default AttendanceTodayCard;
