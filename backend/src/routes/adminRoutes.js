import express from "express";
import { deleteUser, getAllUsers } from "../controllers/auth/adminController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// delete users by ID(only for admins)
router.delete("/users/:id", adminMiddleware, deleteUser);

// get all users(only for admins)
router.get("/users", adminMiddleware, getAllUsers);

export default router;
