import { FaCalendarDay, FaCalendarWeek, FaClock } from "react-icons/fa";

const DashboardSummaryCards = ({ todayCount, weekCount, upcomingCount }) => {
  const cards = [
    {
      title: "오늘 일정",
      value: todayCount,
      icon: <FaCalendarDay />,
      className: "dashboard-card-blue",
    },
    {
      title: "이번 주 일정",
      value: weekCount,
      icon: <FaCalendarWeek />,
      className: "dashboard-card-indigo",
    },
    {
      title: "다가오는 일정",
      value: upcomingCount,
      icon: <FaClock />,
      className: "dashboard-card-cyan",
    },
  ];

  return (
    <div className="dashboard-summary-grid">
      {cards.map((card) => (
        <div
          className={`dashboard-card dashboard-summary-card ${card.className}`}
          key={card.title}
        >
          <div className="dashboard-summary-top">
            <div className="dashboard-summary-icon">{card.icon}</div>
            <span className="dashboard-card-label">{card.title}</span>
          </div>
          <h2 className="dashboard-card-value">{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummaryCards;
