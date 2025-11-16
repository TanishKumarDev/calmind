// ======================================================================
// Inngest Client Initialization
//
// Purpose:
// Creates a single Inngest client instance for sending and handling
// workflow events throughout the backend.
//
// Security:
// The Inngest Event Key MUST be stored in environment variables:
//
//   INNGEST_EVENT_KEY="xxxxxxxxxxxx"
//
// Never hardcode keys inside the codebase.
// ======================================================================

import { Inngest } from "inngest";
import { logger } from "../utils/logger";

// ----------------------------------------------------------------------
// Validate required environment variables
// ----------------------------------------------------------------------
if (!process.env.INNGEST_EVENT_KEY) {
  logger.warn(
    "INNGEST_EVENT_KEY is not set. Inngest events may not function in production."
  );
}

// ----------------------------------------------------------------------
// Create Inngest Client
// ----------------------------------------------------------------------
export const inngest = new Inngest({
  id: "ai-therapy-agent",
  eventKey: process.env.INNGEST_EVENT_KEY, // optional for local dev
});

// ----------------------------------------------------------------------
// The functions array will be populated by src/inngest/functions.ts
// ----------------------------------------------------------------------
export const functions: any[] = [];

// ======================================================================
// End of Inngest Client Setup
// ======================================================================
