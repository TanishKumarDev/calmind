// ======================================================================
// Inngest: Workflow Function Registry
//
// Purpose:
// Registers all Inngest workflow functions used by the AI Therapy system.
// This includes:
// 1) Therapy session event processing
// 2) Mood update analysis
// 3) Activity completion processing
// 4) Advanced AI functions (from aiFunctions.ts)
//
// All functions are exported as a single array to be used in the Inngest
// runtime setup. Example:
//   import { functions } from "./inngest/functions";
// ======================================================================

import { inngest } from "./client";
import { functions as aiFunctions } from "./aiFunctions";
import { logger } from "../utils/logger";

// ======================================================================
// Therapy Session Handler
// Event: therapy/session.created
// ======================================================================
export const therapySessionHandler = inngest.createFunction(
  { id: "therapy-session-handler" },
  { event: "therapy/session.created" },
  async ({ event, step }) => {
    await step.run("log-session-creation", async () => {
      logger.info("Inngest: therapy session created", { data: event.data });
    });

    const processedData = await step.run("process-session-data", async () => {
      return {
        ...event.data,
        processedAt: new Date().toISOString(),
      };
    });

    if (event.data.requiresFollowUp) {
      await step.run("send-follow-up", async () => {
        logger.info("Inngest: follow-up required for session", {
          sessionId: event.data.sessionId,
        });
      });
    }

    return {
      message: "Therapy session processed successfully",
      sessionId: event.data.sessionId,
      processedData,
    };
  }
);

// ======================================================================
// Mood Tracking Handler
// Event: mood/updated
// ======================================================================
export const moodTrackingHandler = inngest.createFunction(
  { id: "mood-tracking-handler" },
  { event: "mood/updated" },
  async ({ event, step }) => {
    await step.run("log-mood-update", async () => {
      logger.info("Inngest: mood updated", { data: event.data });
    });

    const analysis = await step.run("analyze-mood-patterns", async () => {
      return {
        trend: "improving", // Placeholder: Replace with historical analysis
        recommendations: ["Consider scheduling a check-in therapy session"],
      };
    });

    // If critical mood score detected (scale depends on UI)
    if (event.data.mood < 20) {
      await step.run("trigger-alert", async () => {
        logger.warn("Inngest: critical mood detected", {
          userId: event.data.userId,
          mood: event.data.mood,
        });
      });
    }

    return {
      message: "Mood update processed",
      analysis,
    };
  }
);

// ======================================================================
// Activity Completion Handler
// Event: activity/completed
// ======================================================================
export const activityCompletionHandler = inngest.createFunction(
  { id: "activity-completion-handler" },
  { event: "activity/completed" },
  async ({ event, step }) => {
    await step.run("log-activity", async () => {
      logger.info("Inngest: activity completed", { data: event.data });
    });

    const progress = await step.run("update-progress", async () => {
      return {
        completedActivities: 1, // Placeholder logic
        totalPoints: 10,
      };
    });

    const achievements = await step.run("check-achievements", async () => {
      return {
        newAchievements: ["First Activity Completed"], // Placeholder
      };
    });

    return {
      message: "Activity completion processed",
      progress,
      achievements,
    };
  }
);

// ======================================================================
// Export All Functions as a Single Registry Array
// Used by Inngest runtime on server startup
// ======================================================================
export const functions = [
  therapySessionHandler,
  moodTrackingHandler,
  activityCompletionHandler,
  ...aiFunctions, // Includes: processChatMessage, analyzeTherapySession, generateActivityRecommendations
];

// ======================================================================
// End of Inngest Function Registry
// ======================================================================
