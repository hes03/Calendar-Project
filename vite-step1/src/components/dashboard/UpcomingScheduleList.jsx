import { formatDateTime } from "../../utils/dashboardUtils";

const UpcomingScheduleList = ({ schedules }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-section-head">
        <h3 className="dashboard-section-title">다가오는 일정</h3>
        <span className="dashboard-count-badge">{schedules.length}개</span>
      </div>

      {schedules.length === 0 ? (
        <p className="section-desc">예정된 일정이 없습니다.</p>
      ) : (
        <ul className="dashboard-list">
          {schedules.map((schedule) => (
            <li className="dashboard-list-item" key={schedule.id}>
              <div className="dashboard-list-color">
                <span
                  className="dashboard-color-dot"
                  style={{ backgroundColor: schedule.color || "#2563eb" }}
                />
              </div>

              <div className="dashboard-list-content">
                <div className="dashboard-list-title-row">
                  <strong>{schedule.title}</strong>
                  <span className="dashboard-upcoming-badge">예정</span>
                </div>

                <p>{formatDateTime(schedule.start)}</p>
                {schedule.memo && <small>{schedule.memo}</small>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingScheduleList;
