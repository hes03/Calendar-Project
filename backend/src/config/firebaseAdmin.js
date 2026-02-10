import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM에서 __dirname 만들기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔑 키 파일 로드
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../firebase-admin-key.json"),
    "utf8"
  )
  
);

// Firebase Admin 초기화 (중복 방지)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
