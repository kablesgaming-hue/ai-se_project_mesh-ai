import type { Request, Response } from "express";
import Document from "../models/document.js";
import Chunk from "../models/chunk.js";
import { createEmbedding } from "../utils/embeddings.js";
import { rankBySimilarity } from "../utils/vector-search.js";
import { getClient, LLM_MODEL, buildContext } from "../utils/openai-client.js";

export const queryDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { question } = req.body;

  if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "question is required",
      },
    });
    return;
  }

  const userId = req.user!.userId;

  const userDocs = await Document.find({ userId }, "_id");
  const docIds = userDocs.map((doc) => doc._id);

  const chunkRecords = await Chunk.find({
    documentId: { $in: docIds },
  });

  const chunks = chunkRecords.map((chunk) => ({
    id: String(chunk._id),
    documentId: String(chunk.documentId),
    text: chunk.text,
    embedding: chunk.embedding,
  }));

  const queryEmbedding = await createEmbedding(question);
  const relevantChunks = rankBySimilarity(queryEmbedding, chunks);
  const context = buildContext(relevantChunks);

  const response = await getClient().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Answer the user's question using the provided document context. If the context does not contain the answer, say that you do not have enough information.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  const answer =
    response.choices[0]?.message.content ?? "No answer was generated.";

  res.status(200).json({
    success: true,
    data: {
      answer,
    },
    error: null,
  });
};
