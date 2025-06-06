import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { config } from "./configs/config";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/api.error";
import { apiRouter } from "./routers/api.router";
import { delay } from "./utils/delay";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message ?? "Something went wrong";
    res.status(status).json({ status, message });
});

process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);
    process.exit(1);
});

const dbConnection = async () => {
    let dbCon = false;

    while (!dbCon) {
        try {
            console.log("Connecting to DB...");
            await mongoose.connect(config.MONGO_URI);
            dbCon = true;
            console.log("Connection is successful,DB available!");
        } catch {
            console.log("Connection failed, DB unavailable, retrying...");
            await delay(3000);
        }
    }
};

const start = async () => {
    try {
        await dbConnection();
        app.listen(config.PORT, async () => {
            console.log(`Server is listening port - ${config.PORT}`);
            await cronRunner();
        });
    } catch (e: any) {
        console.log(e);
    }
};

start();
