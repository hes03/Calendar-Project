import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/schedules",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
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

// 일정 생성
export const createSchedule = async (schedule) => {
  const res = await api.post("/", schedule);
  return res.data;
};

// 일정 전체 조회
export const getSchedules = async () => {
  const res = await api.get("/");
  return res.data;
};

// 일정 단건 조회
export const getScheduleById = async (id) => {
  if (!id) throw new Error("조회할 일정 ID가 없습니다.");
  const res = await api.get(`/${id}`);
  return res.data;
};

// 일정 수정
export const updateSchedule = async (id, data) => {
  if (!id) throw new Error("수정할 일정 ID가 없습니다.");
  const res = await api.put(`/${id}`, data);
  return res.data;
};

// 일정 삭제
export const deleteSchedule = async (id) => {
  if (!id) throw new Error("삭제할 일정 ID가 없습니다.");
  const res = await api.delete(`/${id}`);
  return res.data;
};
