// ======================================================================
// Mood Controller
// Purpose:
// Handles creation of user mood entries to track emotional well-being
// over time. Sends mood update events to Inngest for background analysis,
// streak tracking, and mood-insight generation.
// ======================================================================

import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { logger } from "../utils/logger";
import { sendMoodUpdateEvent } from "../utils/inngestEvents";

// ======================================================================
// Controller: createMood
// Route: POST /api/mood
//
// Expected Request Body:
// score       → numeric mood score (0–100)
// note        → optional note explaining feelings/thoughts
// context     → optional text describing situation or triggers
// activities  → optional array of activity identifiers that influenced mood
//
// Authentication Required:
// req.user must be populated by auth middleware.
// ======================================================================
export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { score, note, context, activities } = req.body;
    const userId = req.user?._id;

    // --------------------------------------------------------------
    // Authentication Check
    // --------------------------------------------------------------
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // --------------------------------------------------------------
    // Create Mood Entry
    // --------------------------------------------------------------
    const mood = new Mood({
      userId,
      score,
      note,
      timestamp: new Date(),
      // context and activities are optional, only set if provided
      ...(context && { context }),
      ...(activities && { activities }),
    });

    await mood.save();
    logger.info(`Mood entry created for user ${userId}`);

    // --------------------------------------------------------------
    // Emit Inngest Event for async processing
    // --------------------------------------------------------------
    await sendMoodUpdateEvent({
      userId,
      mood: score,
      note,
      context,
      activities,
      timestamp: mood.timestamp,
    });

    // --------------------------------------------------------------
    // API Response
    // --------------------------------------------------------------
    return res.status(201).json({
      success: true,
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================================
// End of Mood Controller
// ======================================================================
