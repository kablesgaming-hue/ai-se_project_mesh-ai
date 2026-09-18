import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      data: null,
      error: {
        message: "Authorization token required",
      },
    });
    return;
  }

  try {
    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
      userId: string;
    };

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      data: null,
      error: {
        message: "Invalid or expired token",
      },
    });
  }
};
