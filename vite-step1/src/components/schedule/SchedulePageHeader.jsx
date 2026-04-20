import { FiCalendar, FiPlus, FiTarget } from "react-icons/fi";

function SchedulePageHeader({
  totalCount,
  todayCount,
  selectedDateText,
  onAddClick,
  onTodayClick,
}) {
  return (
    <section className="schedule-page-header">
      <div className="schedule-page-header__left">
        <div className="schedule-page-header__badge">
          <FiCalendar />
          <span>Schedule</span>
        </div>

        <h1 className="schedule-page-header__title">일정 관리</h1>
        <p className="schedule-page-header__desc">
          월간, 주간, 목록 보기로 일정을 관리하고 오늘 일정과 선택 날짜 일정을
          한눈에 확인해보세요.
        </p>
      </div>

      <div className="schedule-page-header__stats">
        <div className="schedule-header-stat">
          <span className="schedule-header-stat__label">전체 일정</span>
          <strong>{totalCount}</strong>
        </div>

        <div className="schedule-header-stat">
          <span className="schedule-header-stat__label">오늘 일정</span>
          <strong>{todayCount}</strong>
        </div>

        <div className="schedule-header-stat">
          <span className="schedule-header-stat__label">선택 날짜</span>
          <strong>{selectedDateText}</strong>
        </div>
      </div>

      <div className="schedule-page-header__actions">
        <button
          type="button"
          className="schedule-outline-btn"
          onClick={onTodayClick}
        >
          <FiTarget />
          오늘로 이동
        </button>

        <button
          type="button"
          className="schedule-primary-btn"
          onClick={onAddClick}
        >
          <FiPlus />
          일정 추가
        </button>
      </div>
    </section>
  );
}

export default SchedulePageHeader;
