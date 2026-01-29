import express from "express";
import scheduleRoutes from "./routes/schedules.js"
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use("/schedules", scheduleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});