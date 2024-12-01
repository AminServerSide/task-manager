import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const usersFilePath = path.join("data", "users.json");

// توابع کمکی
const readUsersFromFile = async () => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsersToFile = async (users) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    throw new Error("Error writing to users file");
  }
};

// تولید توکن
const generateToken = (id) => {
  return jwt.sign({ id }, "mysecretkey", { expiresIn: "30d" });
};

// **ثبت نام کاربر**
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const users = await readUsersFromFile();
  const userExists = users.find((user) => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
    role: "user",
    photo: "",
    bio: "",
    isVerified: false,
  };

  users.push(newUser);
  await writeUsersToFile(users);

  const token = generateToken(newUser.id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: false,
  });

  res.status(201).json({
    ...newUser,
    token,
  });
});

// **ورود به سیستم**
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = await readUsersFromFile();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found, sign up!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    ...user,
    token,
  });
});

// **خروج از سیستم**
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "User logged out" });
});

// **دریافت اطلاعات کاربر**
export const getUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please login!" });
  }

  const decoded = jwt.verify(token, "mysecretkey");

  const users = await readUsersFromFile();
  const user = users.find((u) => u.id === decoded.id);

  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// **به‌روزرسانی اطلاعات کاربر**
export const updateUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please login!" });
  }

  const decoded = jwt.verify(token, "mysecretkey");

  const users = await readUsersFromFile();
  const userIndex = users.findIndex((u) => u.id === decoded.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = {
    ...users[userIndex],
    ...req.body,
  };

  users[userIndex] = updatedUser;
  await writeUsersToFile(users);

  res.status(200).json(updatedUser);
});

// **تغییر رمز عبور**
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please login!" });
  }

  const decoded = jwt.verify(token, "mysecretkey");

  const users = await readUsersFromFile();
  const user = users.find((u) => u.id === decoded.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await writeUsersToFile(users);

  res.status(200).json({ message: "Password changed successfully" });
});

// **فراموشی رمز عبور**
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const users = await readUsersFromFile();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create a password reset token (for demonstration)
  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await writeUsersToFile(users);

  res.status(200).json({ message: "Password reset token sent" });
});

// **ریست کردن رمز عبور**
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const users = await readUsersFromFile();
  const user = users.find(
    (u) =>
      u.resetPasswordToken === resetPasswordToken &&
      u.resetPasswordExpires > Date.now()
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await writeUsersToFile(users);

  res.status(200).json({ message: "Password reset successfully" });
});

// **وضعیت ورود**
export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ loggedIn: false });
  }

  try {
    jwt.verify(token, "mysecretkey");
    res.status(200).json({ loggedIn: true });
  } catch (error) {
    res.status(200).json({ loggedIn: false });
  }
});

// **تایید ایمیل**
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const users = await readUsersFromFile();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isVerified = true;

  await writeUsersToFile(users);

  res.status(200).json({ message: "Email verified successfully" });
});

// **تایید کاربر با کد تایید ایمیل**
export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  const users = await readUsersFromFile();
  const user = users.find((u) => u.id === verificationToken);

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  user.isVerified = true;

  await writeUsersToFile(users);

  res.status(200).json({ message: "User verified successfully" });
});
