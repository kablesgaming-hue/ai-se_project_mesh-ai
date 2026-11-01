import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.js";
import { getCurrentUser } from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const authRouter = Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", auth, getCurrentUser);

export { authRouter };
