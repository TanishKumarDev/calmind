// ======================================================================
// User Model (Mongoose)
// Purpose:
// Represents a registered user of the Calmind AI Therapist system.
// Stores core identity fields and encrypted password (hashed).
// ======================================================================

import mongoose, { Document, Schema } from "mongoose";

// ----------------------------------------------------------------------
// Interface: IUser
// Represents the TypeScript structure of a user document.
// password should always be stored hashed, never plain text.
// ----------------------------------------------------------------------
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Hashed password only
}

// ----------------------------------------------------------------------
// Schema: UserSchema
// Defines how user documents are stored in MongoDB.
// ----------------------------------------------------------------------
const UserSchema = new Schema<IUser>(
  {
    // Full name of the user
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Unique email address used for authentication
    email: {
      type: String,
      required: true,
      unique: true,        // Unique constraint already applied here
      lowercase: true,
      trim: true,
    },

    // Hashed password string (encrypted before save)
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ----------------------------------------------------------------------
// IMPORTANT: Removed duplicate index definition to avoid warnings
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Mongoose Model Export
// ----------------------------------------------------------------------
export const User = mongoose.model<IUser>("User", UserSchema);

// ======================================================================
// End of User Model
// ======================================================================
