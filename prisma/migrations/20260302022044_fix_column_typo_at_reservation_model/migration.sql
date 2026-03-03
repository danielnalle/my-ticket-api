/*
  Warnings:

  - You are about to drop the column `expiiredAt` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `expiredAt` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "expiiredAt",
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;
