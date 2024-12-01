import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import path from "path";

const usersFilePath = path.join("data", "users.json");

// خواندن داده‌ها از فایل JSON
const readUsersFromFile = async () => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // اگر فایل موجود نباشد یا مشکلی در خواندن رخ دهد
    return [];
  }
};

// نوشتن داده‌ها در فایل JSON
const writeUsersToFile = async (users) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    throw new Error("Error writing to users file");
  }
};

// حذف کاربر
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const users = await readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users.splice(userIndex, 1);
    await writeUsersToFile(users);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Cannot Delete User" });
  }
});

// دریافت همه کاربران
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await readUsersFromFile();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Cannot get users" });
  }
});
