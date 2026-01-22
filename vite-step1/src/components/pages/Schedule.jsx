import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction"
import { useEffect, useState } from "react";
import ScheduleModal from "../ScheduleModal";
import { createSchedule, getSchedules, updateSchedule, deleteSchedule } from "../../service/scheduleApi/scheduleService";

const Schedule = () => {
  const [scheduleState, setScheduleState] = useState({
    schedules: [],
    selectedSchedule: null,
    modal: { isOpen: false, mode: "create" },
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedulesFromDB = await getSchedules();

      setScheduleState((prev) => ({
        ...prev,
        schedules: schedulesFromDB,
      }));
    };

    fetchSchedules();
  }, []);

  const handleDateClick = (info) => {
    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: {
        title: "",
        start: info.dateStr + "T09:00", //ISO 8601 형식의 날짜 + 시간 문자열
        end: info.dateStr + "T10:00",
        memo: "",
        color: "#3b82f6",
      },
      modal: { isOpen: true, mode: "create" },
    }));
  };

  const handleEventClick = (info) => {
  const clickedSchedule = scheduleState.schedules.find(
    (s) => s.id === info.event.id
  );

    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: clickedSchedule,
      modal: {
        isOpen: true,
        mode: "edit",
      },
    }));
  };

  const handleSave = async (data) => {
    if (scheduleState.modal.mode === "create") {
      const newSchedule = await createSchedule(data);

      setScheduleState((prev) => ({
        ...prev,
        schedules: [...prev.schedules, newSchedule],
        modal: { isOpen: false, mode: "create" },
        selectedSchedule: null,
      }));
      console.log("저장된 데이터: ", data);
    } else {
      // ✏️ edit
      const updatedSchedule = await updateSchedule(data);

      setScheduleState((prev) => ({
        ...prev,
        schedules: prev.schedules.map((s) =>
          s.id === updatedSchedule.id ? updatedSchedule : s
        ),
        modal: { isOpen: false, mode: "create" },
        selectedSchedule: null,
      }));
      console.log("수정된 데이터: ", data);
    }
  };




  const handleClose = () => {
    setScheduleState((prev) => ({
      ...prev,
      modal: {
        isOpen: false,
        mode: "create",
      },
    }));
    

  };

  const calendarEvents = scheduleState.schedules.map((s) => ({
    id: s.id,
    title: s.title,
    start: s.start,
    end: s.end,
    backgroundColor: s.color,
  }));

  const handleDelete = async (id) => {
    if (!id) return;

    // 🔥 Firestore 삭제
    await deleteSchedule(id);

    // 🔄 state 반영
    setScheduleState((prev) => ({
      ...prev,
      schedules: prev.schedules.filter(
        (schedule) => schedule.id !== id
      ),
      modal: { isOpen: false, mode: "create" },
      selectedSchedule: null,
    }));
  };


  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listWeek",
        }}
        dateClick={handleDateClick}
        events={calendarEvents}
        eventClick={handleEventClick}
        selectable={true} // 날짜 여러개 드래그 
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }}
        
      />
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

