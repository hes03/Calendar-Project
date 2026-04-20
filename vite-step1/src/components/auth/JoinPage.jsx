import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../service/authApi/authService";
import { toast } from "react-toastify";

const JoinPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleJoin = async () => {
    try {
      await signup(form);
      toast.success("회원가입 성공");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패", error);
      toast.error(error.message || "회원가입 실패");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div>
            <h1 className="auth-hero-title">
              나만의 일정 관리,
              <br />
              지금 바로 시작하세요.
            </h1>
            <p className="auth-hero-desc">
              회원가입 후 대시보드, 일정관리, 근태 기능을 한 번에 사용할 수
              있습니다.
            </p>

            <div className="auth-hero-points">
              <div className="auth-point">
                <strong>간단한 회원가입</strong>
                <span>이메일과 비밀번호만으로 빠르게 시작</span>
              </div>
              <div className="auth-point">
                <strong>깔끔한 일정 대시보드</strong>
                <span>오늘, 이번 주, 다가오는 일정 요약 제공</span>
              </div>
              <div className="auth-point">
                <strong>안전한 사용자별 일정 관리</strong>
                <span>로그인 사용자 기준으로 일정 데이터 분리</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <h2 className="auth-card-title">회원가입</h2>
          <p className="auth-card-desc">
            기본 정보를 입력하고 나만의 일정을 관리해보세요.
          </p>

          <div className="auth-form-group">
            <label className="auth-form-label">이름</label>
            <input
              className="form-control custom-input"
              id="username"
              value={form.username}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">이메일</label>
            <input
              className="form-control custom-input"
              id="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="new-email"
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
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            onClick={handleJoin}
            type="button"
            className="btn custom-btn-primary auth-submit"
          >
            회원가입
          </button>

          <div className="auth-link-row">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default JoinPage;
