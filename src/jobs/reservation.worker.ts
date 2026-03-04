import { Worker } from "bullmq";
import { ReservationRepository } from "../repositories/reservation.repository.js";
import { redisClient } from "../config/redis.js";

const connection = {
  host: "localhost",
  port: 6380,
};

export const expirationWorker = new Worker(
  "reservation-expiration",
  async (job) => {
    const { reservationId, seatId } = job.data;

    console.log(
      `\n👷 [Worker] Membangunkan tugas untuk mengecek reservasi: ${reservationId}`,
    );

    const result = await ReservationRepository.cancelUnpaidReservation(
      reservationId,
      seatId,
    );

    if (result) {
      console.log(
        `✅ [Worker] Reservasi ${reservationId} telah DIBATALKAN karena melebihi batas waktu bayar.`,
      );

      await redisClient.del(`seat_lock:${seatId}`);
    } else {
      console.log(
        `⏩ [Worker] Reservasi ${reservationId} sudah lunas atau tidak valid. Tidak ada yang dibatalkan.`,
      );
    }
  },
  { connection },
);

expirationWorker.on("failed", (job, err) =>
  console.error(`❌ [Worker] Job ${job?.id} gagal dieksekusi:`, err.message),
);
