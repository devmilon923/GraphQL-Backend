/*
  Warnings:

  - You are about to drop the column `device_type` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expire_at` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_user_id_ip_address_access_token_idx";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "device_type",
ADD COLUMN     "expire_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Session_user_id_ip_address_access_token_expire_at_isValid_idx" ON "Session"("user_id", "ip_address", "access_token", "expire_at", "isValid");
