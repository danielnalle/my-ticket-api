import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          status: "error",
          message: "Email, password, dan name wajib diisi!",
        });
      }

      const user = await UserService.registerUser({ email, password, name });

      return res.status(201).json({
        status: "success",
        message: "Registrasi berhasil!",
        data: user,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: "error",
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Email dan password wajib diisi!",
        });
      }

      const result = await UserService.loginUser({ email, password });

      return res.status(200).json({
        status: "success",
        message: "Login berhasil!",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        status: "error",
        message: error.message || "Autentikasi gagal",
      });
    }
  }
}
