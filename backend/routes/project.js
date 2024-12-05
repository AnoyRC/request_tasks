import express from "express";
import {
  createProject,
  getAllProjects,
  getProject,
} from "../controllers/projectController.js";
const router = express.Router();

router.post("/create", createProject);

router.get("/get/:id", getProject);

router.get("/all", getAllProjects);

export default router;
