import type { Request, Response } from "express";
import Document from "../models/document.js";

export const uploadDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.userId;

  if (!req.file) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "File is required",
      },
    });
    return;
  }

  const document = await Document.create({
    title: req.file.originalname,
    fileName: req.file.filename,
    userId,
  });

  res.status(201).json({
    success: true,
    data: document,
    error: null,
  });
};

export const getDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.userId;

  const documents = await Document.find({ userId });

  res.status(200).json({
    success: true,
    data: documents,
    error: null,
  });
};

export const getDocumentById = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {},
    error: null,
  });
};

export const deleteDocument = (req: Request, res: Response): void => {
  res.status(204).send();
};
