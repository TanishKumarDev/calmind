// ======================================================================
// Activity Routes
// Prefix: /api/activity
//
// Protected Routes:
//  POST /        → Log a new activity
// ======================================================================

import { Router } from "express";
import { auth } from "../middleware/auth";
import { logActivity } from "../controllers/activityController";

const router = Router();

// All routes require authentication
router.use(auth);

// POST /api/activity  (Log new activity)
router.post("/", logActivity);

export default router;
