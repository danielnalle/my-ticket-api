import { prisma } from "../config/db.js";
import type { Prisma } from "../generated/prisma/client.js";

export class UserRepository {
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
