import express from "express";
import { schedules } from "../data/schedulesData.js";

const router = express.Router();

//전체 일정 조회
router.get("/", (req, res) => {
  if (!Array.isArray(schedules)) {
    return res.status(500).json({ message: "일정 데이터 오류" });
  }
  res.json(schedules);
});

// 일정 단건 조회
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID가 필요합니다." });
  }
  const schedule = schedules.find(s => s.id === id);

  if (!schedule) {
    return res.status(404).json({ message: "일정 없음" });
  }

  res.json(schedule);
});


//일정 생성
router.post("/", (req, res) => {
  try {
    const body = req.body || {};
    const newSchedule = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    schedules.push(newSchedule);
    res.status(201).json(newSchedule);
    console.log("서버에서 받은 데이터: ", body)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 생성 중 오류 발생" });
  }
  
});

//일정 수정
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID가 필요합니다." });
    }

    const index = schedules.findIndex(s => s.id === id);


    if (index === -1) {
      return res.status(404).json({ message: "일정 없음" });
    }
    if (start && end && new Date(end) <= new Date(start)) {
      return res.status(400).json({
        message: "종료 시간은 시작 시간 이후여야 합니다.",
      });
    }

    schedules[index] = {
      ...schedules[index],
      ...(req.body || {}),
      updatedAt: new Date(),
    };

    res.json(schedules[index]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 수정 중 오류 발생" });
  }
  
});

//일정 삭제
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = schedules.findIndex(s => String(s.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ message: "일정 없음" });
    }

    schedules.splice(index, 1);
    res.json({ message: "일정이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 삭제 중 오류 발생" });
  }
  
});

export default router;
