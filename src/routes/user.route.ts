import { Router, type Router as ExpressRouter } from "express";
import { UserController } from "../controllers/user.controller.js";
import {
  authenticateJWT,
  authorizeRole,
  type AuthRequest,
} from "../middlewares/auth.middleware.js";
import type { Response } from "express";

const router: ExpressRouter = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/me", authenticateJWT, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Anda berhasil mengakses endpoint terproteksi!",
    user: req.user,
  });
});

router.get(
  "/admin-dashboard",
  authenticateJWT,
  authorizeRole(["ADMIN"]),
  (req: AuthRequest, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Selamat datang Admin!",
    });
  },
);

export default router;
