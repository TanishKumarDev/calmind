// ======================================================================
// Chat Session Routes
// Prefix: /api/chat
//
// Protected Routes:
//  POST /sessions                    → Create new therapy chat session
//  GET  /sessions/:sessionId         → Fetch session details
//  POST /sessions/:sessionId/messages→ Send a message to the AI
//  GET  /sessions/:sessionId/history → Fetch chat history
// ======================================================================

import { Router } from "express";
import {
  createChatSession,
  sendMessage,
  getChatHistory,
} from "../controllers/chatController";
import { auth } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(auth);

// Create new session
router.post("/sessions", createChatSession);


// Send message in session
router.post("/sessions/:sessionId/messages", sendMessage);

// Get full chat history
router.get("/sessions/:sessionId/history", getChatHistory);

export default router;
