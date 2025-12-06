import express,{ Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";

const app = express();

// parser
app.use(express.json());
// app.use(express.urlencoded());

// initializing DB
initDB();


// locaal host 5000
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

app.use("/api/v1/auth", userRoutes);

export default app;