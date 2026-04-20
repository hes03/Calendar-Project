import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import {
  checkIn,
  checkOut,
  getMonthlyAttendance,
  getTodayAttendance,
  markEarlyLeave,
  registerVacation,
} from "../../service/attendanceApi/attendanceService";

import AttendancePageHeader from "../attendance/AttendancePageHeader";
import AttendanceSidebar from "../attendance/AttendanceSidebar";
import AttendanceTodayCard from "../attendance/AttendanceTodayCard";
import AttendanceSummaryCards from "../attendance/AttendanceSummaryCards";
import AttendanceMonthlyTable from "../attendance/AttendanceMonthlyTable";
import AttendanceMonthlyStats from "../attendance/AttendanceMonthlyStats";
import VacationRegisterCard from "../attendance/VacationRegisterCard";
import AttendanceMonthlyChart from "../attendance/AttendanceMonthlyChart";
import AttendanceStatusChart from "../attendance/AttendanceStatusChart";

import {
  formatKoreanDate,
  getAttendanceStatusClassName,
  getAttendanceStatusLabel,
} from "../../utils/attendanceUtils";

import "../styles/attendance.css";

function Attendance() {
  const { currentUser, authLoading } = useAuth();

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);

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

  const fetchMonthlyAttendance = async (year, month) => {
    try {
      setMonthlyLoading(true);
      const data = await getMonthlyAttendance(year, month);
      setMonthlyAttendance(data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "월별 근태 기록을 불러오지 못했습니다.",
      );
    } finally {
      setMonthlyLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !currentUser) return;
    fetchTodayAttendance();
  }, [authLoading, currentUser]);

  useEffect(() => {
    if (authLoading || !currentUser) return;
    fetchMonthlyAttendance(selectedYear, selectedMonth);
  }, [authLoading, currentUser, selectedYear, selectedMonth]);

  const record = todayAttendance?.record;
  const hasRecord = !!todayAttendance?.hasRecord;
  const hasCheckedIn = !!record?.checkInAt;
  const hasCheckedOut = !!record?.checkOutAt;
  const isVacation = record?.attendanceType === "VACATION";
  const isEarlyLeave = record?.attendanceType === "EARLY_LEAVE";

  const handleCheckIn = async () => {
    if (actionLoading) return;
    if (hasCheckedIn || isVacation) {
      toast.info("출근 처리할 수 없는 상태입니다.");
      return;
    }

    try {
      setActionLoading(true);
      await checkIn();
      toast.success("출근 처리되었습니다.");
      await fetchTodayAttendance();
      await fetchMonthlyAttendance(selectedYear, selectedMonth);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "출근 처리 실패");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (actionLoading) return;
    if (!hasCheckedIn || hasCheckedOut || isVacation) {
      toast.info("퇴근 처리할 수 없는 상태입니다.");
      return;
    }

    try {
      setActionLoading(true);
      await checkOut();
      toast.success("퇴근 처리되었습니다.");
      await fetchTodayAttendance();
      await fetchMonthlyAttendance(selectedYear, selectedMonth);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "퇴근 처리 실패");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEarlyLeave = async () => {
    if (actionLoading) return;
    if (!hasCheckedIn || hasCheckedOut || isVacation || isEarlyLeave) {
      toast.info("조퇴 처리할 수 없는 상태입니다.");
      return;
    }

    const note = window.prompt("조퇴 사유를 입력하세요.", "") || "";

    try {
      setActionLoading(true);
      await markEarlyLeave(note);
      toast.success("조퇴 처리되었습니다.");
      await fetchTodayAttendance();
      await fetchMonthlyAttendance(selectedYear, selectedMonth);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "조퇴 처리 실패");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegisterVacation = async ({ workDate, note }) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      await registerVacation({ workDate, note });
      toast.success("휴가가 등록되었습니다.");
      await fetchTodayAttendance();
      await fetchMonthlyAttendance(selectedYear, selectedMonth);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "휴가 등록 실패");
    } finally {
      setActionLoading(false);
    }
  };

  const statusLabel = useMemo(() => {
    return getAttendanceStatusLabel(record?.status, hasRecord, hasCheckedOut);
  }, [record?.status, hasRecord, hasCheckedOut]);

  const statusClassName = useMemo(() => {
    return getAttendanceStatusClassName(
      record?.status,
      hasRecord,
      hasCheckedOut,
    );
  }, [record?.status, hasRecord, hasCheckedOut]);

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
          onEarlyLeave={handleEarlyLeave}
          actionLoading={actionLoading}
          canCheckIn={!hasCheckedIn && !isVacation}
          canCheckOut={hasCheckedIn && !hasCheckedOut && !isVacation}
          canEarlyLeave={
            hasCheckedIn && !hasCheckedOut && !isVacation && !isEarlyLeave
          }
        />

        <section className="attendance-main">
          <AttendanceSummaryCards record={record} />
          <AttendanceTodayCard record={record} />

          <VacationRegisterCard
            onRegisterVacation={handleRegisterVacation}
            actionLoading={actionLoading}
          />

          <section className="attendance-panel-card">
            <div className="attendance-panel-card__header">
              <div>
                <h2>월별 조회</h2>
                <p>연도와 월을 선택해 근태 기록과 통계를 확인할 수 있습니다.</p>
              </div>
            </div>

            <div className="attendance-filter-row">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (month) => (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  ),
                )}
              </select>
            </div>
          </section>

          <AttendanceMonthlyStats summary={monthlyAttendance?.summary} />

          <div className="attendance-chart-grid">
            <AttendanceMonthlyChart
              records={monthlyAttendance?.records || []}
            />
            <AttendanceStatusChart summary={monthlyAttendance?.summary} />
          </div>

          <AttendanceMonthlyTable
            records={monthlyAttendance?.records || []}
            loading={monthlyLoading}
          />
        </section>
      </div>
    </main>
  );
}

export default Attendance;
