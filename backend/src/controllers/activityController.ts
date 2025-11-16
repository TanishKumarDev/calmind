// ======================================================================
// Activity Controller
// Purpose:
// Handles creation/logging of wellness activities performed by a user.
// Stores activities for progress tracking and sends an event to Inngest
// for background processing, scoring, habit evaluation, or streak logic.
// ======================================================================

import { Request, Response, NextFunction } from "express";
import { Activity } from "../models/Activity";
import { logger } from "../utils/logger";
import { sendActivityCompletionEvent } from "../utils/inngestEvents";

// ======================================================================
// Controller: logActivity
// Route: POST /api/activity
//
// Expected body fields:
// type        → activity category (meditation, exercise, journaling, etc.)
// name        → custom label/title for the session
// description → optional notes
// duration    → optional number (in minutes)
// difficulty  → optional scale if supported
// feedback    → optional user reflection
//
// Authentication:
// req.user is expected to be set by auth middleware before reaching here.
//
// Behavior:
// 1) Validates authentication
// 2) Creates and saves Activity document
// 3) Sends Inngest event for async analysis or habit tracking
// ======================================================================
export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract activity data from request body
    const { type, name, description, duration, difficulty, feedback } = req.body;

    // The auth middleware should attach user information to req.user
    const userId = req.user?._id;

    // --------------------------------------------------------------
    // Check if user is authenticated
    // --------------------------------------------------------------
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // --------------------------------------------------------------
    // Create new Activity instance
    // --------------------------------------------------------------
    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(),
    });

    // Save to database
    await activity.save();
    logger.info(`Activity logged for user ${userId}`);

    // --------------------------------------------------------------
    // Send event to Inngest for async background processing
    // --------------------------------------------------------------
    await sendActivityCompletionEvent({
      userId,
      id: activity._id,
      type,
      name,
      duration,
      difficulty,
      feedback,
      timestamp: activity.timestamp,
    });

    // --------------------------------------------------------------
    // Respond to client
    // --------------------------------------------------------------
    return res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    // Pass errors to global handler middleware
    next(error);
  }
};

// ======================================================================
// End of Activity Controller
// ======================================================================
