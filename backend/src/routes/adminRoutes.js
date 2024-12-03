import express from "express";
import { deleteUser, getAllUsers } from "../controllers/auth/adminController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// حذف کاربر با استفاده از ID (فقط برای ادمین‌ها)
router.delete("/users/:id", adminMiddleware, deleteUser);

// دریافت تمامی کاربران (فقط برای ادمین‌ها)
router.get("/users", adminMiddleware, getAllUsers);

export default router;
