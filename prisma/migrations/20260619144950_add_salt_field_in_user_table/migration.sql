/*
  Warnings:

  - Added the required column `slat` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "slat" TEXT NOT NULL,
ALTER COLUMN "provider" DROP NOT NULL;
