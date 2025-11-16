// ======================================================================
// Chat History API Route (Next.js 15/16)
// ======================================================================

import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "https://ai-therapist-agent-backend.onrender.com";

// GET /api/chat/sessions/[sessionId]/history
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`,
      {
        headers: {
          Authorization: req.headers.get("authorization") ?? "",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Chat history error:", err);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

// POST /api/chat/sessions/[sessionId]/history
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
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
          Authorization: req.headers.get("authorization") ?? "",
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Chat message error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
