import {
  formatDateOnly,
  formatTimeOnly,
  formatWorkMinutes,
  getAttendanceStatusLabel,
  getAttendanceTypeLabel,
} from "../../utils/attendanceUtils";

function AttendanceMonthlyTable({ records = [], loading = false }) {
  if (loading) {
    return (
      <section className="attendance-panel-card">
        <div className="attendance-panel-card__header">
          <div>
            <h2>월별 근태 기록</h2>
            <p>선택한 월의 근태 내역을 불러오고 있습니다.</p>
          </div>
        </div>
        <div className="attendance-empty-card">불러오는 중...</div>
      </section>
    );
  }

  return (
    <section className="attendance-panel-card">
      <div className="attendance-panel-card__header">
        <div>
          <h2>월별 근태 기록</h2>
          <p>선택한 월의 날짜별 출퇴근 및 휴가 기록입니다.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="attendance-empty-card">
          선택한 월에 근태 기록이 없습니다.
        </div>
      ) : (
        <div className="attendance-table-wrap">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>출근 시간</th>
                <th>퇴근 시간</th>
                <th>상태</th>
                <th>근태 유형</th>
                <th>총 근무 시간</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDateOnly(record.workDate)}</td>
                  <td>{formatTimeOnly(record.checkInAt)}</td>
                  <td>{formatTimeOnly(record.checkOutAt)}</td>
                  <td>
                    {getAttendanceStatusLabel(
                      record.status,
                      true,
                      !!record.checkOutAt,
                    )}
                  </td>
                  <td>{getAttendanceTypeLabel(record.attendanceType)}</td>
                  <td>{formatWorkMinutes(record.totalWorkMinutes ?? 0)}</td>
                  <td>{record.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AttendanceMonthlyTable;
