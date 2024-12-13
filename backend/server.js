import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import errorHandler from "./src/helpers/errorhandler.js";
import taskRoutes from "./src/routes/tasksRoutes.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

// تنظیم EJS
app.set("view engine", "ejs");
app.set("views", "./src/views");


// تنظیم استاتیک برای فایل‌های عمومی
app.use(express.static(path.join(path.resolve(), "src", "public")));

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// error handler middleware
app.use(errorHandler);

// بارگذاری داینامیک مسیرها
const routeFiles = fs.readdirSync("./src/routes");

// مسیریابی مسیرهای لایه‌های مختلف
routeFiles.forEach((file) => {
  // داینامیک ایمپورت فایل‌های مسیریابی
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});

// مسیریابی اضافه برای نمایش فرم و رندرینگ EJS
import userRoutes from "./src/routes/userRoutes.js";
app.use("/users", userRoutes);

import tasksRoutes from "./src/routes/tasksRoutes.js";
app.use("/tasks", tasksRoutes);

app.use(taskRoutes);  // Add task routes


const server = async () => {
  try {
    // اتصال به پایگاه داده
    await connect();

    // راه‌اندازی سرور
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to start server.....", error.message);
    process.exit(1);
  }
};

server();
