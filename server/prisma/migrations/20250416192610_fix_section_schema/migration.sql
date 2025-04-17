/*
  Warnings:

  - You are about to drop the column `subjectId` on the `ElectiveSection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ElectiveSection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ElectiveSection" DROP CONSTRAINT "ElectiveSection_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ElectiveSection" DROP CONSTRAINT "ElectiveSection_subjectId_fkey";

-- DropIndex
DROP INDEX "ElectiveSection_subjectId_courseId_name_key";

-- AlterTable
ALTER TABLE "ElectiveSection" DROP COLUMN "subjectId",
ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "subjectCourseWithSeatsId" TEXT,
ALTER COLUMN "courseId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ElectiveSection_name_key" ON "ElectiveSection"("name");

-- AddForeignKey
ALTER TABLE "ElectiveSection" ADD CONSTRAINT "ElectiveSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectiveSection" ADD CONSTRAINT "ElectiveSection_subjectCourseWithSeatsId_fkey" FOREIGN KEY ("subjectCourseWithSeatsId") REFERENCES "SubjectCourseWithSeats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
