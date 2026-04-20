import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../service/authApi/authService";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const changeUser = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const onLogin = async () => {
    try {
      await login(form);
      toast.success("로그인 성공");
      navigate("/");
    } catch (error) {
      console.error("로그인 에러", error);
      toast.error(error.message || "로그인 실패");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div>
            <h1 className="auth-hero-title">
              오늘의 일정,
              <br />더 보기 쉽게.
            </h1>
            <p className="auth-hero-desc">
              로그인하고 대시보드, 캘린더, 근태 관리를 한 곳에서 확인해보세요.
            </p>

            <div className="auth-hero-points">
              <div className="auth-point">
                <strong>대시보드 한눈에 보기</strong>
                <span>오늘 일정과 다가오는 일정을 빠르게 확인</span>
              </div>
              <div className="auth-point">
                <strong>간편한 캘린더 관리</strong>
                <span>생성, 수정, 삭제를 직관적으로 처리</span>
              </div>
              <div className="auth-point">
                <strong>개인화된 일정 관리</strong>
                <span>로그인한 사용자 기준으로 안전하게 분리</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <h2 className="auth-card-title">로그인</h2>
          <p className="auth-card-desc">
            이메일과 비밀번호를 입력해 서비스를 시작하세요.
          </p>

          <div className="auth-form-group">
            <label className="auth-form-label">이메일</label>
            <input
              className="form-control custom-input"
              id="email"
              value={form.email}
              onChange={changeUser}
              placeholder="email@example.com"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">비밀번호</label>
            <input
              className="form-control custom-input"
              id="password"
              type="password"
              value={form.password}
              onChange={changeUser}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            onClick={onLogin}
            type="button"
            className="btn custom-btn-primary auth-submit"
          >
            로그인
          </button>

          <div className="auth-link-row">
            계정이 없으신가요? <Link to="/join">회원가입</Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
