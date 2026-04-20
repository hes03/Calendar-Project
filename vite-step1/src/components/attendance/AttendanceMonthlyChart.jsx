import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AttendanceMonthlyChart({ records = [] }) {
  const chartData = [...records]
    .sort((a, b) => a.workDate.localeCompare(b.workDate))
    .map((record) => ({
      date: record.workDate?.slice(5) || "-",
      workMinutes: record.totalWorkMinutes || 0,
    }));

  return (
    <section className="attendance-panel-card">
      <div className="attendance-panel-card__header">
        <div>
          <h2>일자별 근무시간</h2>
          <p>선택한 월의 날짜별 총 근무시간입니다.</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="attendance-empty-card">
          차트로 표시할 근태 기록이 없습니다.
        </div>
      ) : (
        <div className="attendance-chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value}분`, "근무시간"]}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Bar dataKey="workMinutes" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default AttendanceMonthlyChart;
