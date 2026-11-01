import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.js";

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: "Authentication required" },
    });
    return;
  }

  if (!mongoose.isValidObjectId(userId)) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: "User not found" },
    });
    return;
  }

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        success: false,
        data: null,
        error: { message: "User not found" },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      error: null,
    });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: { message: "Unable to retrieve user" },
    });
  }
};
