import { NextRequest, NextResponse } from "next/server";

//
// Base URL of Backend API
// Can come from .env or fallback to Render deployment
//
const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "https://ai-therapist-agent-backend.onrender.com";

//
// Next.js 16+ Route Handler for GET /api/chat/sessions/[sessionId]/history
// IMPORTANT CHANGE:
// params is now wrapped in a Promise, so we must `await context.params`
//
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    //
    // Extract dynamic route parameter (sessionId)
    // Next.js 16: params is async → `await context.params`
    //
    const { sessionId } = await context.params;
    console.log(`Getting chat history for session ${sessionId}`);

    //
    // Call Backend REST API
    // GET /chat/sessions/:sessionId/history
    //
    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Forward cookies so user stays authenticated
          Cookie: req.headers.get("cookie") || "",
        },
      }
    );

    //
    // If backend sends an error, propagate it back
    //
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Failed to get chat history:", error);

      return NextResponse.json(
        { error: error.error || "Failed to get chat history" },
        { status: response.status }
      );
    }

    //
    // Normalize backend chat messages structure
    //
    const data = await response.json();
    console.log("Chat history retrieved successfully:", data);

    const formattedMessages = data.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error getting chat history:", error);

    return NextResponse.json(
      { error: "Failed to get chat history" },
      { status: 500 }
    );
  }
}
