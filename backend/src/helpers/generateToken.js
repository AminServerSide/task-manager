import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

// استفاده از شناسه کاربر برای ایجاد توکن
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
