/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId,allotmentWindowId]` on the table `CourseAllotment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semester` to the `CourseAllotment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CourseAllotment_studentId_courseId_courseBucketId_allotment_key";

-- AlterTable
ALTER TABLE "CourseAllotment" ADD COLUMN     "semester" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CourseAllotment_studentId_courseId_allotmentWindowId_key" ON "CourseAllotment"("studentId", "courseId", "allotmentWindowId");
