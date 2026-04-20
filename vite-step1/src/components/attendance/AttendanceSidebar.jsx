import { FiActivity, FiCheckCircle, FiInfo } from "react-icons/fi";
import {
  getAttendanceStatusClassName,
  getAttendanceStatusLabel,
} from "../../utils/attendanceUtils";
import AttendanceActionCard from "./AttendanceActionCard";

function AttendanceSidebar({
  todayAttendance,
  onCheckIn,
  onCheckOut,
  actionLoading,
}) {
  const record = todayAttendance?.record;
  const hasRecord = todayAttendance?.hasRecord;
  const hasCheckOut = !!record?.checkOutAt;

  const statusLabel = getAttendanceStatusLabel(
    record?.status,
    hasRecord,
    hasCheckOut,
  );

  const statusClassName = getAttendanceStatusClassName(
    record?.status,
    hasRecord,
    hasCheckOut,
  );

  const canCheckIn = !hasRecord;
  const canCheckOut = hasRecord && !hasCheckOut;

  return (
    <aside className="attendance-sidebar">
      <div className="attendance-side-section">
        <div className="attendance-side-section__header">
          <h3>오늘 상태</h3>
          <span>실시간</span>
        </div>

        <div className={`attendance-state-card ${statusClassName}`}>
          <div className="attendance-state-card__icon">
            <FiActivity />
          </div>
          <div className="attendance-state-card__content">
            <strong>{statusLabel}</strong>
            <p>
              {!hasRecord
                ? "아직 오늘 출근 기록이 없습니다."
                : hasCheckOut
                  ? "오늘 근무가 정상적으로 종료되었습니다."
                  : "현재 근무가 진행 중입니다."}
            </p>
          </div>
        </div>
      </div>

      <AttendanceActionCard
        canCheckIn={canCheckIn}
        canCheckOut={canCheckOut}
        onCheckIn={onCheckIn}
        onCheckOut={onCheckOut}
        actionLoading={actionLoading}
      />

      <div className="attendance-side-section">
        <div className="attendance-side-section__header">
          <h3>안내</h3>
          <span>근태 정책</span>
        </div>

        <ul className="attendance-policy-list">
          <li>
            <FiCheckCircle />
            <span>출근 시 오늘 날짜 기준 근태 기록이 생성됩니다.</span>
          </li>
          <li>
            <FiCheckCircle />
            <span>퇴근 시 총 근무 시간이 자동 계산됩니다.</span>
          </li>
          <li>
            <FiInfo />
            <span>09:00 이후 출근 시 지각 상태로 표시됩니다.</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default AttendanceSidebar;
