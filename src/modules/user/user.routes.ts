import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post("/signup", userControllers.createUser);

export const userRoutes = router;