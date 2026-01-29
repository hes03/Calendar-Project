import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction"
import { useEffect, useState } from "react";
import ScheduleModal from "../ScheduleModal";
import { createSchedule, getSchedules, updateSchedule, deleteSchedule } from "../../service/scheduleApi/scheduleService";
import "../styles/Schedule.css"
import { toast } from "react-toastify";

const Schedule = () => {
  //일정 상태관리
  const [scheduleState, setScheduleState] = useState({
    schedules: [],
    selectedSchedule: null,
    modal: { isOpen: false, mode: "create" },
    //state 확장
    loading: true, //로딩중
	  isSaving: false, //저장중
	  error: null,
  });
	//일정 조회
	useEffect(() => {
	  const fetchSchedules = async () => {
	    try {
	      const schedulesFromDB = await getSchedules();
	      setScheduleState((prev) => ({
	        ...prev,
	        schedules: Array.isArray(schedulesFromDB) ? schedulesFromDB : [],
	        loading: false,
	      })); //end of try
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
	}, []);//end of useEffect
  
  //날짜 클릭하면 일정 저장
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
  };//end of handleDateClick

  //일정 클릭하면 모달 수정창 열림
  const handleEventClick = (info) => {
  const clickedSchedule = scheduleState.schedules.find(
    (s) => s.id === info.event.id
  );
    if (!clickedSchedule) return;
    
    setScheduleState((prev) => ({
      ...prev,
      selectedSchedule: clickedSchedule,
      modal: {
        isOpen: true,
        mode: "edit",
      },
    }));
  };//end of handleEventClick

  // 저장
  const handleSave = async (data) => {
    if (scheduleState.isSaving) return;

  setScheduleState((prev) => ({ ...prev, isSaving: true }));

  try{
    if (scheduleState.modal.mode === "create") {
      const newSchedule = await createSchedule(data);

      setScheduleState((prev) => ({
        ...prev,
        schedules: [...prev.schedules, newSchedule],
        modal: { isOpen: false, mode: "create" },
        selectedSchedule: null,
        isSaving: false,
      }));
      console.log("저장된 데이터: ", newSchedule);
      toast.success("일정이 등록되었습니다.");
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
        isSaving: false,
      }));
      console.log("수정된 데이터: ", updatedSchedule);
      toast.success("일정이 수정되었습니다.");
    }//end of if
  }catch(err){
    console.error(err);

    toast.error(err.message || "저장 중 오류가 발생했습니다.");

    setScheduleState((prev) => ({
      ...prev,
      isSaving: false,
    }));
  }
  };//end of handleSave

  //모달 닫기
  const handleClose = () => {
    setScheduleState((prev) => ({
      ...prev,
      modal: {
        isOpen: false,
        mode: "create",
      },
    }));
  };//end of handleClose
  //일정표시
  const calendarEvents = scheduleState.schedules.map((s) => ({
    id: s.id,
    title: s.title,
    start: s.start,
    end: s.end,
    backgroundColor: s.color,
  }));//end of calendarEvents
  //일정 삭제
  const handleDelete = async (id) => {
    if (!id) return;
    try{
        // Firestore 삭제
      await deleteSchedule(id);

      // state 반영
      setScheduleState((prev) => ({
        ...prev,
        schedules: prev.schedules.filter(
          (schedule) => schedule.id !== id
        ),
        modal: { isOpen: false, mode: "create" },
        selectedSchedule: null,
      }));
      toast.success("일정이 삭제되었습니다");
    }catch(err){
      console.error(err);
      toast.error(err.message || "삭제에 실패했습니다.");
    }
  };//end of handleDelete


  return (
    <>
    <div className="calendar-box" >
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

