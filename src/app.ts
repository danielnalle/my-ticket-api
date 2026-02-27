import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Ticketing API is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
