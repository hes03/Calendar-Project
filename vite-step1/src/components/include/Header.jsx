import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">일정관리</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/schedule">Schedule</Nav.Link>
            <Nav.Link href="/attend">근태관리</Nav.Link>
          </Nav>
          <Nav className='ms-lg-auto'>
            <Nav.Link href="/login">로그인</Nav.Link>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header