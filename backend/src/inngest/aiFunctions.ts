// ======================================================================
// Inngest Functions: AI Processing for Therapy Chat + Mood + Activities
//
// Purpose:
// 1) Process individual chat messages for therapeutic insights
// 2) Analyze entire therapy sessions
// 3) Generate personalized activity recommendations
//
// Improvements from original:
// - No hard-coded API keys
// - Safe JSON parsing (prevents crashes)
// - Updates ChatSession with analysis metadata
// - Stores generated activity recommendations in DB
// ======================================================================

import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../utils/logger";
import { ChatSession } from "../models/ChatSession";
import { saveRecommendationsForUser } from "../services/recommendationService";
import { safeJson } from "../utils/jsonSafe";

// ----------------------------------------------------------------------
// Initialize Gemini Model
// Requires: process.env.GEMINI_API_KEY
// ----------------------------------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// ======================================================================
// Function: Process Chat Message
// Event: therapy/session.message
//
// Updates ChatSession with analysis + therapeutic assistant response
// ======================================================================
export const processChatMessage = inngest.createFunction(
  { id: "process-chat-message" },
  { event: "therapy/session.message" },
  async ({ event, step }) => {
    const { sessionId, message, history, systemPrompt } = event.data;

    logger.info("Inngest: Processing chat message", { sessionId });

    // 1) Analyze message using Gemini
    const analysis = await step.run("analyze-message", async () => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Analyze this message and return JSON only:

Message: ${message}

Required structure:
{
  "emotionalState": "string",
  "themes": ["string"],
  "riskLevel": number,
  "recommendedApproach": "string",
  "progressIndicators": ["string"]
}`;

        const result = await model.generateContent(prompt);
        return safeJson(result.response.text());
      } catch (err) {
        logger.error("AI analysis failed; using fallback", err);
        return {
          emotionalState: "neutral",
          themes: [],
          riskLevel: 0,
          recommendedApproach: "supportive",
          progressIndicators: [],
        };
      }
    });

    // 2) Generate assistant response
    const response = await step.run("generate-response", async () => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `${systemPrompt}

User: ${message}
Analysis: ${JSON.stringify(analysis)}

Respond therapeutically with empathy and safety.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (err) {
        logger.error("AI failed to generate response; using fallback", err);
        return "I hear you. I'm here with you. Could you tell me more about what you're feeling right now?";
      }
    });

    // 3) Update ChatSession in MongoDB
    await step.run("store-session-update", async () => {
      await ChatSession.updateOne(
        { sessionId },
        {
          $push: {
            messages: [
              { role: "user", content: message, timestamp: new Date() },
              {
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
              },
            ],
          },
        }
      );
      logger.info("ChatSession updated with AI response + analysis", { sessionId });
    });

    return { response, analysis };
  }
);

// ======================================================================
// Function: Analyze Therapy Session (full conversation)
// Event: therapy/session.created
// ======================================================================
export const analyzeTherapySession = inngest.createFunction(
  { id: "analyze-therapy-session" },
  { event: "therapy/session.created" },
  async ({ event, step }) => {
    const { sessionId, notes, transcript } = event.data;
    logger.info("Inngest: Analyzing full session", { sessionId });

    const content = notes || transcript || "";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Analyze the following therapy session:

${content}

Return JSON:
{
  "themes": ["string"],
  "emotionalSummary": "string",
  "riskFindings": ["string"],
  "followUpSuggestions": ["string"]
}`;

    const result = await model.generateContent(prompt);
    const analysis = safeJson(result.response.text());

    logger.info("Session analysis complete", { sessionId });
    return { message: "Session analysis complete", analysis };
  }
);

// ======================================================================
// Function: Generate Personalized Activity Recommendations
// Event: mood/updated
// ======================================================================
export const generateActivityRecommendations = inngest.createFunction(
  { id: "generate-activity-recommendations" },
  { event: "mood/updated" },
  async ({ event, step }) => {
    const { userId, mood, context } = event.data;
    logger.info("Inngest: Generating recommendations", { userId, mood });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Provide 3-5 activity recommendations for a person with a mood score of ${mood}.
Context: ${context || "none"}
Return JSON:
[
  {
    "name": "string",
    "reason": "string",
    "expectedBenefit": "string",
    "duration": "string",
    "difficulty": "easy|medium|hard"
  }
]`;

    const result = await model.generateContent(prompt);
    const recommendations = safeJson(result.response.text()) || [];

    await saveRecommendationsForUser(userId, recommendations);

    return {
      message: "Recommendations generated and stored",
      recommendations,
    };
  }
);

// Export list required by Inngest framework
export const functions = [
  processChatMessage,
  analyzeTherapySession,
  generateActivityRecommendations,
];
