import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/schedules",
  headers: {
    "Content-Type": "application/json",
  },
});

// 일정 등록
export const createSchedule = async (schedule) => {
  console.log("📤 프론트 → 서버", schedule);
  const res = await api.post("/", schedule);
  console.log("📥 서버 응답", res.data);
  return res.data;
};

// 일정 전체 조회
export const getSchedules = async () => {
  const res = await api.get("/");
  return res.data;
};

// 일정 수정
export const updateSchedule = async (schedule) => {
  if (!schedule.id) {
    throw new Error("schedule.id가 없습니다");
  }
  const res = await api.put(`/${schedule.id}`, schedule);
  return res.data;
};

// 일정 삭제
export const deleteSchedule = async (id) => {
  await api.delete(`/${id}`);
};
