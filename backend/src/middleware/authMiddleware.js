import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// بارگذاری داده‌های کاربران از فایل JSON
const usersData = JSON.parse(fs.readFileSync(path.resolve("data", "users.json")));

// Middleware برای احراز هویت و تایید توکن
export const protect = asyncHandler(async (req, res, next) => {
  try {
    // بررسی وجود توکن در کوکی
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Not authorized, please login!" });
      return;
    }

    // اعتبارسنجی توکن
    const decoded = jwt.verify(token, "mysecretkey");

    // جستجو برای کاربر در فایل JSON بر اساس ID
    const user = usersData.find(u => u.id === decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // قرار دادن اطلاعات کاربر در درخواست
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
});

// Middleware برای تایید اینکه کاربر ادمین است
export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ message: "Only admins can do this!" });
});

// Middleware برای تایید اینکه کاربر دارای نقش "creator" یا "admin" است
export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (
    (req.user && req.user.role === "creator") ||
    (req.user && req.user.role === "admin")
  ) {
    next();
    return;
  }
  res.status(403).json({ message: "Only creators can do this!" });
});

// Middleware برای تایید اینکه کاربر ایمیل خود را تایید کرده است
export const verifiedMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
    return;
  }
  res.status(403).json({ message: "Please verify your email address!" });
});
