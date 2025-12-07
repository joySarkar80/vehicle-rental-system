import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/signup", userControllers.createUser);

// router.put("/fuck/:id", userControllers.updateSingleUser);
// router.put("/fuckin/:id", auth("admin"), userControllers.updateSingleUser);

export const userRoutes = router;