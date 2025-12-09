import { Result } from "pg";
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

const getAllUsers = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
    return result;
}

const updateSingleUser = async (userId: string, payload: Record<string, unknown>, tokenRole: any, tokenUserId: any) => {
    console.log(tokenRole, tokenUserId, userId);
    const { name, email, phone, role } = payload;
    if (tokenRole === "customer") {
        if (tokenUserId === Number(userId)) {
            console.log("match");
            const result = await pool.query(
                `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING id, name, email, phone, role`,
                [name, email, phone, userId]
            );
            console.log("from if block");
            return result;
        } else {
            throw new Error("Bad request, your are not valid for update others profile.");
        }
    } else {
        const result = await pool.query(
            `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id, name, email, phone, role`,
            [name, email, phone, role, userId]
        );
        console.log("from else block");
        return result;
    }
    // return ;
}

const deleteSingleUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result;
}

export const userServices = {
    createUser,
    getAllUsers,
    updateSingleUser,
    deleteSingleUser
}