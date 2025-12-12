import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const result = await bookingServices.createBooking(req.body, userId!);
        const bookingData = result.booking.rows[0];
        const vehicle = result.vehicle.rows[0];

        res.status(201).json({
            success: true,
            message: "Booking registered successfully",
            data: { ...bookingData, vehicle },
        });
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message,
        });
    }
}

const getAllBooking = async (req: Request, res: Response) => {

    try {
        const userId = req.user!.id;
        const role = req.user!.role;
        const allBookings = await bookingServices.getAllBooking(role, userId);

        if (allBookings.length === 0) {
            res.status(404).json({
                success: true,
                message: "No bookings found, bookings empty",
                data: allBookings,
            });
        } else {
            res.status(200).json({
                success: true,
                message: allBookings[1],
                data: allBookings[0],
            });
        }


    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    try {
        console.log("from controller");
        const userId = req.user!.id;
        const role = req.user!.role;
        const result = await bookingServices.updateBooking(req.params.bookingId as string, req.body, role, userId);
console.log(result);
        res.status(200).json({
            success: true,
            message: result[1],
            data: result[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const bookingControllers = {
    createBooking,
    getAllBooking,
    updateBooking
}