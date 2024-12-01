import fs from "fs/promises";
import path from "path";

// مسیر فایل JSON
const filePath = path.resolve("data/tasks.json");

// تابع برای خواندن داده‌ها از فایل JSON
export const readData = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // اگر فایل وجود نداشت، یک آرایه خالی برمی‌گرداند
    return [];
  }
};

// تابع برای نوشتن داده‌ها به فایل JSON
export const writeData = async (data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
};
