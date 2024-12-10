import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs/promises"; 
import path from "node:path";
import errorHandler from "./src/helpers/errorHandler.js";
import userRoutes from "./src/routes/userRoutes.js"; 

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// Set template engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src/views"));

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 

// Error handling middleware
app.use(errorHandler);

// Static file directory
app.use(express.static(path.join(path.resolve(), "public")));

// Add static route for user-related operations
app.use("/", userRoutes);

// Dynamically load additional routes
const loadRoutes = async () => {
  const routeFiles = await fs.readdir("./src/routes");
  for (const file of routeFiles) {
    const route = await import(`./src/routes/${file}`); 
    app.use("/api/v1", route.default); 
  }
};

const server = async () => {
  try {
    await connect(); 
    await loadRoutes(); 

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`); 
    });
  } catch (error) {
    console.error("Failed to start server...", error.message);
    process.exit(1); 
  }
};

server();
