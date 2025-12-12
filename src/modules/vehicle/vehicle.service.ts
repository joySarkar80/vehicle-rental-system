import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result;
}

const getAllVehicle = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
}

const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    return result;
}

const updateVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: string, availability_status: string, id: string) => {
    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);

    return result;
}


const deleteSingleVehicle = async (id: string) => {
    const bookingStatus = await pool.query(`SELECT status FROM bookings WHERE vehicle_id = $1`, [id]);
    console.log(bookingStatus.rows[0]);

    if (bookingStatus.rows.length > 0 && bookingStatus.rows[0].status === "active") {
        throw new Error("The vehicle cannot be deleted because their booking status is active !!!");
    } else {
        console.log("hello from else", id);
        await pool.query(`UPDATE bookings SET vehicle_id = NULL WHERE vehicle_id = $1`, [id]);
        const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
        return result;
    }
}

export const vehicleServices = {
    createVehicle,
    getAllVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteSingleVehicle
}