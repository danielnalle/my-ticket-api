import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Akses ditolak. Token tidak ditemukan atau format salah.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token as string, secret) as {
      userId: string;
      role: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Token tidak valid atau sudah kadaluwarsa",
    });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message:
          "Anda tidak memiliki izin (role) untuk mengakses resource ini.",
      });
    }
    next();
  };
};
