/*
  Warnings:

  - A unique constraint covering the columns `[id,oauthid,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email_verified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "providerEnum" AS ENUM ('google', 'facebook');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_verified" BOOLEAN NOT NULL,
ADD COLUMN     "oauthid" INTEGER,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profile" TEXT NOT NULL,
ADD COLUMN     "provider" "providerEnum" NOT NULL DEFAULT 'google',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_oauthid_email_key" ON "User"("id", "oauthid", "email");
