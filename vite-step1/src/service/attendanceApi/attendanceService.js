import axios from "axios";
import { getAccessToken } from "../authApi/authService";

const API_BASE_URL = "http://localhost:3000/api/attendance";

const getAuthHeaders = async () => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("로그인 정보가 없습니다.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getTodayAttendance = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/today`, { headers });
  return response.data;
};

export const checkIn = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.post(
    `${API_BASE_URL}/check-in`,
    {},
    { headers }
  );
  return response.data;
};

export const checkOut = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.post(
    `${API_BASE_URL}/check-out`,
    {},
    { headers }
  );
  return response.data;
};

export const markEarlyLeave = async (note = "") => {
  const headers = await getAuthHeaders();
  const response = await axios.patch(
    `${API_BASE_URL}/early-leave`,
    { note },
    { headers }
  );
  return response.data;
};

export const registerVacation = async ({ workDate, note = "" }) => {
  const headers = await getAuthHeaders();
  const response = await axios.post(
    `${API_BASE_URL}/vacation`,
    { workDate, note },
    { headers }
  );
  return response.data;
};

export const getMonthlyAttendance = async (year, month) => {
  const headers = await getAuthHeaders();
  const response = await axios.get(
    `${API_BASE_URL}/monthly?year=${year}&month=${month}`,
    { headers }
  );
  return response.data;
};