import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/signup", userControllers.createUser);
router.get("/", auth("admin"), userControllers.getAllUsers);
router.put("/:userId", userControllers.updateSingleUser);
router.delete("/:userId", auth("admin"), userControllers.deleteSingleUser);


export const userRoutes = router;