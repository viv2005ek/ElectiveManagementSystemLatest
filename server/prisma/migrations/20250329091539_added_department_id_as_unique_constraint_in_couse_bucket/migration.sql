/*
  Warnings:

  - A unique constraint covering the columns `[name,departmentId]` on the table `CourseBucket` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CourseBucket_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "CourseBucket_name_departmentId_key" ON "CourseBucket"("name", "departmentId");
