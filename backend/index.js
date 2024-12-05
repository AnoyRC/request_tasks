import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import projectRouter from "./routes/project.js";
app.use("/api/projects", projectRouter);

import taskRouter from "./routes/task.js";
app.use("/api/tasks", taskRouter);

// Listen for requests
app.listen(PORT, () => {
  console.log(
    `Request Task Backend has completed initializing on port ${PORT}`
  );
});
