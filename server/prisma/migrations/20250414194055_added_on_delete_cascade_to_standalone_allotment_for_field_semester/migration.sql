/*
  Warnings:

  - You are about to drop the column `semesterId` on the `StandaloneAllotment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StandaloneAllotment" DROP CONSTRAINT "StandaloneAllotment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneAllotment" DROP CONSTRAINT "StandaloneAllotment_semesterId_fkey";

-- AlterTable
ALTER TABLE "StandaloneAllotment" DROP COLUMN "semesterId";

-- AddForeignKey
ALTER TABLE "StandaloneAllotment" ADD CONSTRAINT "StandaloneAllotment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
