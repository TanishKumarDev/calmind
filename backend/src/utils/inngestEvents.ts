// ======================================================================
// Inngest Event Dispatch Utility
//
// Purpose:
// Provides reusable helper functions for sending analytics and processing
// events to Inngest. Used for background workflows such as:
// - Activity insights and habit scoring
// - Mood trend analysis and risk detection
// - Therapy chat progress evaluation
//
// Usage Example:
//   await sendMoodUpdateEvent({ userId, mood, note });
// ======================================================================

import { inngest } from "../inngest/client";
import { logger } from "./logger";

// ----------------------------------------------------------------------
// Event: Therapy Session Created
// Triggered when a new therapy chat session begins.
// ----------------------------------------------------------------------
export const sendTherapySessionEvent = async (sessionData: any) => {
  try {
    await inngest.send({
      name: "therapy/session.created",
      data: {
        sessionId: sessionData.id,
        userId: sessionData.userId,
        timestamp: new Date().toISOString(),
        requiresFollowUp: sessionData.requiresFollowUp ?? false,
        sessionType: sessionData.type ?? "standard",
        duration: sessionData.duration ?? null,
        notes: sessionData.notes ?? null,
        ...sessionData,
      },
    });

    logger.info("Inngest: therapy session event sent");
  } catch (error) {
    logger.error("Inngest: failed to send therapy session event", error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Event: Mood Updated
// Triggered when a user logs a new mood entry.
// ----------------------------------------------------------------------
export const sendMoodUpdateEvent = async (moodData: any) => {
  try {
    await inngest.send({
      name: "mood/updated",
      data: {
        userId: moodData.userId,
        mood: moodData.mood, // expected numeric score
        timestamp: new Date().toISOString(),
        context: moodData.context ?? null,
        activities: moodData.activities ?? [],
        note: moodData.note ?? null,
        ...moodData,
      },
    });

    logger.info("Inngest: mood update event sent");
  } catch (error) {
    logger.error("Inngest: failed to send mood update event", error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Event: Activity Completed
// Triggered when a user logs or completes an activity.
// ----------------------------------------------------------------------
export const sendActivityCompletionEvent = async (activityData: any) => {
  try {
    await inngest.send({
      name: "activity/completed",
      data: {
        userId: activityData.userId,
        activityId: activityData.id,
        timestamp: new Date().toISOString(),
        duration: activityData.duration ?? null,
        difficulty: activityData.difficulty ?? null,
        feedback: activityData.feedback ?? null,
        ...activityData,
      },
    });

    logger.info("Inngest: activity completion event sent");
  } catch (error) {
    logger.error("Inngest: failed to send activity completion event", error);
    throw error;
  }
};

// ======================================================================
// End of Inngest Event Utility
// ======================================================================
