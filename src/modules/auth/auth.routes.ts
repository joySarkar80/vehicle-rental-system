import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signin", authController.loginUser);

export const authRouter = router;