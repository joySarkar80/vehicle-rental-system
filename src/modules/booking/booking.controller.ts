import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);
        const bookingData = result.booking.rows[0];
        const vehicle = result.vehicle.rows[0];

        res.status(201).json({
            success: true,
            message: "Booking registered successfully",
            data: { ...bookingData, vehicle },
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const getAllBooking = async (req: Request, res: Response) => {

    try {
        const userId = req.user!.id;
        const role = req.user!.role;
        const result = await bookingServices.getAllBooking(role, userId);
        const allVehicle = result;

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: allVehicle,
        });
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

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: result,
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