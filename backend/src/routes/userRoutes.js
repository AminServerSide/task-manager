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

/**
 * Routes for User Authentication and Management
 */

// Render Registration Page
router.get("/register", (req, res) => {
  res.render("register"); // Render the registration form (register.ejs)
});

// Render Login Page
router.get("/login", (req, res) => {
  res.render("login"); // Render the login form (login.ejs)
});

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// User Logout
router.get("/logout", logoutUser);

// Get Logged-in User Info
router.get("/user", protect, getUser);

// Update Logged-in User Info
router.patch("/user", protect, updateUser);

// Change Password for Logged-in User
router.patch("/change-password", protect, changePassword);

// Forgot Password - Request Reset Link
router.post("/forgot-password", forgotPassword);

// Reset Password using Token
router.post("/reset-password/:resetPasswordToken", resetPassword);

// Verify Email Address for Logged-in User
router.post("/verify-email", protect, verifyEmail);

// Verify User with Token (e.g., during registration or email update)
router.post("/verify-user/:verificationToken", verifyUser);

// Check User Login Status
router.get("/login-status", userLoginStatus);

/**
 * Admin-Specific Routes
 */

// Delete User (Admin Only)
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// Get All Users (Admin Only)
router.get("/admin/users", protect, adminMiddleware, getAllUsers);

/**
 * Creator-Specific Routes
 */

// Get All Users (Creator Access Only)
router.get("/users", protect, creatorMiddleware, getAllUsers);

export default router;
