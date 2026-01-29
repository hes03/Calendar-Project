import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/schedules",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // ⏱️ 무한 대기 방지
});

// 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "서버와 통신 중 오류가 발생했습니다.";

    return Promise.reject({
      status: error.response?.status,
      message,
    });
  }
);

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
  if (!id) {
    throw { message: "삭제할 일정 ID가 없습니다." };
  }
  await api.delete(`/${id}`);
};
