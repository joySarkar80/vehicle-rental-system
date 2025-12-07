import { pool } from "../../config/db";
import bcrypt from "bcryptjs"

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    

    const hashedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, hashedPass, phone, role]
    );

    return result;
}


const updateSingleUser = async (name: string, email: string, id: string) => {
    const result = await pool.query(
        `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
        [name, email, id]
    );
    return result;
}

export const userServices = {
    createUser,
    updateSingleUser
}