// ============================================================================
// Chat API Route: Get Chat History for a Session
// Next.js App Router API (Server Endpoint)
// ----------------------------------------------------------------------------
// GET /api/chat/sessions/[sessionId]/history
// Next.js 15/16 requires: params is a Promise -> await context.params
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "https://ai-therapist-agent-backend.onrender.com";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> } // FIXED TYPE
) {
  try {
    const { sessionId } = await context.params;

    console.log(`[Chat] Fetching chat history for session ${sessionId}`);

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: request.headers.get("authorization") || "",
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error || "Failed to fetch chat history" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Chat] Unexpected error:", error);
    return NextResponse.json(
      { error: "Server error: failed to fetch chat history" },
      { status: 500 }
    );
  }
}
