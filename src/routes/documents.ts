import { Router } from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} from "../controllers/documents.js";

const documentsRouter = Router();
const upload = multer({ dest: "uploads/" });

documentsRouter.use(auth);

documentsRouter.post("/", upload.single("file"), uploadDocument);
documentsRouter.get("/", getDocuments);
documentsRouter.get("/:id", getDocumentById);
documentsRouter.delete("/:id", deleteDocument);

export { documentsRouter };
