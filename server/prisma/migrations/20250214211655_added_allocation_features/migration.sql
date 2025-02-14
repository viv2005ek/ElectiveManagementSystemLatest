/*
  Warnings:

  - You are about to drop the column `isActive` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,courseId,courseBucketId,semester]` on the table `CourseAllotment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectId,studentId,courseId,courseBucketId,preferenceOrder]` on the table `SubjectPreferences` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CourseAllotment_studentId_courseId_subjectId_key";

-- DropIndex
DROP INDEX "SubjectPreferences_studentId_courseId_courseBucketId_subjec_key";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "isActive",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "enrollmentDeadline" TIMESTAMP(3),
ADD COLUMN     "isEnrollOpen" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BucketCourseOrder" (
    "id" TEXT NOT NULL,
    "courseBucketId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "allotmentOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BucketCourseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketSubjectSemesterMapping" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BucketSubjectSemesterMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubjectToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BucketCourseOrder_courseBucketId_courseId_allotmentOrder_key" ON "BucketCourseOrder"("courseBucketId", "courseId", "allotmentOrder");

-- CreateIndex
CREATE UNIQUE INDEX "BucketSubjectSemesterMapping_subjectId_semester_key" ON "BucketSubjectSemesterMapping"("subjectId", "semester");

-- CreateIndex
CREATE INDEX "_SubjectToCourse_B_index" ON "_SubjectToCourse"("B");

-- CreateIndex
CREATE INDEX "CourseAllotment_studentId_idx" ON "CourseAllotment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseAllotment_studentId_courseId_courseBucketId_semester_key" ON "CourseAllotment"("studentId", "courseId", "courseBucketId", "semester");

-- CreateIndex
CREATE INDEX "SubjectPreferences_studentId_idx" ON "SubjectPreferences"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectPreferences_subjectId_studentId_courseId_courseBucke_key" ON "SubjectPreferences"("subjectId", "studentId", "courseId", "courseBucketId", "preferenceOrder");

-- AddForeignKey
ALTER TABLE "BucketCourseOrder" ADD CONSTRAINT "BucketCourseOrder_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketCourseOrder" ADD CONSTRAINT "BucketCourseOrder_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectSemesterMapping" ADD CONSTRAINT "BucketSubjectSemesterMapping_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToCourse" ADD CONSTRAINT "_SubjectToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToCourse" ADD CONSTRAINT "_SubjectToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
