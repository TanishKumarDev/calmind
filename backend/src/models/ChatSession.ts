// ======================================================================
// ChatSession Model (Mongoose)
// Purpose:
// Stores full AI therapy conversation sessions for a user. Each session
// contains multiple messages including optional structured therapeutic
// metadata. Enables tracking conversational context, emotional progress,
// and safety risk levels across sessions.
// ======================================================================

import { Document, Schema, model, Types } from "mongoose";

// ======================================================================
// Interface: IChatMessage
// Describes a single message inside a session.
// role       → Who sent the message (user or assistant)
// content    → Actual message text
// timestamp  → When the message occurred
// metadata   → Optional clinical or therapeutic information
// ======================================================================
export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    analysis?: any;                  // Optional structured analysis result
    currentGoal?: string | null;     // Therapy goal active at this message
    progress?: {
      emotionalState?: string;       // e.g., anxious, calm, hopeful
      riskLevel?: number;            // Numeric mental health risk indicator
    };
  };
}

// ======================================================================
// Interface: IChatSession
// Represents a complete saved conversation session.
// _id        → MongoDB document ID
// sessionId  → External unique session identifier (UUID/string)
// userId     → Reference to the User this session belongs to
// startTime  → When session began
// status     → Lifecycle state (active, completed, archived)
// messages   → Array of message objects
// createdAt, updatedAt automatically added by timestamps
// ======================================================================
export interface IChatSession extends Document {
  _id: Types.ObjectId;
  sessionId: string;
  userId: Types.ObjectId;
  startTime: Date;
  status: "active" | "completed" | "archived";
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ======================================================================
// Sub-Schema: chatMessageSchema
// Defines how messages are stored inside the session document.
// ======================================================================
const chatMessageSchema = new Schema<IChatMessage>({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    analysis: Schema.Types.Mixed, // Flexible, AI-generated analysis
    currentGoal: { type: String, default: null },
    progress: {
      emotionalState: String,
      riskLevel: Number,
    },
  },
});

// ======================================================================
// Schema: chatSessionSchema
// Defines the structure of an AI therapy chat session document.
// ======================================================================
const chatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true, // Allows fast retrieval by session identifier
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimized for finding all sessions of a user
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    messages: [chatMessageSchema],
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt
  }
);

// ======================================================================
// Index: Efficient retrieval of recent sessions for a user
// Sorts by userId ascending, then startTime descending
// Useful for dashboards, analytics, and fetching last session context
// ======================================================================
chatSessionSchema.index({ userId: 1, startTime: -1 });

// ======================================================================
// Export Model
// Provides typed access to the ChatSession collection.
// ======================================================================
export const ChatSession = model<IChatSession>("ChatSession", chatSessionSchema);
