// ======================================================================
// Auth Controller
// Purpose:
// Handles user registration, login (JWT + Session), and logout.
// Uses secure password hashing (bcrypt) and persistent session tokens.
// ======================================================================

import { Request, Response } from "express";
import { User } from "../models/User";
import { Session } from "../models/Session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ======================================================================
// Controller: register
// Route: POST /api/auth/register
//
// Expected Body:
// name      → user's name
// email     → user's unique email
// password  → plain text password (hashed before storing)
//
// Behavior:
// 1) Validate input
// 2) Ensure email is unique
// 3) Hash password and create user record
// 4) Respond with basic user details
// ======================================================================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Respond with limited user details
    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "User registered successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================
// Controller: login
// Route: POST /api/auth/login
//
// Expected Body:
// email     → user's registered email
// password  → user's password
//
// Behavior:
// 1) Validate credentials
// 2) Verify password using bcrypt
// 3) Generate JWT valid for 24 hours
// 4) Create and store session with expiration time
// 5) Respond with token + user data
// ======================================================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare input password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Create session entry for persistent login
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = new Session({
      userId: user._id,
      token,
      expiresAt,
      deviceInfo: req.headers["user-agent"], // optional device tracking
    });
    await session.save();

    // Successful login response
    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================
// Controller: logout
// Route: POST /api/auth/logout
//
// Behavior:
// 1) Extract token from Authorization header
// 2) Remove session record from DB
// 3) Token becomes invalid — user logged out
// ======================================================================
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      await Session.deleteOne({ token });
    }

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================
// End of Auth Controller
// ======================================================================
