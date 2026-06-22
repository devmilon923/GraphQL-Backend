/*
  Warnings:

  - You are about to drop the column `access_token` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ip_address,refresh_token,user_id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_user_id_fkey";

-- DropIndex
DROP INDEX "Session_user_id_ip_address_access_token_expire_at_isValid_idx";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "access_token",
ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Session_expire_at_isValid_idx" ON "Session"("expire_at", "isValid");

-- CreateIndex
CREATE UNIQUE INDEX "Session_ip_address_refresh_token_user_id_key" ON "Session"("ip_address", "refresh_token", "user_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
