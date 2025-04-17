/*
  Warnings:

  - A unique constraint covering the columns `[name,subjectCourseWithSeatsId]` on the table `ElectiveSection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ElectiveSection_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "ElectiveSection_name_subjectCourseWithSeatsId_key" ON "ElectiveSection"("name", "subjectCourseWithSeatsId");
