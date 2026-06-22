/*
  Warnings:

  - You are about to drop the column `isValid` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_expire_at_isValid_idx";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "isValid";

-- CreateIndex
CREATE INDEX "Session_expire_at_idx" ON "Session"("expire_at");
