import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";


const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "Missing or invalid authentication token",
                    errors: "Unauthorized"
                });
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token as string, config.jwtSecret as string) as JwtPayload;
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(401).json({
                    success: false,
                    message: "Missing or invalid authentication token",
                    errors: "Unauthorized"
                })
            }

            next();
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}

export default auth;