-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- DropEnum
DROP TYPE "Try";

-- CreateTable
CREATE TABLE "availabilitySlots" (
    "id" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL DEFAULT 'SUNDAY',
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "availabilitySlots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "availabilitySlots" ADD CONSTRAINT "availabilitySlots_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technicianProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
