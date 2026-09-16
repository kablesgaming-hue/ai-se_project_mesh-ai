import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { queryDocuments } from "../controllers/query.js";

const queryRouter = Router();

queryRouter.use(auth);

queryRouter.post("/", queryDocuments);

export { queryRouter };
