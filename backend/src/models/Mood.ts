// ======================================================================
// Mood Model (Mongoose)
// Purpose:
// Stores a user's mood score and optional contextual information.
// Helps track emotional patterns for personalized AI therapist insights,
// and supports correlation with activities or triggering events.
// ======================================================================

import mongoose, { Schema, Document } from "mongoose";

// ----------------------------------------------------------------------
// Interface: IMood
// Represents one recorded mood entry for a user.
// score:       Mood intensity (0–100), higher = more positive mood
// note:        Optional reflection text
// context:     Optional situation / trigger description
// activities:  Optional activity IDs or labels associated with mood
// timestamp:   When mood was captured
// createdAt / updatedAt: Added by timestamps option
// ----------------------------------------------------------------------
export interface IMood extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  note?: string;
  context?: string;
  activities?: mongoose.Types.ObjectId[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------------------------
// Schema: moodSchema
// Defines how mood records are stored in MongoDB
// ----------------------------------------------------------------------
const moodSchema = new Schema<IMood>(
  {
    // Reference to the user whose mood is recorded
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Mood score (0 = very negative, 100 = very positive)
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Optional mood reflection
    note: {
      type: String,
      trim: true,
    },

    // Optional contextual information about the mood
    context: {
      type: String,
      trim: true,
    },

    // Optional list of related activities
    // Could store ObjectId values if linking directly to Activity model
    activities: [
      {
        type: String,
        trim: true,
      },
    ],

    // Timestamp of recording; defaults to current time
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ----------------------------------------------------------------------
// Index: Optimizes query performance for mood history
// Sorts newest mood entries first per user
// ----------------------------------------------------------------------
moodSchema.index({ userId: 1, timestamp: -1 });

// ----------------------------------------------------------------------
// Model Export
// ----------------------------------------------------------------------
export const Mood = mongoose.model<IMood>("Mood", moodSchema);

// ======================================================================
// End of Mood Model
// ======================================================================
