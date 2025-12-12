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
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

const getAllUsers = async (req: Request, res: Response) => {

  try {
    const result = await userServices.getAllUsers();
    const users = result.rows;

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const updateSingleUser = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tokenRole = req.user!.role;
  try {
    const result = await userServices.updateSingleUser(req.params.userId as string, req.body, tokenRole, userId);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: true,
        message: "User not found",
        data: []
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteSingleUser(req.params.userId!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: true,
        message: "User not found",
        data: []
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export const userControllers = {
  createUser,
  getAllUsers,
  updateSingleUser,
  deleteSingleUser
}




