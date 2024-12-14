import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task/taskController.js";
import {
  protect,
  adminOrSupervisorMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Task Routes
 * Middleware: 
 * - `protect`: Ensures the user is authenticated.
 * - `adminOrSupervisorMiddleware`: Restricts access to Admin or Supervisor roles only.
 */

/** 
 * Render Task Page
 * This route renders the task management page.
 */
router.get("/tasks", (req, res) => {
  res.render("tasks"); // Render the tasks page (tasks.ejs)
});

/** 
 * Create a New Task
 * Only Admins and Supervisors are allowed to create tasks.
 */
router.post("/task/create", protect, adminOrSupervisorMiddleware, createTask);

/** 
 * Get All Tasks
 * Accessible by any authenticated user.
 */
router.get("/tasks", protect, getTasks);

/** 
 * Get a Single Task by ID
 * Accessible by any authenticated user.
 */
router.get("/task/:id", protect, getTask);

/** 
 * Update an Existing Task
 * Only Admins and Supervisors are allowed to update tasks.
 */
router.patch("/task/:id", protect, adminOrSupervisorMiddleware, updateTask);

/** 
 * Delete a Task by ID
 * Only Admins and Supervisors are allowed to delete tasks.
 */
router.delete("/task/:id", protect, adminOrSupervisorMiddleware, deleteTask);

export default router;
