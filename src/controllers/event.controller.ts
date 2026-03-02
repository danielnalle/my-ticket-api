import type { Request, Response } from "express";
import { EventService } from "../services/event.service.js";

interface EventParams {
  id: string;
}

export class EventController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;

      if (
        !data.title ||
        !data.showTime ||
        !data.venue ||
        !data.price ||
        !data.rows ||
        !data.cols
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Semua field (title, showTime, venue, price, rows, cols) wajib diisi!",
        });
      }

      const event = await EventService.createEvent(data);

      return res.status(201).json({
        status: "success",
        message: "Event dan Kursi berhasil dibuat!",
        data: event,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: "error",
        message: error.message || "Gagal membuat event",
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const events = await EventService.getAllEvents();
      return res.status(200).json({
        status: "success",
        data: events,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  static async getOne(req: Request<EventParams>, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventDetails(id);
      return res.status(200).json({
        status: "success",
        data: event,
      });
    } catch (error: any) {
      return res.status(404).json({ status: "error", message: error.message });
    }
  }
}
