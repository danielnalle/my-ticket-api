import type { Request, Response } from "express";
import {
  PaymentService,
  type WebhookPayload,
} from "../services/payment.service.js";

export class WebhookController {
  static async handlePaymentEvent(req: Request, res: Response) {
    try {
      const clientToken = req.headers["x-callback-token"];
      const serverToken = process.env.WEBHOOK_SECRET;

      if (!clientToken || clientToken !== serverToken) {
        return res
          .status(401)
          .json({ status: "error", message: "Webhook signature tidak valid!" });
      }

      const payload: WebhookPayload = req.body;

      if (!payload.reservationId || !payload.paymentId || !payload.status) {
        return res
          .status(400)
          .json({ status: "error", message: "Payload tidak lengkap" });
      }

      const result = await PaymentService.processWebhook(payload);

      return res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error: any) {
      console.error("❌ Webhook Error:", error.message);
      return res.status(400).json({ status: "error", message: error.message });
    }
  }
}
