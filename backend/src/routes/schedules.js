import express from "express";
import { schedules } from "../data/schedulesData.js";

const router = express.Router();

//전체 일정 조회
router.get("/", (req, res) => {
  res.json(schedules);
});

// 일정 단건 조회
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const schedule = schedules.find(s => s.id === id);

  if (!schedule) {
    return res.status(404).json({ message: "일정 없음" });
  }

  res.json(schedule);
});


//일정 생성
router.post("/", (req, res) => {
  const newSchedule = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date(),
  };

  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
  console.log("서버에서 받은 데이터: ", req.body)
});

//일정 수정
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const index = schedules.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "일정 없음" });
  }

  schedules[index] = {
    ...schedules[index],
    ...req.body,
    updatedAt: new Date(),
  };

  res.json(schedules[index]);
});

//일정 삭제
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = schedules.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "일정 없음" });
  }

  schedules.splice(index, 1);
  res.status(204).send();
});

export default router;
