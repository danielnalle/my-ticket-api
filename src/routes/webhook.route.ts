import { Router, type Router as ExpressRouter } from "express";
import { WebhookController } from "../controllers/webhook.controller.js";

const router: ExpressRouter = Router();

router.post("/payment", WebhookController.handlePaymentEvent);

export default router;
