import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import userRoutes from "./src/routes/userRoutes.js"; // روت‌های کاربری
import errorHandler from "./src/helpers/errorhandler.js"; // مدیریت خطا

dotenv.config(); // بارگذاری متغیرهای محیطی

const app = express();

// پورت سرور
const port = process.env.PORT || 8000;

// middleware
app.use(
  cors({
    origin: "http://localhost:3000", // آدرس frontend شما
    credentials: true,
  })
);
app.use(express.json()); // برای پردازش JSON در درخواست‌ها
app.use(express.urlencoded({ extended: true })); // برای پردازش داده‌های فرم
app.use(cookieParser()); // برای کار با کوکی‌ها

// استفاده از روت‌های کاربری
app.use("/api/users", userRoutes); // مسیر اصلی روت‌های کاربری، به /api/users اضافه شده است

// middleware مدیریت خطا
app.use(errorHandler);

// راه‌اندازی سرور
const server = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server...", error.message);
    process.exit(1);
  }
};

// شروع سرور
server();
