import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: Record<string, unknown>) => {
    const email = payload.email;
    const pass = payload.password;
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const data = result.rows[0];   // db theke nie esheche..
    const { password, ...user } = data;
    

    if (result.rows.length === 0) {
        return null;
    }
    const match = await bcrypt.compare(pass as string, data.password);

    if (!match) {
        throw new Error("Password dont match");
    }


    const token = jwt.sign({ id: data.id, name: data.name, email: data.email, phone: data.phone, role: data.role }, config.jwtSecret as string, {
        expiresIn: "7d",
    });
    console.log({ token });  // console.log
    return { token, user };
};

export const authServices = {
    loginUser,
};