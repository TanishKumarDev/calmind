// ======================================================================
// MongoDB Database Connection Utility (Mongoose)
//
// Purpose:
// Creates and manages a single MongoDB connection instance for the app.
// Used at server startup from index.ts to ensure database availability.
// ======================================================================

import mongoose from "mongoose";
import { logger } from "./logger";

// ----------------------------------------------------------------------
// MongoDB URI
// Must be set in .env: MONGODB_URI=mongodb+srv://...
// Avoid hardcoding credentials in code.
// ----------------------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error("Missing MONGODB_URI in environment configuration");
  throw new Error("MONGODB_URI is not defined");
}

// ----------------------------------------------------------------------
// connectDB()
// Establishes a connection to MongoDB Atlas.
// Terminates process if connection fails at startup.
// ----------------------------------------------------------------------
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1); // Exit process to prevent running without DB
  }
};

// ======================================================================
// End of Database Utility
// ======================================================================
