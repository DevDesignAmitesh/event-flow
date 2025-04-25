import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "../routes/auth";
import eventRouter from "../routes/events";
import userRouter from "../routes/user";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    // origin: "",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
