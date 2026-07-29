import express, { type Request, type Response } from "express";
import moragen from "morgan";
import cors from "cors";
import indexRouter from "./routes/index.route";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(moragen("dev"));
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello from api")
})
app.use("/api", indexRouter);