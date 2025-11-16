// ======================================================================
// Authentication Routes
// Prefix: /api/auth
//
// Public:
//  POST /register   → Create user account
//  POST /login      → Login and create session
//
// Protected:
//  POST /logout     → Destroy active session
//  GET  /me         → Return user profile
// ======================================================================

import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();

// Public authentication endpoints
router.post("/register", register);
router.post("/login", login);

// Protected endpoints
router.post("/logout", auth, logout);
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
