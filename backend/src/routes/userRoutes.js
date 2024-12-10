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

// مسیر جدید برای نمایش فرم ثبت‌نام
router.get("/register", (req, res) => {
  res.render("register"); // نمایش صفحه register.ejs
});

router.get("/login", (req, res) => {
  res.render("login"); // نمایش صفحه register.ejs
});

router.get("/admin", (req, res) => {
  res.render("admin"); // نمایش صفحه register.ejs
});

router.get("/supervisor", (req, res) => {
  res.render("supervisor"); // نمایش صفحه register.ejs
});

router.get("/employee", (req, res) => {
  res.render("employee"); // نمایش صفحه register.ejs
});

// مسیر جدید برای پردازش ثبت‌نام کاربر
router.post("/register", registerUser);

// general commands for all users
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// verify-email
router.post("/verify-email", protect, verifyEmail);

// verify user and email
router.post("/verify-user/:verificationToken", verifyUser);

// forgotting password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password/:resetPasswordToken", resetPassword);

// changing password
router.patch("/change-password", protect, changePassword);

export default router;
