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

// عمومی
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// ادمین
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// دریافت تمام کاربران
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// وضعیت لاگین
router.get("/login-status", userLoginStatus);

// تایید ایمیل
router.post("/verify-email", protect, verifyEmail);

// تایید کاربر --> تایید ایمیل
router.post("/verify-user/:verificationToken", verifyUser);

// فراموشی رمز عبور
router.post("/forgot-password", forgotPassword);

// بازنشانی رمز عبور
router.post("/reset-password/:resetPasswordToken", resetPassword);

// تغییر رمز عبور --> فقط برای کاربران وارد شده
router.patch("/change-password", protect, changePassword);

export default router;
