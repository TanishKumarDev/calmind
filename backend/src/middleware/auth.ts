// ======================================================================
// Auth Middleware (JWT + Session Validation)
//
// Purpose:
// Ensures that a request is made by an authenticated user. Validates the
// JWT token and loads the user from the database. Attaches `req.user`
// for secured routes (activity, mood, chat).
//
// Usage:
// Apply to protected routes:
//
//   router.post("/activity", auth, logActivity);
// ======================================================================

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// ----------------------------------------------------------------------
// Extend Express Request interface to include `user`
// ----------------------------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      user?: any; // Consider switching to a typed IUser later
    }
  }
}

// ----------------------------------------------------------------------
// Middleware: auth
// Validates Bearer token and loads user into req.user
// ----------------------------------------------------------------------
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token signature
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    // Validate user existence
    const user = await User.findById(decoded.userId).select("_id name email");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach authenticated user to request
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ======================================================================
// End of Auth Middleware
// ======================================================================
