import type { Response } from "express";
import { ReservationService } from "../services/reservation.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export class ReservationController {
  static async book(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { seatId } = req.body;

      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      if (!seatId) {
        return res
          .status(400)
          .json({ status: "error", message: "seatId wajib dikirim!" });
      }

      const reservation = await ReservationService.bookSeat(userId, seatId);

      return res.status(201).json({
        status: "success",
        message:
          "Kursi berhasil dikunci! Silakan selesaikan pembayaran dalam 10 menit.",
        data: reservation,
      });
    } catch (error: any) {
      const isConflict =
        error.message.includes("dikunci") ||
        error.message.includes("tidak tersedia");
      const statusCode = isConflict ? 409 : 400;

      return res.status(statusCode).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
