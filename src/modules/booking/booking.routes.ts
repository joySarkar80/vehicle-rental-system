import express, { Request, Response } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = express.Router();

router.post("/", bookingControllers.createBooking);
router.get("/", auth(), bookingControllers.getAllBooking);
router.put("/:bookingId", auth(), bookingControllers.updateBooking);


export const bookingRoutes = router;