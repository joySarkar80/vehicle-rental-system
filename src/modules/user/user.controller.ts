import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {

  try {
    const result = await userServices.createUser(req.body);
    const user = result.rows[0];
    const { password, ...safeData } = user;

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

const updateSingleUser =   async (req: Request, res: Response) => {
    // console.log(req.params.id);
    const { name, email } = req.body;
    try {
      const result = await userServices.updateSingleUser(name, email, req.params.id!);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: result.rows[0],
        });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

export const userControllers = {
  createUser,
  updateSingleUser
}




