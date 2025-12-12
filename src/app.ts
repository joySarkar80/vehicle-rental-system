import express,{ Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();


app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers! version");
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

export default app;