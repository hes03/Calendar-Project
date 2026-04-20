import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FS_APIKEY,
  authDomain: import.meta.env.VITE_FS_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FS_PROJECTID,
  storageBucket: import.meta.env.VITE_FS_STORACEBUCKET,
  messagingSenderId: import.meta.env.VITE_FS_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FS_APPID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;