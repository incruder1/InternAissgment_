import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fbRouter from "./routes/fbRouter.js";
const PORT = process.env.PORT || 8080;
//configure env
dotenv.config();

//databse config
connectDB();

//esmoduleFix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api", fbRouter);
// for hosting the frontend server
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//run listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
