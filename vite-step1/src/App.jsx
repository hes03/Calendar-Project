import { Route, Routes } from "react-router-dom"
import Homepage from "./components/pages/Homepage"
import Schedule from "./components/pages/Schedule"
import Attend from "./components/pages/Attend"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/attend" element={<Attend />} />

      </Routes>
    </>
  )
}

export default App
