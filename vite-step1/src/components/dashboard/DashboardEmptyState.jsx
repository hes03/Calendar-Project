import { Link } from "react-router-dom";

const DashboardEmptyState = () => {
  return (
    <div className="dashboard-card dashboard-empty-state">
      <h3>아직 등록된 일정이 없습니다.</h3>
      <p>첫 일정을 추가해서 나만의 대시보드를 채워보세요.</p>
      <Link to="/schedule" className="btn custom-btn-primary px-4">
        일정 등록하러 가기
      </Link>
    </div>
  );
};

export default DashboardEmptyState;
