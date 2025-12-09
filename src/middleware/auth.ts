// higher order function return korbe function

import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { error } from "console";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            // console.log("token-->", authHeader);

            // token na thakle
            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "Missing or invalid authentication token",
                    errors: "Unauthorized"
                });
            }

            const token = authHeader.split(' ')[1];

            // console.log("token without bearer-->", token);

            const decoded = jwt.verify(token as string, config.jwtSecret as string) as JwtPayload;
            // console.log(decoded, roles);  // eita type hoccche jwt er payload
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