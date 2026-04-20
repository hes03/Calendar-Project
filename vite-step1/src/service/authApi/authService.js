import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export const signup = async ({ email, password, username }) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (username) {
    await updateProfile(userCredential.user, {
      displayName: username,
    });
  }

  return userCredential.user;
};

export const login = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const getAccessToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};