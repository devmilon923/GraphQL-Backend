/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token,user_id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Session_ip_address_refresh_token_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Session_refresh_token_user_id_key" ON "Session"("refresh_token", "user_id");
