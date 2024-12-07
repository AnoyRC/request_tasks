import express from "express";
import {
  createTask,
  getTasksByProjectId,
  updateTask,
  deleteTask,
  claimTask,
  changeTaskStatus,
  checkForCompletedTask,
} from "../controllers/taskController.js";
const router = express.Router();

router.post("/create", createTask);

router.get("/get/all/:projectId", getTasksByProjectId);

router.post("/update", updateTask);

router.post("/delete", deleteTask);

router.post("/claim", claimTask);

router.post("/change-status", changeTaskStatus);

router.get("/check/:id", checkForCompletedTask);

export default router;
