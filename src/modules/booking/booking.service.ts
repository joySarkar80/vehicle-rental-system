import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>, userId?: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicle = await pool.query(`SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`, [vehicle_id]);
    if (vehicle.rows.length === 0) {
        throw new Error("Vehicle not found, chose other vehicle!!!");
    };

    if (vehicle.rows[0].availability_status === "booked") {
        throw new Error("This vehicle is booked...");
    };

    if (customer_id !== userId) {
        throw new Error("Token customer_id and body customer_id not match!!!");
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
        const msg = "Bookings retrieved successfully";
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

        return [formatted, msg];
    }

    const message = "Your bookings retrieved successfully";
    const res = await pool.query(
        `SELECT 
          b.id,
          b.vehicle_id,
          to_char(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
          to_char(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
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

    return [bookings, message];
}

const updateBooking = async (bookingId: string, payload: Record<string, unknown>, role: any, userId?: any) => {
    const { status } = payload;

    if (role === "admin") {
        const getBookingById = await pool.query(`SELECT customer_id FROM bookings WHERE id = $1`, [bookingId]);
        const message = "Booking marked as returned. Vehicle is now available";
        if (getBookingById.rows.length > 0) {
            const result = await pool.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING 
             id, 
             customer_id, 
             vehicle_id,
            (SELECT to_char(rent_start_date, 'YYYY-MM-DD')
             FROM bookings 
             WHERE id = $2
             ORDER BY id DESC
             LIMIT 1) AS rent_start_date,
            (SELECT to_char(rent_end_date, 'YYYY-MM-DD')
             FROM bookings 
             WHERE id = $2
             ORDER BY id DESC
             LIMIT 1) AS rent_end_date,
             total_price,
             status
            `, [status, bookingId]);
            await pool.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *`,
                [result.rows[0].vehicle_id]);
            const vehicleData = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1`, [result.rows[0].vehicle_id]);
            const data = result.rows[0];
            const vehicle = vehicleData.rows[0];
            return [{ ...data, vehicle }, message];
        } else {
            throw new Error("No bookings found!!!");
        }
    }

    const getBookingById = await pool.query(`SELECT customer_id FROM bookings WHERE id = $1`, [bookingId]);
    if (getBookingById.rows.length > 0) {
        const message = "Booking cancelled successfully";
        if (userId === getBookingById.rows[0].customer_id) {
            const result = await pool.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING 
             id, 
             customer_id, 
             vehicle_id,
            (SELECT to_char(rent_start_date, 'YYYY-MM-DD')
             FROM bookings 
             WHERE id = $2
             ORDER BY id DESC
             LIMIT 1) AS rent_start_date,
            (SELECT to_char(rent_end_date, 'YYYY-MM-DD')
             FROM bookings 
             WHERE id = $2
             ORDER BY id DESC
             LIMIT 1) AS rent_end_date,
             total_price,
             status
            `, [status, bookingId]);
            await pool.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *`,
                [result.rows[0].vehicle_id]);
            const data = result.rows[0];
            return [data, message];
        } else {
            throw new Error("Token customer_id does not exist in this booking. You can not cancel this booking, bcz this is not your booking. Give the token with which the booking was created..");
        }
    } else {
        throw new Error("No bookings found!!!");
    }
}

export const bookingServices = {
    createBooking,
    getAllBooking,
    updateBooking
};
