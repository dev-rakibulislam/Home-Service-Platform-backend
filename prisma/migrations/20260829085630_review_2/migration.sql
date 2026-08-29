/*
  Warnings:

  - Added the required column `comment` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "comment" VARCHAR(255) NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL;
