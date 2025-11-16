// ======================================================================
// Inngest Event & Response Types
//
// Purpose:
// Shared type definitions for all AI background workflows triggered via
// Inngest. Ensures consistent structure for chat message analysis,
// session creation, therapeutic memory, and follow-up processing.
// ======================================================================

// ----------------------------------------------------------------------
// Conversational Memory
// Tracks emotional + therapeutic state across a session
// ----------------------------------------------------------------------
export interface TherapyAgentMemory {
  userProfile: {
    emotionalState: string[]; // history of detected emotional states
    riskLevel: number;        // 0–10 severity indicator
    preferences: Record<string, any>; // learned preferences
  };
  sessionContext: {
    conversationThemes: string[]; // detected session themes
    currentTechnique: string | null; // CBT, grounding, etc.
  };
}

// ----------------------------------------------------------------------
// Message-level analysis produced by Gemini AI
// ----------------------------------------------------------------------
export interface MessageAnalysis {
  emotionalState: string;
  riskLevel: number;
  themes: string[];
  recommendedApproach: string;
  progressIndicators: string[];
}

// Generic typed Inngest response wrapper
export interface InngestResponse<T> {
  id: string;
  data: T;
}

// ----------------------------------------------------------------------
// Response returned after processing a single message
// ----------------------------------------------------------------------
export interface InngestMessageData {
  response: string;
  analysis: MessageAnalysis;
  updatedMemory?: TherapyAgentMemory;
}

export type InngestMessageResponse = InngestResponse<InngestMessageData>;

// ----------------------------------------------------------------------
// Session creation data structure
// ----------------------------------------------------------------------
export interface InngestSessionData {
  sessionId: string;
  userId: string;
  startTime: Date;
}

export type InngestSessionResponse = InngestResponse<InngestSessionData>;

// ----------------------------------------------------------------------
// Inngest Event Data Payload
// Supports message events, session events, and analysis context.
// ----------------------------------------------------------------------
export interface InngestEventData {
  message?: string;
  history?: any[];
  memory?: TherapyAgentMemory;
  goals?: string[];
  systemPrompt?: string;
  sessionId?: string;
  userId?: string;
  startTime?: Date;
}

// ----------------------------------------------------------------------
// Root Inngest Event Schema
// ----------------------------------------------------------------------
export interface InngestEvent {
  name: string;       // ex: "therapy/session.message"
  data: InngestEventData;
}
