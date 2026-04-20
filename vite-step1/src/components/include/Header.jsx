import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../service/authApi/authService";

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  const navClass = (path) =>
    `app-nav-link ${location.pathname === path ? "active" : ""}`;

  return (
    <Navbar expand="lg" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="app-brand">
          <span className="app-brand-badge">📅</span>
          Planit
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={navClass("/")}>
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/schedule"
              className={navClass("/schedule")}
            >
              Schedule
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/attendance"
              className={navClass("/attendance")}
            >
              Attend
            </Nav.Link>
          </Nav>

          <Nav className="ms-lg-auto align-items-lg-center">
            {currentUser ? (
              <>
                <span className="app-user-pill">{currentUser.email}</span>
                <button
                  type="button"
                  className="btn app-logout-btn"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="app-login-link">
                로그인
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
