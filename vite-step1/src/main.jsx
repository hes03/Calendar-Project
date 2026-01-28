import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/include/Header.jsx';
import HomePage from './components/pages/Homepage.jsx';
import Schedule from './components/pages/Schedule.jsx';
import Attend from './components/pages/Attend.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import JoinPage from './components/auth/JoinPage.jsx';
import Footer from './components/include/Footer.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/attend" element={<Attend />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </>,
)
