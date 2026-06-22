-- CreateEnum
CREATE TYPE "roleEnum" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "roleEnum" NOT NULL DEFAULT 'user';
