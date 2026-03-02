import { Router, type Router as ExpressRouter } from "express";
import { EventController } from "../controllers/event.controller.js";
import {
  authenticateJWT,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

// PUBLIC ROUTES
router.get("/", EventController.getAll);
router.get("/:id", EventController.getOne);

// PROTECTED ROUTES
router.post(
  "/",
  authenticateJWT,
  authorizeRole(["ADMIN"]),
  EventController.create,
);

export default router;
