import { useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSun,
} from "react-icons/fi";
import {
  formatKoreanFullDate,
  formatTimeRange,
  sortSchedulesByStart,
} from "../../utils/schedulePageUtils";

function ScheduleSidebar({
  schedules,
  todaySchedules,
  selectedDate,
  selectedDateSchedules,
  onScheduleClick,
  onQuickAdd,
}) {
  const [quickTitle, setQuickTitle] = useState("");
  const [quickTime, setQuickTime] = useState("09:00");

  const sortedTodaySchedules = sortSchedulesByStart(todaySchedules);
  const sortedSelectedDateSchedules = sortSchedulesByStart(
    selectedDateSchedules,
  );

  const handleQuickSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !quickTitle.trim()) return;

    const [hour, minute] = quickTime.split(":").map(Number);

    const start = new Date(selectedDate);
    start.setHours(hour, minute, 0, 0);

    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    await onQuickAdd({
      title: quickTitle.trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      memo: "",
      color: "#3b82f6",
    });

    setQuickTitle("");
    setQuickTime("09:00");
  };

  return (
    <aside className="schedule-sidebar">
      <div className="schedule-side-summary-grid">
        <div className="schedule-summary-card">
          <div className="schedule-summary-card__icon">
            <FiCalendar />
          </div>
          <div>
            <span>전체 일정</span>
            <strong>{schedules.length}</strong>
          </div>
        </div>

        <div className="schedule-summary-card">
          <div className="schedule-summary-card__icon">
            <FiSun />
          </div>
          <div>
            <span>오늘 일정</span>
            <strong>{todaySchedules.length}</strong>
          </div>
        </div>

        <div className="schedule-summary-card">
          <div className="schedule-summary-card__icon">
            <FiCheckCircle />
          </div>
          <div>
            <span>선택 날짜</span>
            <strong>{selectedDateSchedules.length}</strong>
          </div>
        </div>
      </div>

      <div className="schedule-side-section">
        <div className="schedule-side-section__header">
          <h3>오늘 일정</h3>
          <span>{todaySchedules.length}건</span>
        </div>

        {sortedTodaySchedules.length === 0 ? (
          <div className="schedule-side-empty">오늘 일정이 없습니다.</div>
        ) : (
          <ul className="schedule-side-list">
            {sortedTodaySchedules.map((schedule) => (
              <li
                key={schedule.id}
                className="schedule-side-item"
                onClick={() => onScheduleClick(schedule)}
              >
                <div
                  className="schedule-side-item__color"
                  style={{ backgroundColor: schedule.color || "#3b82f6" }}
                />
                <div className="schedule-side-item__content">
                  <strong>{schedule.title}</strong>
                  <span>
                    <FiClock />
                    {formatTimeRange(schedule.start, schedule.end)}
                  </span>
                  {schedule.memo && <p>{schedule.memo}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="schedule-side-section">
        <div className="schedule-side-section__header">
          <h3>선택 날짜 일정</h3>
          <span>
            {selectedDate ? formatKoreanFullDate(selectedDate) : "날짜 선택 전"}
          </span>
        </div>

        {!selectedDate ? (
          <div className="schedule-side-empty">
            캘린더에서 날짜를 클릭하면 해당 날짜 일정이 표시됩니다.
          </div>
        ) : sortedSelectedDateSchedules.length === 0 ? (
          <div className="schedule-side-empty">
            선택한 날짜에 일정이 없습니다.
          </div>
        ) : (
          <ul className="schedule-side-list">
            {sortedSelectedDateSchedules.map((schedule) => (
              <li
                key={schedule.id}
                className="schedule-side-item"
                onClick={() => onScheduleClick(schedule)}
              >
                <div
                  className="schedule-side-item__color"
                  style={{ backgroundColor: schedule.color || "#3b82f6" }}
                />
                <div className="schedule-side-item__content">
                  <strong>{schedule.title}</strong>
                  <span>
                    <FiClock />
                    {formatTimeRange(schedule.start, schedule.end)}
                  </span>
                  {schedule.memo && <p>{schedule.memo}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="schedule-side-section">
        <div className="schedule-side-section__header">
          <h3>빠른 일정 추가</h3>
          <span>
            {selectedDate ? "선택 날짜 기준" : "날짜를 먼저 선택하세요"}
          </span>
        </div>

        <form className="quick-add-form" onSubmit={handleQuickSubmit}>
          <input
            type="text"
            placeholder="예: 팀 미팅"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            disabled={!selectedDate}
          />
          <input
            type="time"
            value={quickTime}
            onChange={(e) => setQuickTime(e.target.value)}
            disabled={!selectedDate}
          />
          <button
            type="submit"
            className="schedule-primary-btn"
            disabled={!selectedDate}
          >
            <FiPlus />
            빠르게 추가
          </button>
        </form>
      </div>
    </aside>
  );
}

export default ScheduleSidebar;
