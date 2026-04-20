import { FiLogIn, FiLogOut } from "react-icons/fi";

function AttendanceActionCard({
  canCheckIn,
  canCheckOut,
  onCheckIn,
  onCheckOut,
  actionLoading,
}) {
  return (
    <div className="attendance-side-section">
      <div className="attendance-side-section__header">
        <h3>근무 액션</h3>
        <span>오늘 기준</span>
      </div>

      <div className="attendance-action-buttons">
        <button
          type="button"
          className="attendance-primary-btn"
          onClick={onCheckIn}
          disabled={!canCheckIn || actionLoading}
        >
          <FiLogIn />
          출근하기
        </button>

        <button
          type="button"
          className="attendance-outline-btn"
          onClick={onCheckOut}
          disabled={!canCheckOut || actionLoading}
        >
          <FiLogOut />
          퇴근하기
        </button>
      </div>

      <div className="attendance-side-note">
        출근은 하루 한 번만 기록할 수 있고, 퇴근은 출근 기록이 있을 때만
        가능합니다.
      </div>
    </div>
  );
}

export default AttendanceActionCard;
