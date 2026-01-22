import { Route, Routes } from "react-router-dom"
import Homepage from "./components/pages/Homepage"
import Schedule from "./components/pages/Schedule"
import Attend from "./components/pages/Attend"
import Header from "./components/include/Header"
import LoginPage from "./components/auth/LoginPage"
import JoinPage from "./components/auth/JoinPage"

function App() {

  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/attend" element={<Attend />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
    
      </Routes>
    </>
  )
}

export default App
