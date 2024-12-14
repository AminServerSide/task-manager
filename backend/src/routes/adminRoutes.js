import express from "express";
import { deleteUser, getAllUsers } from "../controllers/auth/adminController.js";
import { protect, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Admin Routes
 * Middleware:
 * - `protect`: Ensures the user is authenticated.
 * - `adminMiddleware`: Restricts access to Admin role only.
 */

/** 
 * Delete a User by ID
 * @route DELETE /admin/users/:id
 * @access Admin only
 */
router.delete("/users/:id", protect, adminMiddleware, deleteUser);

/** 
 * Get All Users
 * @route GET /admin/users
 * @access Admin only
 */
router.get("/users", protect, adminMiddleware, getAllUsers);

export default router;
