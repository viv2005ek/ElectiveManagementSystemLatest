/*
  Warnings:

  - Added the required column `totalCredits` to the `CourseBucket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseBucket" ADD COLUMN     "totalCredits" INTEGER NOT NULL;
