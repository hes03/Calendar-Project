import express from "express";
import { db } from "../config/firebaseAdmin.js";
import { verifyFirebaseToken } from "../middlewares/authMiddleware.js";
import {
  calculateWorkMinutes,
  getAttendanceStatus,
  getKoreaDateString,
  getNowIsoString,
  getMonthStartDateString,
  getNextMonthStartDateString,
} from "../utils/attendanceUtils.js";

const router = express.Router();
const COLLECTION = "attendance";

router.use(verifyFirebaseToken);

/**
 * 오늘 근태 조회
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
        message: "오늘 이미 근태 기록이 있습니다.",
      });
    }

    const newAttendance = {
      userId: req.user.uid,
      workDate: today,
      checkInAt: now,
      checkOutAt: null,
      status: getAttendanceStatus(now),
      attendanceType: "NORMAL",
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

    if (data.attendanceType === "VACATION") {
      return res.status(400).json({
        message: "휴가 상태에서는 퇴근 처리할 수 없습니다.",
      });
    }

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

/**
 * 조퇴 처리
 */
router.patch("/early-leave", async (req, res) => {
  try {
    const today = getKoreaDateString();
    const now = getNowIsoString();
    const { note = "" } = req.body;

    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .where("workDate", "==", today)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({
        message: "오늘 출근 기록이 없어 조퇴 처리할 수 없습니다.",
      });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.attendanceType === "VACATION") {
      return res.status(400).json({
        message: "휴가 기록은 조퇴 처리할 수 없습니다.",
      });
    }

    if (data.checkOutAt) {
      return res.status(400).json({
        message: "이미 퇴근 처리된 기록은 조퇴로 변경할 수 없습니다.",
      });
    }

    const totalWorkMinutes = calculateWorkMinutes(data.checkInAt, now);

    await db.collection(COLLECTION).doc(doc.id).update({
      checkOutAt: now,
      totalWorkMinutes,
      attendanceType: "EARLY_LEAVE",
      note,
      updatedAt: now,
    });

    const updatedDoc = await db.collection(COLLECTION).doc(doc.id).get();

    return res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "조퇴 처리 실패" });
  }
});

/**
 * 휴가 등록
 */
router.post("/vacation", async (req, res) => {
  try {
    const { workDate, note = "" } = req.body;
    const now = getNowIsoString();

    if (!workDate) {
      return res.status(400).json({
        message: "휴가 등록 날짜가 필요합니다.",
      });
    }

    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .where("workDate", "==", workDate)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({
        message: "해당 날짜에는 이미 근태 기록이 있습니다.",
      });
    }

    const vacationRecord = {
      userId: req.user.uid,
      workDate,
      checkInAt: null,
      checkOutAt: null,
      status: "VACATION",
      attendanceType: "VACATION",
      totalWorkMinutes: 0,
      note,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection(COLLECTION).add(vacationRecord);

    return res.status(201).json({
      id: docRef.id,
      ...vacationRecord,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "휴가 등록 실패" });
  }
});

/**
 * 월별 근태 조회 + 통계
 */
router.get("/monthly", async (req, res) => {
  try {
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({
        message: "year와 month를 올바르게 전달해 주세요.",
      });
    }

    const startDate = getMonthStartDateString(year, month);
    const endDate = getNextMonthStartDateString(year, month);

    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .where("workDate", ">=", startDate)
      .where("workDate", "<", endDate)
      .orderBy("workDate", "desc")
      .get();

    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalDays = records.length;
    const totalWorkMinutes = records.reduce(
      (sum, record) => sum + (record.totalWorkMinutes || 0),
      0
    );

    const onTimeCount = records.filter(
      (record) => record.status === "ON_TIME"
    ).length;

    const lateCount = records.filter(
      (record) => record.status === "LATE"
    ).length;

    const checkedOutCount = records.filter(
      (record) => !!record.checkOutAt
    ).length;

    const earlyLeaveCount = records.filter(
      (record) => record.attendanceType === "EARLY_LEAVE"
    ).length;

    const vacationCount = records.filter(
      (record) => record.attendanceType === "VACATION"
    ).length;

    const averageWorkMinutes =
      totalDays > 0 ? Math.floor(totalWorkMinutes / totalDays) : 0;

    return res.json({
      year,
      month,
      records,
      summary: {
        totalDays,
        totalWorkMinutes,
        averageWorkMinutes,
        onTimeCount,
        lateCount,
        checkedOutCount,
        earlyLeaveCount,
        vacationCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "월별 근태 조회 실패" });
  }
});

export default router;