import express from "express";
import {
  createTask,
  getTasksByProjectId,
  updateTask,
  deleteTask,
  claimTask,
  changeTaskStatus,
} from "../controllers/taskController.js";
const router = express.Router();

router.post("/create", createTask);

router.get("/get/all/:projectId", getTasksByProjectId);

router.post("/update", updateTask);

router.post("/delete", deleteTask);

router.post("/claim", claimTask);

router.post("/change-status", changeTaskStatus);

export default router;
