import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useMemo } from "react";
import ScheduleModal from "../ScheduleModal";
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../../service/scheduleApi/scheduleService";
import "../styles/Schedule.css";
import { toast } from "react-toastify";

const Schedule = () => {
  const [scheduleState, setScheduleState] = useState({
    schedules: [],
    selectedSchedule: null,
    modal: { isOpen: false, mode: "create" },
    loading: true,
    isSaving: false,
    error: null,
  });

  // 일정 조회
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedulesFromDB = await getSchedules();
        setScheduleState((prev) => ({
          ...prev,
          schedules: Array.isArray(schedulesFromDB)
            ? schedulesFromDB
            : [],
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
  }, []);

  // 날짜 클릭 → 생성
  const handleDateClick = (info) => {
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

  // 일정 클릭 → 수정
  const handleEventClick = (info) => {
    const clickedSchedule = scheduleState.schedules.find(
      (s) => s.id === info.event.id
    );
    if (!clickedSchedule) return;

    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: clickedSchedule,
      modal: { isOpen: true, mode: "edit" },
    }));
  };

  // 저장
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

        toast.success("일정이 등록되었습니다.");
      } else {
        const updatedSchedule = await updateSchedule(data.id, data);

        setScheduleState((prev) => ({
          ...prev,
          schedules: prev.schedules.map((s) =>
            s.id === updatedSchedule.id ? updatedSchedule : s
          ),
          modal: { isOpen: false, mode: "create" },
          selectedSchedule: null,
          isSaving: false,
        }));

        toast.success("일정이 수정되었습니다.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "저장 중 오류가 발생했습니다.");
      setScheduleState((prev) => ({ ...prev, isSaving: false }));
    }
  };

  // 삭제
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

  // 모달 닫기
  const handleClose = () => {
    setScheduleState((prev) => ({
      ...prev,
      modal: { isOpen: false, mode: "create" },
      selectedSchedule: null,
    }));
  };

  // 캘린더 이벤트 변환
  const calendarEvents = useMemo(
    () =>
      scheduleState.schedules.map((s) => ({
        id: s.id,
        title: s.title,
        start: s.start,
        end: s.end,
        backgroundColor: s.color,
      })),
    [scheduleState.schedules]
  );

  if (scheduleState.loading) {
    return <div className="calendar-box">로딩 중...</div>;
  }

  return (
    <>
      <div className="calendar-box">
        <FullCalendar
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
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>

      <ScheduleModal
        show={scheduleState.modal.isOpen}
        mode={scheduleState.modal.mode}
        schedule={scheduleState.selectedSchedule}
        onSave={handleSave}
        onClose={handleClose}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Schedule;
