import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {

  try {
    const result = await userServices.createUser(req.body);
    const user = result.rows[0];
    const { password, created_at, updated_at, ...safeData } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeData,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const userControllers = {
  createUser,
}




