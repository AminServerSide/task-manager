import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task/taskController.js";
import { protect, adminOrSupervisorMiddleware } from "../middleware/authMiddleware.js"; // اضافه کردن میانه‌افزار

const router = express.Router();

// استفاده از میانه‌افزار برای محدود کردن دسترسی به ایجاد و به‌روزرسانی تسک‌ها
router.post("/task/create", protect, adminOrSupervisorMiddleware, createTask); // فقط admin و supervisor
router.get("/tasks", protect, getTasks);
router.get("/task/:id", protect, getTask);
router.patch("/task/:id", protect, adminOrSupervisorMiddleware, updateTask); // فقط admin و supervisor
router.delete("/task/:id", protect, adminOrSupervisorMiddleware, deleteTask); // فقط admin و supervisor

export default router;
