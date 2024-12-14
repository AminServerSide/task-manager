import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";

import connect from "./src/db/connect.js";
import errorHandler from "./src/helpers/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// =========================================
// Middleware Configuration
// =========================================

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

// Static files (e.g., CSS, JS, images) configuration
app.use(express.static(path.join(path.resolve(), "src", "public")));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", 
    credentials: true,
  })
);

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Error handler middleware (always added last in the middleware chain)
app.use(errorHandler);

// =========================================
// Dynamic Route Import
// =========================================

// Dynamically import all route files in the `routes` directory
const routeFiles = fs.readdirSync(path.join(path.resolve(), "src", "routes"));
routeFiles.forEach((file) => {
  if (file.endsWith(".js")) {
    import(`./src/routes/${file}`)
      .then((route) => {
        app.use("/api/v1", route.default); 
      })
      .catch((err) => {
        console.error(`Failed to load route file: ${file}`, err.message);
      });
  }
});

// =========================================
// Special Routes for EJS Rendering
// =========================================

// Import user routes for specific frontend rendering
import userRoutes from "./src/routes/userRoutes.js";
app.use("/users", userRoutes);

// Import task routes for specific frontend rendering
import taskRoutes from "./src/routes/tasksRoutes.js";
app.use("/tasks", taskRoutes);

// =========================================
// Initialize the Server
// =========================================

const startServer = async () => {
  try {
    // Connect to the database
    await connect();

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
