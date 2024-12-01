import express from "express";
import {
  changePassword,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";

const router = express.Router();

// ثبت نام کاربر جدید
router.post("/register", registerUser);

// ورود به سیستم
router.post("/login", loginUser);

// خروج از سیستم
router.get("/logout", logoutUser);

// دریافت اطلاعات کاربر
router.get("/user", protect, getUser);

// بروزرسانی اطلاعات کاربر
router.patch("/user", protect, updateUser);

// تغییر رمز عبور
router.patch("/change-password", protect, changePassword);

// درخواست تغییر رمز عبور (فراموشی رمز عبور)
router.post("/forgot-password", forgotPassword);

// ریست کردن رمز عبور
router.post("/reset-password/:resetPasswordToken", resetPassword);

// عملیات مدیریت (فقط مدیران)
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// دریافت تمام کاربران (فقط برای سازندگان یا مدیران)
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// وضعیت ورود
router.get("/login-status", userLoginStatus);

// تایید ایمیل
router.post("/verify-email", protect, verifyEmail);

// تایید کاربر با کد تایید ایمیل
router.post("/verify-user/:verificationToken", verifyUser);

export default router;
