/*
  Warnings:

  - A unique constraint covering the columns `[subjectId,studentId,courseId]` on the table `BucketAllotment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,subjectId]` on the table `StandaloneAllotment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BucketAllotment_subjectId_studentId_courseId_key" ON "BucketAllotment"("subjectId", "studentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneAllotment_studentId_subjectId_key" ON "StandaloneAllotment"("studentId", "subjectId");
