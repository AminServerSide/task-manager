import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ایجاد یک وظیفه جدید
router.post("/task/create", protect, createTask);

// دریافت تمام وظایف کاربر
router.get("/tasks", protect, getTasks);

// دریافت یک وظیفه خاص بر اساس id
router.get("/task/:id", protect, getTask);

// بروزرسانی یک وظیفه بر اساس id
router.patch("/task/:id", protect, updateTask);

// حذف یک وظیفه بر اساس id
router.delete("/task/:id", protect, deleteTask);

export default router;
