// ======================================================================
// Mood Tracking Routes
// Prefix: /api/mood
//
// Protected Routes:
//  POST /        → Log a mood entry
// ======================================================================

import { Router } from "express";
import { auth } from "../middleware/auth";
import { createMood } from "../controllers/moodController";

const router = Router();

// All routes require authentication
router.use(auth);

// POST /api/mood  (Track new mood)
router.post("/", createMood);

export default router;
