import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import path from "path";

// مسیر فایل JSON
const filePath = path.resolve("data/tasks.json");

// کمک‌کننده برای خواندن فایل JSON
const readTasks = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return []; // اگر فایل وجود ندارد یا خطایی رخ داد، یک آرایه خالی برگردانید
  }
};

// کمک‌کننده برای نوشتن در فایل JSON
const writeTasks = async (tasks) => {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf8");
};

// ایجاد یک تسک
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required!" });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Description is required!" });
  }

  const tasks = await readTasks();
  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
    priority,
    status,
    user: req.user._id,
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  res.status(201).json(newTask);
});

// دریافت تمام تسک‌ها
export const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tasks = await readTasks();
  const userTasks = tasks.filter((task) => task.user === userId);

  res.status(200).json({
    length: userTasks.length,
    tasks: userTasks,
  });
});

// دریافت تسک مشخص
export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const tasks = await readTasks();
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  if (task.user !== userId) {
    return res.status(401).json({ message: "Not authorized!" });
  }

  res.status(200).json(task);
});

// ویرایش تسک
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { title, description, dueDate, priority, status, completed } = req.body;

  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found!" });
  }

  const task = tasks[taskIndex];

  if (task.user !== userId) {
    return res.status(401).json({ message: "Not authorized!" });
  }

  tasks[taskIndex] = {
    ...task,
    title: title || task.title,
    description: description || task.description,
    dueDate: dueDate || task.dueDate,
    priority: priority || task.priority,
    status: status || task.status,
    completed: completed !== undefined ? completed : task.completed,
  };

  await writeTasks(tasks);

  res.status(200).json(tasks[taskIndex]);
});

// حذف تسک
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const tasks = await readTasks();
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  if (task.user !== userId) {
    return res.status(401).json({ message: "Not authorized!" });
  }

  const updatedTasks = tasks.filter((task) => task.id !== id);
  await writeTasks(updatedTasks);

  res.status(200).json({ message: "Task deleted successfully!" });
});

// حذف تمام تسک‌ها
export const deleteAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tasks = await readTasks();
  const updatedTasks = tasks.filter((task) => task.user !== userId);

  await writeTasks(updatedTasks);

  res.status(200).json({ message: "All tasks deleted successfully!" });
});
