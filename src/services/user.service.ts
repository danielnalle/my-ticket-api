import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import type { Prisma } from "../generated/prisma/client.js";

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
}
