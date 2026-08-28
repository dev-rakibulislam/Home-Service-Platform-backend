/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `technicianProfiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "technicianProfiles_userName_key" ON "technicianProfiles"("userName");
