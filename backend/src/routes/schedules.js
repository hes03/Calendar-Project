import express from "express";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();
const COLLECTION = "schedules";

/**
 * 전체 일정 조회
 * GET /api/schedules
 * (추후 userId, date 쿼리 확장 가능)
 */
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).get();

    const schedules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 조회 실패" });
  }
});

/**
 * 일정 단건 조회
 * GET /api/schedules/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID가 필요합니다." });
    }

    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "일정 없음" });
    }

    res.json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 단건 조회 오류" });
  }
});

/**
 * 일정 생성
 * POST /api/schedules
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      start,
      end,
      memo = "",
    } = req.body || {};

    if (!title || !start || !end) {
      return res.status(400).json({
        message: "title, start, end는 필수입니다.",
      });
    }

    if (new Date(end) <= new Date(start)) {
      return res.status(400).json({
        message: "종료 시간은 시작 시간 이후여야 합니다.",
      });
    }

    const docRef = await db.collection(COLLECTION).add({
      title,
      start,
      end,
      memo,
      createdAt: new Date(),
      updatedAt: null,
    });

    res.status(201).json({
      id: docRef.id,
      title,
      start,
      end,
      memo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 생성 중 오류 발생" });
  }
});

/**
 * 일정 수정
 * PUT /api/schedules/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: "ID가 필요합니다." });
    }

    if (start && end && new Date(end) <= new Date(start)) {
      return res.status(400).json({
        message: "종료 시간은 시작 시간 이후여야 합니다.",
      });
    }

    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "일정 없음" });
    }

    await docRef.update({
      ...req.body,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 수정 중 오류 발생" });
  }
});

/**
 * 일정 삭제
 * DELETE /api/schedules/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID가 필요합니다." });
    }

    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "일정 없음" });
    }

    await docRef.delete();

    res.json({ message: "일정이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 삭제 중 오류 발생" });
  }
});

export default router;
