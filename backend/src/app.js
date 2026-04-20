import express from "express";
import scheduleRoutes from "./routes/schedules.js";
import attendanceRoutes from "./routes/attendance.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const PORT = 3000;

const swaggerDocument = YAML.load("./openapi.yaml");

app.use(cors());
app.use(express.json());

app.use("/api/schedules", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
});