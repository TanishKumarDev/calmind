// ======================================================================
// Activity Model (Mongoose)
// Purpose:
// Stores mental-wellness related activities performed by a user.
// Examples: meditation, walking, journaling, therapy session, etc.
//
// Why this model?
// Helps track habits and progress to improve personalized AI therapy
// recommendations and mood correlations.
// ======================================================================

import mongoose, { Document, Schema } from "mongoose";

// ----------------------------------------------------------------------
// Interface: IActivity
// Represents the TypeScript structure for an Activity document.
// Document ensures Mongoose-specific fields (like _id) are included.
// ----------------------------------------------------------------------
export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User performing the activity
  type: string;                    // Activity category
  name: string;                    // Custom or predefined name for the activity
  description?: string;            // Optional detailed notes
  duration?: number;               // Optional duration in minutes
  timestamp: Date;                 // When the activity was done
}

// ----------------------------------------------------------------------
// Mongoose Schema definition
// Defines how data is stored in MongoDB
// ----------------------------------------------------------------------
const activitySchema = new Schema<IActivity>(
  {
    // User performing the activity. Indexed for fast lookups by user.
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",       // Reference: connects Activity → User model
      required: true,
      index: true,
    },

    // Category of activity. Enum allows only valid controlled values.
    type: {
      type: String,
      required: true,
      enum: [
        "meditation",
        "exercise",
        "walking",
        "reading",
        "journaling",
        "therapy",
      ],
    },

    // Name/title for the activity (customizable, user-facing)
    name: {
      type: String,
      required: true,
    },

    // Optional description containing details or thoughts
    description: {
      type: String,
    },

    // Duration in minutes, must be non-negative if provided
    duration: {
      type: Number,
      min: 0,
    },

    // Timestamp when activity occurred. Defaults to current date/time.
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

// ----------------------------------------------------------------------
// Index: Optimizes sorting of user activity history
// userId ASC, timestamp DESC
// e.g., Fetch most recent activities quickly
// ----------------------------------------------------------------------
activitySchema.index({ userId: 1, timestamp: -1 });

// ----------------------------------------------------------------------
// Mongoose Model
// Provides CRUD functions for Activity collection
// ----------------------------------------------------------------------
export const Activity = mongoose.model<IActivity>("Activity", activitySchema);

// ======================================================================
// End of Activity Model
// ======================================================================
