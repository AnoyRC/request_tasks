import express from "express";
import {
  createTask,
  getTasksByProjectId,
} from "../controllers/taskController.js";
const router = express.Router();

router.post("/create", createTask);

router.get("/get/all/:projectId", getTasksByProjectId);

export default router;
