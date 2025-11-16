// ============================================================================
// Chat API Route: Send Message to Existing Session
// Next.js App Router API (Server Endpoint)
// ----------------------------------------------------------------------------
// Accepts POST requests to send a user message to a chat session.
// Forwards request to backend Express API at BACKEND_API_URL.
// Uses dynamic route param `[sessionId]`.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

// Backend API base URL (fallback if env missing)
const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "https://ai-therapist-agent-backend.onrender.com";

// -----------------------------------------------------------------------------
// POST /api/chat/sessions/[sessionId]/messages
// Body: { message: string }
// -----------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> } // Next.js 15+ correct typing
) {
  try {
    // Extract sessionId from dynamic params (must await)
    const { sessionId } = await context.params;

    // Parse incoming request JSON
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    console.log(`[Chat] Sending message to session ${sessionId}`);

    // Forward message to backend API
    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass auth token if present (optional)
          Authorization: request.headers.get("authorization") || "",
        },
        body: JSON.stringify({ message }),
      }
    );

    // Handle backend failure
    if (!response.ok) {
      let errorMessage = "Failed to send message";
      try {
        const err = await response.json();
        errorMessage = err.message || err.error || errorMessage;
      } catch {}

      console.error(`[Chat] Backend error: ${errorMessage}`);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // Success: return AI response from backend
    const data = await response.json();
    console.log("[Chat] Message sent successfully");
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Chat] Unexpected error:", error);
    return NextResponse.json(
      { error: "Server error: failed to send message" },
      { status: 500 }
    );
  }
}

// ============================================================================
// End of file: route.ts
// ============================================================================
