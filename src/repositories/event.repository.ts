import { prisma } from "../config/db.js";

export class EventRepository {
  static async createEventWithSeats(eventData: any, seatsData: any[]) {
    return await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        showTime: eventData.showTime,
        venue: eventData.venue,
        seats: { create: seatsData },
      },
      include: {
        _count: {
          select: { seats: true },
        },
      },
    });
  }

  static async findAllEvents() {
    return await prisma.event.findMany({
      orderBy: { showTime: "asc" },
    });
  }

  static async findEventWithSeats(eventId: string) {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        seats: {
          orderBy: { seatNumber: "asc" },
        },
      },
    });
  }
}
