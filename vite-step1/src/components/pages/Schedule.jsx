import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import ScheduleModal from "../ScheduleModal";
import SchedulePageHeader from "../schedule/SchedulePageHeader";
import ScheduleSidebar from "../schedule/ScheduleSidebar";

import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../../service/scheduleApi/scheduleService";
import { useAuth } from "../../hooks/useAuth";
import {
  formatKoreanFullDate,
  getSchedulesByDate,
  getTodaySchedules,
} from "../../utils/schedulePageUtils";

import "../styles/schedule-layout.css";
import "../styles/calendar.css";

const Schedule = () => {
  const calendarRef = useRef(null);
  const { currentUser, authLoading } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [scheduleState, setScheduleState] = useState({
    schedules: [],
    selectedSchedule: null,
    modal: { isOpen: false, mode: "create" },
    loading: true,
    isSaving: false,
    error: null,
  });

  useEffect(() => {
    if (authLoading || !currentUser) return;

    const fetchSchedules = async () => {
      try {
        const schedulesFromDB = await getSchedules();

        setScheduleState((prev) => ({
          ...prev,
          schedules: Array.isArray(schedulesFromDB) ? schedulesFromDB : [],
          loading: false,
        }));
      } catch (err) {
        console.error(err);
        toast.error(err.message || "일정을 불러오지 못했습니다.");

        setScheduleState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      }
    };

    fetchSchedules();
  }, [authLoading, currentUser]);

  const handleDateClick = (info) => {
    setSelectedDate(new Date(info.dateStr));

    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: {
        title: "",
        start: info.dateStr + "T09:00",
        end: info.dateStr + "T10:00",
        memo: "",
        color: "#3b82f6",
      },
      modal: { isOpen: true, mode: "create" },
    }));
  };

  const handleEventClick = (info) => {
    const clickedSchedule = scheduleState.schedules.find(
      (s) => s.id === info.event.id,
    );
    if (!clickedSchedule) return;

    setSelectedDate(new Date(clickedSchedule.start));

    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: clickedSchedule,
      modal: { isOpen: true, mode: "edit" },
    }));
  };

  const handleSidebarScheduleClick = (schedule) => {
    setSelectedDate(new Date(schedule.start));

    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: schedule,
      modal: { isOpen: true, mode: "edit" },
    }));
  };

  const handleOpenCreateModal = () => {
    const baseDate = selectedDate || new Date();
    const dateStr = new Date(baseDate).toISOString().split("T")[0];

    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: {
        title: "",
        start: `${dateStr}T09:00`,
        end: `${dateStr}T10:00`,
        memo: "",
        color: "#3b82f6",
      },
      modal: { isOpen: true, mode: "create" },
    }));
  };

  const handleTodayMove = () => {
    const api = calendarRef.current?.getApi();
    api?.today();
    setSelectedDate(new Date());
  };

  const handleSave = async (data) => {
    if (scheduleState.isSaving) return;

    setScheduleState((prev) => ({ ...prev, isSaving: true }));

    try {
      if (scheduleState.modal.mode === "create") {
        const newSchedule = await createSchedule(data);

        setScheduleState((prev) => ({
          ...prev,
          schedules: [...prev.schedules, newSchedule],
          modal: { isOpen: false, mode: "create" },
          selectedSchedule: null,
          isSaving: false,
        }));

        setSelectedDate(new Date(newSchedule.start));
        toast.success("일정이 등록되었습니다.");
      } else {
        const updatedSchedule = await updateSchedule(data.id, data);

        setScheduleState((prev) => ({
          ...prev,
          schedules: prev.schedules.map((s) =>
            s.id === updatedSchedule.id ? updatedSchedule : s,
          ),
          modal: { isOpen: false, mode: "create" },
          selectedSchedule: null,
          isSaving: false,
        }));

        setSelectedDate(new Date(updatedSchedule.start));
        toast.success("일정이 수정되었습니다.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "저장 중 오류가 발생했습니다.");
      setScheduleState((prev) => ({ ...prev, isSaving: false }));
    }
  };

  const handleQuickAdd = async (data) => {
    try {
      const newSchedule = await createSchedule(data);

      setScheduleState((prev) => ({
        ...prev,
        schedules: [...prev.schedules, newSchedule],
      }));

      setSelectedDate(new Date(newSchedule.start));
      toast.success("일정이 등록되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "빠른 일정 추가에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      await deleteSchedule(id);

      setScheduleState((prev) => ({
        ...prev,
        schedules: prev.schedules.filter((s) => s.id !== id),
        modal: { isOpen: false, mode: "create" },
        selectedSchedule: null,
      }));

      toast.success("일정이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "삭제에 실패했습니다.");
    }
  };

  const handleClose = () => {
    setScheduleState((prev) => ({
      ...prev,
      modal: { isOpen: false, mode: "create" },
      selectedSchedule: null,
    }));
  };

  const calendarEvents = useMemo(
    () =>
      scheduleState.schedules.map((s) => ({
        id: s.id,
        title: s.title,
        start: s.start,
        end: s.end,
        backgroundColor: s.color,
        borderColor: s.color,
      })),
    [scheduleState.schedules],
  );

  const todaySchedules = useMemo(
    () => getTodaySchedules(scheduleState.schedules),
    [scheduleState.schedules],
  );

  const selectedDateSchedules = useMemo(
    () => getSchedulesByDate(scheduleState.schedules, selectedDate),
    [scheduleState.schedules, selectedDate],
  );

  if (authLoading) {
    return <div className="calendar-page">인증 확인 중...</div>;
  }

  if (scheduleState.loading) {
    return <div className="calendar-page">로딩 중...</div>;
  }

  return (
    <main className="calendar-page schedule-page">
      <SchedulePageHeader
        totalCount={scheduleState.schedules.length}
        todayCount={todaySchedules.length}
        selectedDateText={formatKoreanFullDate(selectedDate)}
        onAddClick={handleOpenCreateModal}
        onTodayClick={handleTodayMove}
      />

      <div className="schedule-layout">
        <ScheduleSidebar
          schedules={scheduleState.schedules}
          todaySchedules={todaySchedules}
          selectedDate={selectedDate}
          selectedDateSchedules={selectedDateSchedules}
          onScheduleClick={handleSidebarScheduleClick}
          onQuickAdd={handleQuickAdd}
        />

        <section className="schedule-calendar-panel">
          <div className="schedule-calendar-panel__header">
            <div>
              <h2>캘린더</h2>
              <p>
                날짜를 클릭해 일정을 만들고, 등록된 일정을 클릭해 수정하세요.
              </p>
            </div>
          </div>

          <div className="calendar-box schedule-calendar-card">
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,listWeek",
              }}
              dateClick={handleDateClick}
              events={calendarEvents}
              eventClick={handleEventClick}
              selectable
              height="auto"
              dayMaxEvents={3}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
            />
          </div>
        </section>
      </div>

      <ScheduleModal
        show={scheduleState.modal.isOpen}
        mode={scheduleState.modal.mode}
        schedule={scheduleState.selectedSchedule}
        onSave={handleSave}
        onClose={handleClose}
        onDelete={handleDelete}
      />
    </main>
  );
};

export default Schedule;
