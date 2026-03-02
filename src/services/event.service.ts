import { EventRepository } from "../repositories/event.repository.js";

export interface CreateEventDTO {
  title: string;
  description?: string;
  showTime: string;
  venue: string;
  price: number;
  rows: number;
  cols: number;
}

export class EventService {
  static async createEvent(data: CreateEventDTO) {
    const { title, description, showTime, venue, price, rows, cols } = data;

    const eventDate = new Date(showTime);
    if (eventDate <= new Date()) {
      throw new Error(
        "Waktu event sudah harus lebih dari atau sama dengan tanggal saat ini!",
      );
    }

    if (rows > 26) {
      throw new Error("Maksimal baris adalah 26 (A-Z)");
    }

    const seatsData = [];

    for (let r = 0; r < rows; r++) {
      const rowLetter = String.fromCharCode(65 + r);

      for (let c = 1; c <= cols; c++) {
        seatsData.push({
          seatNumber: `${rowLetter}${c}`,
          price: price,
        });
      }
    }

    const newEvent = await EventRepository.createEventWithSeats(
      {
        title,
        description,
        showTime: eventDate,
        venue,
      },
      seatsData,
    );

    return newEvent;
  }

  static async getAllEvents() {
    return await EventRepository.findAllEvents();
  }

  static async getEventDetails(eventId: string) {
    const event = await EventRepository.findEventWithSeats(eventId);
    if (!eventId) {
      throw new Error("Event tidak ditemukan");
    }

    return event;
  }
}
