import { FiClock, FiLogIn, FiLogOut } from "react-icons/fi";
import { formatMinutesToHours, formatTime } from "../../utils/attendanceUtils";

function AttendanceSummaryCards({ record }) {
  return (
    <section className="attendance-summary-grid">
      <div className="attendance-summary-card">
        <div className="attendance-summary-card__icon">
          <FiLogIn />
        </div>
        <div>
          <span>출근 시각</span>
          <strong>{formatTime(record?.checkInAt)}</strong>
        </div>
      </div>

      <div className="attendance-summary-card">
        <div className="attendance-summary-card__icon">
          <FiLogOut />
        </div>
        <div>
          <span>퇴근 시각</span>
          <strong>{formatTime(record?.checkOutAt)}</strong>
        </div>
      </div>

      <div className="attendance-summary-card">
        <div className="attendance-summary-card__icon">
          <FiClock />
        </div>
        <div>
          <span>누적 근무 시간</span>
          <strong>{formatMinutesToHours(record?.totalWorkMinutes)}</strong>
        </div>
      </div>
    </section>
  );
}

export default AttendanceSummaryCards;
