// ======================================================================
// Main Server Entry - AI Therapy Agent Backend
//
// Responsibilities:
// - Load environment variables
// - Initialize Express API server
// - Connect to MongoDB
// - Register routes + middleware
// - Mount Inngest event handler endpoint
// ======================================================================

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { serve } from "inngest/express";

import { connectDB } from "./utils/db";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";

import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import moodRouter from "./routes/mood";
import activityRouter from "./routes/activity";

import { inngest } from "./inngest/client";
import { functions as inngestFunctions } from "./inngest/functions";

// Load environment variables
// dotenv.config();

// Create Express app
const app = express();

// ----------------------------------------------------------------------
// Global Middleware
// ----------------------------------------------------------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ----------------------------------------------------------------------
// Health Check Route
// ----------------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// ----------------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------------
// Auth: /auth/*
app.use("/auth", authRouter);

// Chat: /chat/*
app.use("/chat", chatRouter);

// Mood Tracking: /mood/*
app.use("/mood", moodRouter);

// Activities: /activity/*
app.use("/activity", activityRouter);

// ----------------------------------------------------------------------
// Inngest Event Handler Endpoint
// ----------------------------------------------------------------------
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: inngestFunctions,
  })
);

// ----------------------------------------------------------------------
// Error Handler Middleware (keep last)
// ----------------------------------------------------------------------
app.use(errorHandler);

// ----------------------------------------------------------------------
// Server Startup
// ----------------------------------------------------------------------
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(
        `Inngest events: http://localhost:${PORT}/api/inngest`
      );
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
