import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "Email, password, and name are required",
      },
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "Password must be at least 8 characters",
      },
    });
    return;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409).json({
      success: false,
      data: null,
      error: {
        message: "User already exists",
      },
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
  });

  res.status(201).json({
    success: true,
    data: {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
    error: null,
  });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "Email and password are required",
      },
    });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({
      success: false,
      data: null,
      error: {
        message: "Invalid email or password",
      },
    });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    res.status(401).json({
      success: false,
      data: null,
      error: {
        message: "Invalid email or password",
      },
    });
    return;
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET!,
  );

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
    },
    error: null,
  });
};

export const getCurrentUser = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {
      userId: "user_001",
      email: "user@example.com",
      name: "John Doe",
      createdAt: "2026-01-01T00:00:00Z",
    },
    error: null,
  });
};
