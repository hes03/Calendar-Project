import express from "express";
import { db } from "../config/firebaseAdmin.js";
import { verifyFirebaseToken } from "../middlewares/authMiddleware.js";
import {
  calculateWorkMinutes,
  getAttendanceStatus,
  getKoreaDateString,
  getNowIsoString,
} from "../utils/attendanceUtils.js";

const router = express.Router();
const COLLECTION = "attendance";

router.use(verifyFirebaseToken);

/**
 * 오늘 근태 조회
 * GET /api/attendance/today
 */
router.get("/today", async (req, res) => {
  try {
    const today = getKoreaDateString();

    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .where("workDate", "==", today)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.json({
        hasRecord: false,
        workDate: today,
        record: null,
      });
    }

    const doc = snapshot.docs[0];

    return res.json({
      hasRecord: true,
      workDate: today,
      record: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "오늘 근태 조회 실패" });
  }
});

/**
 * 출근
 * POST /api/attendance/check-in
 */
router.post("/check-in", async (req, res) => {
  try {
    const today = getKoreaDateString();
    const now = getNowIsoString();

    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .where("workDate", "==", today)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({
        message: "오늘 이미 출근 기록이 있습니다.",
      });
    }

    const newAttendance = {
      userId: req.user.uid,
      workDate: today,
      checkInAt: now,
      checkOutAt: null,
      status: getAttendanceStatus(now),
      totalWorkMinutes: 0,
      note: "",
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection(COLLECTION).add(newAttendance);

    return res.status(201).json({
      id: docRef.id,
      ...newAttendance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "출근 처리 실패" });
  }
});

/**
 * 퇴근
 * POST /api/attendance/check-out
 */
router.post("/check-out", async (req, res) => {
  try {
    const today = getKoreaDateString();
    const now = getNowIsoString();

    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .where("workDate", "==", today)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({
        message: "오늘 출근 기록이 없습니다.",
      });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.checkOutAt) {
      return res.status(400).json({
        message: "이미 퇴근 처리되었습니다.",
      });
    }

    const totalWorkMinutes = calculateWorkMinutes(data.checkInAt, now);

    await db.collection(COLLECTION).doc(doc.id).update({
      checkOutAt: now,
      totalWorkMinutes,
      updatedAt: now,
    });

    const updatedDoc = await db.collection(COLLECTION).doc(doc.id).get();

    return res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "퇴근 처리 실패" });
  }
});

export default router;