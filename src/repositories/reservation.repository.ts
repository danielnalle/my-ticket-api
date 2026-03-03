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
}
