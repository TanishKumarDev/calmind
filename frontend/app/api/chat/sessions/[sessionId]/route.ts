// ======================================================================
// Chat Session History + Message API Route
// Handles:
//  - GET  → fetch chat history for a session
//  - POST → send a new message to a chat session
// This file proxies the request to your Express backend.
//
// Path: /api/chat/sessions/[sessionId]/history
// ======================================================================

import { NextRequest, NextResponse } from "next/server";

// Backend API URL (Render / localhost fallback)
const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "https://ai-therapist-agent-backend.onrender.com";

// ======================================================================
// GET /api/chat/sessions/[sessionId]/history
// Fetches chat session history from backend
// ======================================================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params; // <- required change

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

// ======================================================================
// POST /api/chat/sessions/[sessionId]/history
// Send message to AI chat session
// ======================================================================
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params; // <- required change
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.get("Authorization") ?? "",
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error sending chat message:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
