import { Router, type Router as ExpressRouter } from "express";
import { ReservationController } from "../controllers/reservation.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.post("/book", authenticateJWT, ReservationController.book);

export default router;
