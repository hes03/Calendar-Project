import { formatTime } from "../../utils/dashboardUtils";

const TodayScheduleList = ({ schedules }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-section-head">
        <h3 className="dashboard-section-title">오늘 일정</h3>
        <span className="dashboard-count-badge">{schedules.length}개</span>
      </div>

      {schedules.length === 0 ? (
        <p className="section-desc">오늘 등록된 일정이 없습니다.</p>
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
                  <span className="dashboard-time-badge">
                    {formatTime(schedule.start)} ~ {formatTime(schedule.end)}
                  </span>
                </div>

                {schedule.memo && <small>{schedule.memo}</small>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodayScheduleList;
