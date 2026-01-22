import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

// 일정 등록
export const createSchedule = async (schedule) => {
  const docRef = await addDoc(collection(db, "schedules"), {
    title: schedule.title,
    start: schedule.start,
    end: schedule.end,
    memo: schedule.memo,
    color: schedule.color,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id, // 🔥 Firestore 문서 id
    ...schedule,
  };
};

// 일정 전체 조회
export const getSchedules = async () => {
  const q = query(
    collection(db, "schedules"),
    orderBy("createdAt", "asc")
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,      // 🔥 핵심
    ...doc.data(),
  }));
};

// 일정 수정
export const updateSchedule = async (schedule) => {
  const scheduleRef = doc(db, "schedules", schedule.id);

  await updateDoc(scheduleRef, {
    title: schedule.title,
    start: schedule.start,
    end: schedule.end,
    memo: schedule.memo,
    color: schedule.color,
    updatedAt: new Date(),
  });

  return schedule;
};

// 일정 삭제
export const deleteSchedule = async (id) => {
  const scheduleRef = doc(db, "schedules", id);
  await deleteDoc(scheduleRef);
};