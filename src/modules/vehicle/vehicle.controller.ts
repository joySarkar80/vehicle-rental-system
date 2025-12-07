import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vehicleServices.createVehicle(req.body);
        const vehicle = result.rows[0];

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const getAllVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vehicleServices.getAllVehicle();
        const allVehicle = result.rows;

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: allVehicle,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const getSingleVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vehicleServices.getSingleVehicle(req.params.vehicleId as string);
        const vehicle = result.rows[0];

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
                data: vehicle,
            });
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await vehicleServices.updateVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId as string);
        const vehicle = result.rows[0];

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: vehicle,
            });
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const deleteSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteSingleVehicle(req.params.vehicleId!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const vehicleControllers = {
    createVehicle,
    getAllVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteSingleVehicle
}
