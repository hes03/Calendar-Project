import { Link } from "react-router-dom";
import { useEffect } from "react";
import DashboardSummaryCards from "../dashboard/DashboardSummaryCards";
import TodayScheduleList from "../dashboard/TodayScheduleList";
import UpcomingScheduleList from "../dashboard/UpcomingScheduleList";
import DashboardEmptyState from "../dashboard/DashboardEmptyState";
import { useDashboardSchedules } from "../../hooks/useDashboardSchedules";
import { useAuth } from "../../hooks/useAuth";
import {
  getTodaySchedules,
  getWeekSchedules,
  getUpcomingSchedules,
  sortSchedulesByStart,
} from "../../utils/dashboardUtils";

const HomePage = () => {
  const { currentUser, authLoading } = useAuth();

  const { schedules, loading, error } = useDashboardSchedules({
    enabled: !authLoading && !!currentUser,
  });

  useEffect(() => {
    const printToken = async () => {
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      console.log("Swagger용 토큰:");
      console.log(`${token}`);
    };

    printToken();
  }, [currentUser]);

  if (authLoading) {
    return <main className="dashboard-container">인증 확인 중...</main>;
  }

  const todaySchedules = sortSchedulesByStart(getTodaySchedules(schedules));
  const weekSchedules = getWeekSchedules(schedules);
  const upcomingSchedules = getUpcomingSchedules(schedules, 5);

  if (loading) {
    return <main className="dashboard-container">대시보드 로딩 중...</main>;
  }

  if (error) {
    return <main className="dashboard-container">오류: {error}</main>;
  }

  return (
    <main className="dashboard-container">
      <section className="dashboard-hero">
        <div>
          <h1>
            안녕하세요
            {currentUser?.displayName ? `, ${currentUser.displayName}` : ""}님
          </h1>
          <p>
            오늘과 이번 주 일정을 한눈에 확인하고, 중요한 일정부터 관리해보세요.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div className="dashboard-hero-badge">
            {currentUser?.email || "Planit Dashboard"}
          </div>
          <Link to="/schedule" className="btn btn-primary-soft">
            일정 관리로 이동
          </Link>
        </div>
      </section>

      <DashboardSummaryCards
        todayCount={todaySchedules.length}
        weekCount={weekSchedules.length}
        upcomingCount={upcomingSchedules.length}
      />

      {schedules.length === 0 ? (
        <DashboardEmptyState />
      ) : (
        <section className="dashboard-content-grid">
          <TodayScheduleList schedules={todaySchedules} />
          <UpcomingScheduleList schedules={upcomingSchedules} />
        </section>
      )}
    </main>
  );
};

export default HomePage;
