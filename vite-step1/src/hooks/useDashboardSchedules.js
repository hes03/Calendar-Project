import { useEffect, useState } from "react";
import { getSchedules } from "../service/scheduleApi/scheduleService";

export const useDashboardSchedules = ({ enabled = true } = {}) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "대시보드 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchSchedules();
  }, [enabled]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
  };
};