import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task/taskController.js";
import { protect, adminOrSupervisorMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Use middleware to restrict access to create and update tasks
// only admin and supervisor have access
router.post("/task/create", protect, adminOrSupervisorMiddleware, createTask); 
router.get("/tasks", protect, getTasks);
router.get("/task/:id", protect, getTask);

// only admin and supervisor have access
router.patch("/task/:id", protect, adminOrSupervisorMiddleware, updateTask); 
// only admin and supervisor have access
router.delete("/task/:id", protect, adminOrSupervisorMiddleware, deleteTask); 

export default router;
