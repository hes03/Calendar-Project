import axios from "axios";
import { getAccessToken } from "../authApi/authService"; // 경로는 실제 위치에 맞게 수정

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