-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'TECHNICIAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('UNBAN', 'BAN');

-- CreateEnum
CREATE TYPE "TechnicianStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Try" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "technicianProfiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" VARCHAR(100),
    "bio" VARCHAR(150) NOT NULL,
    "skills" TEXT[],
    "experienceYears" INTEGER NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "status" "TechnicianStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technicianProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(14),
    "password" TEXT NOT NULL,
    "address" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'UNBAN',
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "technicianProfiles_userId_key" ON "technicianProfiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "technicianProfiles_bio_key" ON "technicianProfiles"("bio");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "technicianProfiles" ADD CONSTRAINT "technicianProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
