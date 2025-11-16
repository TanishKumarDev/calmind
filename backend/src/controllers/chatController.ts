// ======================================================================
// Chat Controller
// Purpose:
// Handles chat session creation, messaging, and retrieving history for
// therapeutic AI chat interactions. Uses Gemini via aiService for
// analysis & responses and Inngest for background processing.
// ======================================================================

import { Request, Response } from "express";
import { ChatSession } from "../models/ChatSession";
import { User } from "../models/User";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import { inngest } from "../inngest/client";
import { generateTherapeuticResponse } from "../services/aiService";

// ======================================================================
// Create a New Chat Session
// Route: POST /api/chat/create
// ======================================================================
export const createChatSession = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new Types.ObjectId(req.user._id);
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const sessionId = uuidv4();

    const session = new ChatSession({
      sessionId,
      userId,
      startTime: new Date(),
      status: "active",
      messages: [],
    });

    await session.save();
    logger.info(`Chat session created: ${sessionId}`);

    return res.status(201).json({
      success: true,
      sessionId,
      message: "Chat session created",
    });
  } catch (error) {
    logger.error("Error creating chat session", error);
    return res.status(500).json({ message: "Failed to create chat session" });
  }
};

// ======================================================================
// Send Message in a Chat Session
// Route: POST /api/chat/message/:sessionId
// ======================================================================
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    const session = await ChatSession.findOne({ sessionId });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Save user's message
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Generate AI therapeutic response
    const { response, analysis } = await generateTherapeuticResponse({
      message,
      history: session.messages,
    });

    // Save assistant reply
    session.messages.push({
      role: "assistant",
      content: response,
      timestamp: new Date(),
      metadata: {
        analysis,
        progress: {
          emotionalState: analysis.emotionalState,
          riskLevel: analysis.riskLevel,
        },
      },
    });

    await session.save();

    // Send async processing event to Inngest
    await inngest.send({
      name: "therapy/session.message",
      data: { sessionId, userId: session.userId, message, analysis },
    });

    return res.json({
      response,
      analysis,
      metadata: {
        emotionalState: analysis.emotionalState,
        riskLevel: analysis.riskLevel,
      },
    });
  } catch (error) {
    logger.error("Error sending message", error);
    return res.status(500).json({ message: "Error sending message" });
  }
};

// ======================================================================
// Get Chat History
// Route: GET /api/chat/history/:sessionId?details=full
// ======================================================================
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const details = req.query.details;
    const userId = req.user?._id;

    const session = await ChatSession.findOne({ sessionId });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.userId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (details === "full") {
      return res.json({
        sessionId: session.sessionId,
        startTime: session.startTime,
        status: session.status,
        messages: session.messages,
      });
    }

    return res.json(session.messages);
  } catch (error) {
    logger.error("Error retrieving chat history", error);
    return res.status(500).json({ message: "Error retrieving history" });
  }
};
