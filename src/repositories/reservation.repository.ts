import { prisma } from "../config/db.js";

export class ReservationRepository {
  static async lockSeatAndCreateReservation(
    userId: string,
    seatId: string,
    price: number,
    expiredAt: Date,
  ) {
    return await prisma.$transaction(async (tx) => {
      const updatedSeat = await tx.seat.update({
        where: { id: seatId },
        data: { status: "LOCKED" },
      });

      const reservation = await tx.reservation.create({
        data: {
          userId,
          seatId,
          totalAmount: price,
          status: "PENDING",
          expiredAt,
        },
      });

      return { updatedSeat, reservation };
    });
  }

  static async findSeatById(seatId: string) {
    return await prisma.seat.findUnique({ where: { id: seatId } });
  }

  static async countUserResevations(userId: string) {
    return await prisma.reservation.count({
      where: { userId, OR: [{ status: "PENDING" }, { status: "SUCCESS" }] },
    });
  }

  static async findReservationById(reservationId: string) {
    return await prisma.reservation.findUnique({
      where: { id: reservationId },
    });
  }

  static async confirmPayment(
    reservationId: string,
    seatId: string,
    paymentId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: "SUCCESS",
          paymentId: paymentId,
        },
      });

      const updatedSeat = await tx.seat.update({
        where: { id: seatId },
        data: {
          status: "SOLD",
        },
      });

      return { updatedReservation, updatedSeat };
    });
  }

  static async cancelUnpaidReservation(reservationId: string, seatId: string) {
    return await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation || reservation.status !== "PENDING") {
        return null;
      }

      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: { status: "EXPIRED" },
      });

      const updatedSeat = await tx.seat.update({
        where: { id: seatId },
        data: { status: "AVAILABLE" },
      });

      return { updatedReservation, updatedSeat };
    });
  }
}
