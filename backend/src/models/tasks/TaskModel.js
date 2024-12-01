import fs from "fs";
import path from "path";

// محل ذخیره‌سازی داده‌های وظایف
const tasksDataPath = path.resolve("data", "tasks.json");

// بارگذاری داده‌های وظایف از فایل JSON
const loadTasksData = () => {
  if (!fs.existsSync(tasksDataPath)) {
    fs.writeFileSync(tasksDataPath, JSON.stringify([])); // اگر فایل وجود نداشت، ایجادش کن
  }
  return JSON.parse(fs.readFileSync(tasksDataPath, "utf-8"));
};

// ذخیره‌سازی داده‌های جدید وظایف به فایل JSON
const saveTasksData = (data) => {
  fs.writeFileSync(tasksDataPath, JSON.stringify(data, null, 2));
};

// مدل Task
class Task {
  constructor(title, description, dueDate, priority, status, user) {
    this.title = title;
    this.description = description || "No description";
    this.dueDate = dueDate || Date.now();
    this.status = status || "active";
    this.completed = false;
    this.priority = priority || "low";
    this.user = user;
    this._id = Date.now().toString(); // استفاده از زمان به عنوان شناسه منحصر به فرد
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static findOne(query) {
    const tasks = loadTasksData();
    return tasks.find(task => task.title === query.title);
  }

  static findById(id) {
    const tasks = loadTasksData();
    return tasks.find(task => task._id === id);
  }

  static find(query) {
    const tasks = loadTasksData();
    return tasks.filter(task => task.user === query.user);
  }

  static create(data) {
    const tasks = loadTasksData();
    const newTask = new Task(data.title, data.description, data.dueDate, data.priority, data.status, data.user);
    tasks.push(newTask);
    saveTasksData(tasks);
    return newTask;
  }

  static update(id, data) {
    const tasks = loadTasksData();
    const taskIndex = tasks.findIndex(task => task._id === id);

    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = { ...tasks[taskIndex], ...data, updatedAt: new Date() };
    tasks[taskIndex] = updatedTask;
    saveTasksData(tasks);
    return updatedTask;
  }

  static delete(id) {
    const tasks = loadTasksData();
    const taskIndex = tasks.findIndex(task => task._id === id);

    if (taskIndex === -1) {
      return null;
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    saveTasksData(tasks);
    return deletedTask[0];
  }
}

export default Task;
