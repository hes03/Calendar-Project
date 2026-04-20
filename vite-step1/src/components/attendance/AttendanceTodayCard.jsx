import { FiClock, FiLogIn, FiLogOut, FiFileText } from "react-icons/fi";
import {
  formatDateTime,
  formatMinutesToHours,
  formatTime,
} from "../../utils/attendanceUtils";

function AttendanceTodayCard({ record }) {
  return (
    <section className="attendance-panel-card">
      <div className="attendance-panel-card__header">
        <div>
          <h2>오늘 근무 상세</h2>
          <p>출근, 퇴근, 누적 근무 시간을 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="attendance-today-grid">
        <div className="attendance-info-card">
          <span className="attendance-info-card__label">
            <FiLogIn />
            출근 시간
          </span>
          <strong>{formatTime(record?.checkInAt)}</strong>
          <p>
            {record?.checkInAt
              ? formatDateTime(record.checkInAt)
              : "아직 출근 전입니다."}
          </p>
        </div>

        <div className="attendance-info-card">
          <span className="attendance-info-card__label">
            <FiLogOut />
            퇴근 시간
          </span>
          <strong>{formatTime(record?.checkOutAt)}</strong>
          <p>
            {record?.checkOutAt
              ? formatDateTime(record.checkOutAt)
              : "퇴근 기록이 없습니다."}
          </p>
        </div>

        <div className="attendance-info-card">
          <span className="attendance-info-card__label">
            <FiClock />총 근무 시간
          </span>
          <strong>{formatMinutesToHours(record?.totalWorkMinutes)}</strong>
          <p>퇴근 시 자동 계산됩니다.</p>
        </div>

        <div className="attendance-info-card">
          <span className="attendance-info-card__label">
            <FiFileText />
            비고
          </span>
          <strong>{record?.status || "-"}</strong>
          <p>{record?.note || "등록된 비고가 없습니다."}</p>
        </div>
      </div>
    </section>
  );
}

export default AttendanceTodayCard;
