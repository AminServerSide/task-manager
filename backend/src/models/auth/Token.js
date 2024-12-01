import fs from "fs";
import path from "path";

// محل ذخیره‌سازی داده‌های توکن
const tokensDataPath = path.resolve("data", "tokens.json");

// بارگذاری داده‌های توکن‌ها از فایل JSON
const loadTokensData = () => {
  if (!fs.existsSync(tokensDataPath)) {
    fs.writeFileSync(tokensDataPath, JSON.stringify([])); // اگر فایل وجود نداشت، ایجادش کن
  }
  return JSON.parse(fs.readFileSync(tokensDataPath, "utf-8"));
};

// ذخیره‌سازی داده‌های جدید توکن‌ها به فایل JSON
const saveTokensData = (data) => {
  fs.writeFileSync(tokensDataPath, JSON.stringify(data, null, 2));
};

// مدل توکن‌ها
class Token {
  constructor(userId, verificationToken, passwordResetToken, createdAt, expiresAt) {
    this.userId = userId;
    this.verificationToken = verificationToken || "";
    this.passwordResetToken = passwordResetToken || "";
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
  }

  static findOne(query) {
    const tokens = loadTokensData();
    return tokens.find(token => token.userId === query.userId);
  }

  static create(data) {
    const tokens = loadTokensData();
    const newToken = new Token(data.userId, data.verificationToken, data.passwordResetToken, data.createdAt, data.expiresAt);
    tokens.push(newToken);
    saveTokensData(tokens);
    return newToken;
  }

  static update(query, data) {
    const tokens = loadTokensData();
    const tokenIndex = tokens.findIndex(token => token.userId === query.userId);

    if (tokenIndex === -1) {
      return null;
    }

    const updatedToken = { ...tokens[tokenIndex], ...data };
    tokens[tokenIndex] = updatedToken;
    saveTokensData(tokens);
    return updatedToken;
  }

  static delete(query) {
    const tokens = loadTokensData();
    const tokenIndex = tokens.findIndex(token => token.userId === query.userId);

    if (tokenIndex === -1) {
      return null;
    }

    const deletedToken = tokens.splice(tokenIndex, 1);
    saveTokensData(tokens);
    return deletedToken[0];
  }
}

export default Token;
