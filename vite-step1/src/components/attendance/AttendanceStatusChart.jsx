import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function AttendanceStatusChart({ summary }) {
  const chartData = [
    { name: "정상 출근", value: summary?.onTimeCount ?? 0 },
    { name: "지각", value: summary?.lateCount ?? 0 },
    { name: "조퇴", value: summary?.earlyLeaveCount ?? 0 },
    { name: "휴가", value: summary?.vacationCount ?? 0 },
  ];

  const colors = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];
  const hasData = chartData.some((item) => item.value > 0);

  return (
    <section className="attendance-panel-card">
      <div className="attendance-panel-card__header">
        <div>
          <h2>상태별 통계</h2>
          <p>정상 출근, 지각, 조퇴, 휴가 현황입니다.</p>
        </div>
      </div>

      {!hasData ? (
        <div className="attendance-empty-card">
          통계로 표시할 데이터가 없습니다.
        </div>
      ) : (
        <div className="attendance-chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}회`, "횟수"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default AttendanceStatusChart;
