import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes.js";
import mongoose from "mongoose";
import Canvas from "./models/canvasModel.js";
import BlockSync from "./models/blockSyncModel.js";
import watcherService from "./services/watcherService.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

const DB = process.env.DATABASE_LOCAL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(async () => {
    console.log("DB connection successful!");
    // Clear the Canvas collection on startup
    // await Canvas.deleteMany({});
    // await BlockSync.deleteMany({});
    console.log("Canvas collection cleared");

    // Start event listeners
    await watcherService.startWatchers();
  })
  .catch((error) => {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  });

export default app;
