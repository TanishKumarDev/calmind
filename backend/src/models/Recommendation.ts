// ======================================================================
// Recommendation Model
//
// Purpose:
// Stores generated personalized activity recommendations
// for later use in UI or periodic health progress review.
// ======================================================================

import { Schema, model, Types, Document } from "mongoose";

export interface IRecommendation extends Document {
  userId: Types.ObjectId;
  items: Record<string, any>[]; // each recommendation is an object
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Array of "Mixed" recommendation objects
    items: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

export const Recommendation = model<IRecommendation>(
  "Recommendation",
  recommendationSchema
);
