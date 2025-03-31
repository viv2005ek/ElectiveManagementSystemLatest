/*
  Warnings:

  - Added the required column `numberOfCourses` to the `CourseBucket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseBucket" ADD COLUMN     "numberOfCourses" INTEGER NOT NULL;
