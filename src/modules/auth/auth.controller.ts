import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    // const { email, password } = ;


    try {
        const result = await authServices.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

export const authController = {
    loginUser
}