import express,{ Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();


app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/auth", authRouter);

export default app;