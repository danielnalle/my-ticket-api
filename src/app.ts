import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import eventRoutes from "./routes/event.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main routes registration
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// Endpoint Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Ticketing API is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Running server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
