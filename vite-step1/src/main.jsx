import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/include/Header.jsx";
import Footer from "./components/include/Footer.jsx";
import HomePage from "./components/pages/Homepage.jsx";
import Schedule from "./components/pages/Schedule.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import JoinPage from "./components/auth/JoinPage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AuthProvider from "./context/AuthContext.jsx";

import { Slide, ToastContainer } from "react-toastify";

import "./components/styles/global.css";
import "./components/styles/header.css";
import "./components/styles/auth.css";
import "./components/styles/dashboard.css";
import "./components/styles/calendar.css";
import Attendance from "./components/pages/Attendance.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
      </Routes>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={1800}
        hideProgressBar
        closeButton={false}
        pauseOnHover={false}
        draggable={false}
        theme="colored"
        transition={Slide}
      />
    </BrowserRouter>
  </AuthProvider>,
);
