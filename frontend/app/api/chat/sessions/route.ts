// ============================================================================
// Chat API Route: Create a New Chat Session
// Next.js App Router API (Server Endpoint)
// ----------------------------------------------------------------------------
// Forwards request to backend Express API at BACKEND_API_URL
// Requires Authorization header (Bearer token).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

// Backend URL (fallback if env missing)
const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  "https://ai-therapist-agent-backend.onrender.com";

// -----------------------------------------------------------------------------
// POST /api/chat/sessions
// Creates a new chat session for the authenticated user
// -----------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    console.log("[Chat] Creating new chat session...");

    // Extract JWT / Auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Call backend API
    const response = await fetch(`${BACKEND_API_URL}/chat/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    // Handle backend error
    if (!response.ok) {
      let errorMessage = "Failed to create chat session";
      try {
        const err = await response.json();
        errorMessage = err.message || err.error || errorMessage;
      } catch {}
      console.error("[Chat] Backend error:", errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // Return backend success
    const data = await response.json();
    console.log("[Chat] Session created:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Chat] Unexpected error:", error);
    return NextResponse.json(
      { error: "Server error: failed to create chat session" },
      { status: 500 }
    );
  }
}

// ============================================================================
// End of file
// ============================================================================
