import { ReservationRepository } from "../repositories/reservation.repository.js";
import { redisClient } from "../config/redis.js";

export interface WebhookPayload {
  reservationId: string;
  paymentId: string;
  status: "SUCCESS" | "FAILED";
}

export class PaymentService {
  static async processWebhook(payload: WebhookPayload) {
    const { reservationId, paymentId, status } = payload;

    const reservation =
      await ReservationRepository.findReservationById(reservationId);
    if (!reservation) throw new Error("Reservasi tidak ditemukan");

    if (reservation.status === "SUCCESS") {
      return {
        message: "Pembayaran ini sudah diproses sebelumnya",
      };
    }

    if (reservation.status === "EXPIRED") {
      throw new Error(
        "Pembayaran diterima, tetapi reservasi sudah kedaluwarsa. Membutuhkan proses Refund manual.",
      );
    }

    if (status === "SUCCESS") {
      await ReservationRepository.confirmPayment(
        reservationId,
        reservation.seatId,
        paymentId,
      );

      const lockKey = `seat_lock:${reservation.seatId}`;
      await redisClient.del(lockKey);

      return {
        message: "Pembayaran berhasil dikonfirmasi. Tiket diterbitkan!",
      };
    }

    return { message: "Status pembayaran gagal (FAILED) diabaikan." };
  }
}
