import { ReservationRepository } from "../repositories/reservation.repository.js";
import { redisClient } from "../config/redis.js";
import { addExpirationJob } from "../jobs/reservation.queue.js";

export class ReservationService {
  static async bookSeat(userId: string, seatId: string) {
    const seat = await ReservationRepository.findSeatById(seatId);
    if (!seat) throw new Error("Kursi tidak ditemukan!");
    if (seat.status === "SOLD") throw new Error("Kursi sudah tidak tersedia");

    const numberOfReservations =
      await ReservationRepository.countUserResevations(userId);
    if (numberOfReservations >= 4)
      throw new Error("Maksimal pembelian 4 tiket per akun");

    const lockKey = `seat_lock:${seatId}`;
    const lockDurationSeconds = 600; // 10 menit waktu pembayaran

    const acquiredLock = await redisClient.set(lockKey, userId, {
      NX: true,
      EX: lockDurationSeconds,
    });

    if (!acquiredLock) {
      throw new Error(
        "Mohon maaf, kursi ini baru saja dikunci oleh pengguna lain (Sedang proses pembayaran).",
      );
    }

    try {
      const expiredAt = new Date(Date.now() + lockDurationSeconds * 1000);

      const result = await ReservationRepository.lockSeatAndCreateReservation(
        userId,
        seatId,
        Number(seat.price),
        expiredAt,
      );

      const delayMs = lockDurationSeconds * 1000;
      await addExpirationJob(result.reservation.id, seatId, delayMs);

      return result.reservation;
    } catch (error) {
      await redisClient.del(lockKey);
      throw new Error(
        "Terjadi kesalahan pada sistem database. Kunci kursi dilepaskan.",
      );
    }
  }
}
