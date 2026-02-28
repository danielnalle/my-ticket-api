import { Router, type Router as ExpressRouter } from "express";
import { UserController } from "../controllers/user.controller.js";

const router: ExpressRouter = Router();

router.post("/register", UserController.register);

export default router;
