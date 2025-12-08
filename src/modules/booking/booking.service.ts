import { pool } from "../../config/db";


const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicle = await pool.query(`SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`, [vehicle_id]);
    if (vehicle.rows.length === 0) {
        throw new Error("Vehicle not found!!!");
    };

    const days = Math.floor((new Date(rent_end_date as string).getTime() - new Date(rent_start_date as string).getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
        throw new Error("Put valid date");
    }

    const totalPrice = days * Number(vehicle.rows[0].daily_rent_price);

    const booking = await pool.query(
        `INSERT INTO bookings(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    )
    VALUES($1, $2, $3, $4, $5, 'active')
    RETURNING 
      id,
      customer_id,
      vehicle_id,
      to_char(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
      to_char(rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
      total_price,
      status`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
    );

    await pool.query(
        `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1 RETURNING *`,
        [vehicle_id]);

    return { booking, vehicle };
}

const getAllBooking = async (role: any, userId?: any) => {

    if (role === "admin") {
        const result = await pool.query(`
        SELECT 
        b.id,
    b.customer_id,
    b.vehicle_id,
    to_char(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
    to_char(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
    b.total_price,
    b.status,
        v.vehicle_name, v.registration_number, v.type,
        u.name AS customer_name, u.email AS customer_email
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON b.customer_id = u.id
        ORDER BY b.id
    `);

        const formatted = result.rows.map(row => {
            return {
                id: row.id,
                customer_id: row.customer_id,
                vehicle_id: row.vehicle_id,
                rent_start_date: row.rent_start_date,
                rent_end_date: row.rent_end_date,
                total_price: row.total_price,
                status: row.status,
                customer: {
                    name: row.customer_name,
                    email: row.customer_email
                },
                vehicle: {
                    vehicle_name: row.vehicle_name,
                    registration_number: row.registration_number,
                    type: row.type
                }
            };
        });

        return formatted;
    }

    const res = await pool.query(
        `SELECT 
          b.id,
          b.vehicle_id,
          b.rent_start_date,
          b.rent_end_date,
          b.total_price,
          b.status,
          v.vehicle_name,
          v.registration_number,
          v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id
  `, [userId]);

    const bookings = res.rows.map(row => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.type
        }
    }));

    return bookings;
}

const updateBooking = async (bookingId: string, payload: Record<string, unknown>, role: any, userId?: any) => {
    const { status } = payload;

    if (role === "admin") {
        const result = await pool.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
            [status, bookingId]);

        const id = result.rows[0].vehicle_id;

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *`,
            [id]);

        const vehicleData = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1`, [id]);
        if (vehicleData.rows.length === 0) {
            throw new Error("Vehicle not found!!!");
        };
        const data = result.rows[0];
        const vehicle = vehicleData.rows[0];
        
        return { ...data, vehicle };
    }

    const result = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [status, bookingId]);

    await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *`,
        [result.rows[0].vehicle_id]);

    return result;
}

export const bookingServices = {
    createBooking,
    getAllBooking,
    updateBooking
};

/*
joy
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibmFtZSI6IkpveSIsImVtYWlsIjoiam95QGdtYWlsLmNvbSIsInBob25lIjoiMDE3MTIzNDU2NzgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjUyMDk2NjcsImV4cCI6MTc2NTgxNDQ2N30.vYaEsfuAb79zfiYdBnlfpQi9aP9DwLH8f6Qj0Ya8ANo

bappy
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwibmFtZSI6ImJhcHB5IiwiZW1haWwiOiJiYXBweUBnbWFpbC5jb20iLCJwaG9uZSI6IjAxNzEyMzQ1NjEwIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY1MjA5Njk4LCJleHAiOjE3NjU4MTQ0OTh9.kxim2oJ6rX9EJTnluieWZC544EZg37eGmz9hNMLKZwk

*/
