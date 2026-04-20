import express from "express";
import { db } from "../config/firebaseAdmin.js";
import { verifyFirebaseToken } from "../middlewares/authMiddleware.js";
import {
  validateCreateSchedule,
  validateUpdateSchedule,
} from "../middlewares/validateScheduleMiddleware.js";

const router = express.Router();
const COLLECTION = "schedules";

router.use(verifyFirebaseToken);

/**
 * 전체 일정 조회
 * GET /api/schedules
 */
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .get();

    const schedules = snapshot.docs.map((doc) => ({
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

    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "일정 없음" });
    }

    const data = docSnap.data();

    if (data.userId !== req.user.uid) {
      return res.status(403).json({ message: "접근 권한이 없습니다." });
    }

    res.json({
      id: docSnap.id,
      ...data,
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
router.post("/", validateCreateSchedule, async (req, res) => {
  try {
    const { title, start, end, memo, color } = req.body;
    const now = new Date().toISOString();

    const newSchedule = {
      title,
      start,
      end,
      memo,
      color,
      userId: req.user.uid,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection(COLLECTION).add(newSchedule);

    res.status(201).json({
      id: docRef.id,
      ...newSchedule,
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
router.put("/:id", validateUpdateSchedule, async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "일정 없음" });
    }

    const oldData = docSnap.data();

    if (oldData.userId !== req.user.uid) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const nextStart = req.body.start ?? oldData.start;
    const nextEnd = req.body.end ?? oldData.end;

    if (new Date(nextEnd) <= new Date(nextStart)) {
      return res.status(400).json({
        message: "종료 시간은 시작 시간 이후여야 합니다.",
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    if (updateData.title !== undefined) {
      updateData.title = updateData.title.trim();
    }

    delete updateData.userId;
    delete updateData.createdAt;

    await docRef.update(updateData);

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

    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "일정 없음" });
    }

    const data = docSnap.data();

    if (data.userId !== req.user.uid) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await docRef.delete();

    res.json({ message: "일정이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "일정 삭제 중 오류 발생" });
  }
});

export default router;