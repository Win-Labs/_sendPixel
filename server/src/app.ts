import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes";
import mongoose from "mongoose";
import watcherService from "./services/watcherService";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

const DB = (process.env.VITE_DATABASE_LOCAL as string).replace(
  "<PASSWORD>",
  process.env.VITE_DATABASE_PASSWORD_LOCAL as string,
);

mongoose
  .connect(DB)
  .then(async () => {
    console.log("DB connection successful!");
    await watcherService.startWatchers();
  })
  .catch((error) => {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  });

export default app;
