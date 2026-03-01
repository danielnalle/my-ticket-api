import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import type { Prisma } from "../generated/prisma/client.js";
import jwt from "jsonwebtoken";

export class UserService {
  static async registerUser(data: Prisma.UserCreateInput) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser)
      throw new Error("Email sudah terdaftar. Silahkan gunakan email lain.");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = await UserRepository.create({
      ...data,
      password: hashedPassword,
    });

    return newUser;
  }

  static async loginUser(
    data: Pick<Prisma.UserCreateInput, "email" | "password">,
  ) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Email atau password salah!");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email atau password salah!");
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET || "fallback_secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

    const token = jwt.sign(payload, secret, { expiresIn: expiresIn as any });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
