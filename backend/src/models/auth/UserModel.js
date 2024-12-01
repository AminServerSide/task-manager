import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

// محل ذخیره‌سازی داده‌های کاربران
const usersDataPath = path.resolve("data", "users.json");

// بارگذاری داده‌های کاربران از فایل JSON
const loadUsersData = () => {
  if (!fs.existsSync(usersDataPath)) {
    fs.writeFileSync(usersDataPath, JSON.stringify([])); // اگر فایل وجود نداشت، ایجادش کن
  }
  return JSON.parse(fs.readFileSync(usersDataPath, "utf-8"));
};

// ذخیره‌سازی داده‌های جدید کاربران به فایل JSON
const saveUsersData = (data) => {
  fs.writeFileSync(usersDataPath, JSON.stringify(data, null, 2));
};

// مدل کاربر
class User {
  constructor(name, email, password, photo, bio, role, isVerified) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.photo = photo || "https://avatars.githubusercontent.com/u/19819005?v=4";
    this.bio = bio || "I am a new user.";
    this.role = role || "user";
    this.isVerified = isVerified || false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static findOne(query) {
    const users = loadUsersData();
    return users.find(user => user.email === query.email);
  }

  static findById(id) {
    const users = loadUsersData();
    return users.find(user => user._id === id);
  }

  static create(data) {
    const users = loadUsersData();
    const newUser = new User(data.name, data.email, data.password, data.photo, data.bio, data.role, data.isVerified);
    newUser._id = Date.now().toString(); // استفاده از زمان به عنوان شناسه منحصر به فرد
    users.push(newUser);
    saveUsersData(users);
    return newUser;
  }

  static update(id, data) {
    const users = loadUsersData();
    const userIndex = users.findIndex(user => user._id === id);

    if (userIndex === -1) {
      return null;
    }

    const updatedUser = { ...users[userIndex], ...data, updatedAt: new Date() };
    users[userIndex] = updatedUser;
    saveUsersData(users);
    return updatedUser;
  }

  static delete(id) {
    const users = loadUsersData();
    const userIndex = users.findIndex(user => user._id === id);

    if (userIndex === -1) {
      return null;
    }

    const deletedUser = users.splice(userIndex, 1);
    saveUsersData(users);
    return deletedUser[0];
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(inputPassword, storedPassword) {
    return bcrypt.compare(inputPassword, storedPassword);
  }
}

export default User;
