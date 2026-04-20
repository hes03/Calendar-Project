import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
} from "../../service/attendanceApi/attendanceService";

import AttendancePageHeader from "../attendance/AttendancePageHeader";
import AttendanceSidebar from "../attendance/AttendanceSidebar";
import AttendanceTodayCard from "../attendance/AttendanceTodayCard";
import AttendanceSummaryCards from "../attendance/AttendanceSummaryCards";

import {
  formatKoreanDate,
  getAttendanceStatusClassName,
  getAttendanceStatusLabel,
} from "../../utils/attendanceUtils.js";

import "../styles/attendance.css";

function Attendance() {
  const { currentUser, authLoading } = useAuth();

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTodayAttendance = async () => {
    try {
      const data = await getTodayAttendance();
      setTodayAttendance(data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "근태 정보를 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !currentUser) return;
    fetchTodayAttendance();
  }, [authLoading, currentUser]);

  const handleCheckIn = async () => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      await checkIn();
      toast.success("출근 처리되었습니다.");
      await fetchTodayAttendance();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "출근 처리에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      await checkOut();
      toast.success("퇴근 처리되었습니다.");
      await fetchTodayAttendance();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "퇴근 처리에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const record = todayAttendance?.record;
  const hasRecord = todayAttendance?.hasRecord;
  const hasCheckOut = !!record?.checkOutAt;

  const statusLabel = useMemo(
    () => getAttendanceStatusLabel(record?.status, hasRecord, hasCheckOut),
    [record?.status, hasRecord, hasCheckOut],
  );

  const statusClassName = useMemo(
    () => getAttendanceStatusClassName(record?.status, hasRecord, hasCheckOut),
    [record?.status, hasRecord, hasCheckOut],
  );

  if (authLoading || loading) {
    return <main className="attendance-page">로딩 중...</main>;
  }

  return (
    <main className="attendance-page">
      <AttendancePageHeader
        workDate={formatKoreanDate(todayAttendance?.workDate || new Date())}
        statusLabel={statusLabel}
        statusClassName={statusClassName}
      />

      <div className="attendance-layout">
        <AttendanceSidebar
          todayAttendance={todayAttendance}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          actionLoading={actionLoading}
        />

        <section className="attendance-main">
          <AttendanceSummaryCards record={record} />
          <AttendanceTodayCard record={record} />

          <section className="attendance-panel-card">
            <div className="attendance-panel-card__header">
              <div>
                <h2>오늘 안내</h2>
                <p>현재 근태 데이터 기준으로 표시되는 상태입니다.</p>
              </div>
            </div>

            <div className="attendance-empty-card">
              {!hasRecord
                ? "아직 오늘 출근 기록이 없습니다. 출근하기 버튼을 눌러 근무를 시작하세요."
                : hasCheckOut
                  ? "오늘 근무가 종료되었습니다. 다음 단계로는 월별 근태 내역과 통계 기능을 추가하면 좋습니다."
                  : "현재 근무 진행 중입니다. 업무 종료 시 퇴근하기 버튼을 눌러 기록을 마무리하세요."}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default Attendance;
