import express, { type Request, type Response } from "express";
import moragen from "morgan";
import cors from "cors";
import indexRouter from "./routes/index.route";
import prismaClient from "@repo/db/client";

export const app = express();

app.use(express.json());
app.use(moragen("dev"));
app.use(cors());

app.use("/api", indexRouter);