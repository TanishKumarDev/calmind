// ======================================================================
// Session Model (Mongoose)
// Purpose:
// Stores authenticated user session tokens for secure access control.
// Used for login persistence, multi-device login tracking, and
// automatic session expiration.
// ======================================================================

import mongoose, { Document, Schema } from "mongoose";

// ----------------------------------------------------------------------
// Interface: ISession
// Represents a persisted user session entry.
// token      → JWT or custom session token
// expiresAt  → Expiration date/time for automatic logout
// deviceInfo → Optional device metadata (browser, OS, device name)
// lastActive → Last time the session was used (for security monitoring)
// ----------------------------------------------------------------------
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
  lastActive: Date;
}

// ----------------------------------------------------------------------
// Schema: SessionSchema
// Defines how session documents are stored in MongoDB.
// ----------------------------------------------------------------------
const SessionSchema = new Schema<ISession>(
  {
    // User owning this session
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Unique session token string (must match your Auth logic)
    token: {
      type: String,
      required: true,
      unique: true,
    },

    // When this session should auto-expire
    expiresAt: {
      type: Date,
      required: true,
    },

    // Optional device information for session history
    // Example: "Chrome on Windows 10", "iPhone 14 Safari"
    deviceInfo: {
      type: String,
      trim: true,
    },

    // Tracks user activity and can be updated after each request
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// ----------------------------------------------------------------------
// TTL Index (Time To Live):
// MongoDB will automatically delete sessions when expiresAt is reached.
// expireAfterSeconds: 0 means delete exactly at expiration time.
// ----------------------------------------------------------------------
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ----------------------------------------------------------------------
// Mongoose Model Export
// ----------------------------------------------------------------------
export const Session = mongoose.model<ISession>("Session", SessionSchema);

// ======================================================================
// End of Session Model
// ======================================================================
