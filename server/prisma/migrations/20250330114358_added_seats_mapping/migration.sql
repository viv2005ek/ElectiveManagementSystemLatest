/*
  Warnings:

  - You are about to drop the `_CourseBucketToSubjectTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToSubjectCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProgramToSemesters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProgramToSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectCourseBuckets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectCourses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectSemesters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CourseBucketToSubjectTypes" DROP CONSTRAINT "_CourseBucketToSubjectTypes_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseBucketToSubjectTypes" DROP CONSTRAINT "_CourseBucketToSubjectTypes_B_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToSubjectCategory" DROP CONSTRAINT "_CourseToSubjectCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToSubjectCategory" DROP CONSTRAINT "_CourseToSubjectCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramToSemesters" DROP CONSTRAINT "_ProgramToSemesters_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramToSemesters" DROP CONSTRAINT "_ProgramToSemesters_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramToSubject" DROP CONSTRAINT "_ProgramToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramToSubject" DROP CONSTRAINT "_ProgramToSubject_B_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectCourseBuckets" DROP CONSTRAINT "_SubjectCourseBuckets_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectCourseBuckets" DROP CONSTRAINT "_SubjectCourseBuckets_B_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectCourses" DROP CONSTRAINT "_SubjectCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectCourses" DROP CONSTRAINT "_SubjectCourses_B_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectSemesters" DROP CONSTRAINT "_SubjectSemesters_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectSemesters" DROP CONSTRAINT "_SubjectSemesters_B_fkey";

-- DropTable
DROP TABLE "_CourseBucketToSubjectTypes";

-- DropTable
DROP TABLE "_CourseToSubjectCategory";

-- DropTable
DROP TABLE "_ProgramToSemesters";

-- DropTable
DROP TABLE "_ProgramToSubject";

-- DropTable
DROP TABLE "_SubjectCourseBuckets";

-- DropTable
DROP TABLE "_SubjectCourses";

-- DropTable
DROP TABLE "_SubjectSemesters";

-- CreateTable
CREATE TABLE "SubjectCourseWithSeats" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,

    CONSTRAINT "SubjectCourseWithSeats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectCourseBucketWithSeats" (
    "id" TEXT NOT NULL,
    "courseBucketId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,

    CONSTRAINT "SubjectCourseBucketWithSeats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_programToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_programToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_programToSemesters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_programToSemesters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_subjectCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_subjectCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_courseToSubjectCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_courseToSubjectCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_subjectCourseBuckets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_subjectCourseBuckets_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_courseBucketToSubjectTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_courseBucketToSubjectTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_subjectSemesters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_subjectSemesters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectCourseWithSeats_courseId_subjectId_key" ON "SubjectCourseWithSeats"("courseId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectCourseBucketWithSeats_courseBucketId_subjectId_key" ON "SubjectCourseBucketWithSeats"("courseBucketId", "subjectId");

-- CreateIndex
CREATE INDEX "_programToSubject_B_index" ON "_programToSubject"("B");

-- CreateIndex
CREATE INDEX "_programToSemesters_B_index" ON "_programToSemesters"("B");

-- CreateIndex
CREATE INDEX "_subjectCourses_B_index" ON "_subjectCourses"("B");

-- CreateIndex
CREATE INDEX "_courseToSubjectCategory_B_index" ON "_courseToSubjectCategory"("B");

-- CreateIndex
CREATE INDEX "_subjectCourseBuckets_B_index" ON "_subjectCourseBuckets"("B");

-- CreateIndex
CREATE INDEX "_courseBucketToSubjectTypes_B_index" ON "_courseBucketToSubjectTypes"("B");

-- CreateIndex
CREATE INDEX "_subjectSemesters_B_index" ON "_subjectSemesters"("B");

-- AddForeignKey
ALTER TABLE "SubjectCourseWithSeats" ADD CONSTRAINT "SubjectCourseWithSeats_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCourseWithSeats" ADD CONSTRAINT "SubjectCourseWithSeats_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCourseBucketWithSeats" ADD CONSTRAINT "SubjectCourseBucketWithSeats_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCourseBucketWithSeats" ADD CONSTRAINT "SubjectCourseBucketWithSeats_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_programToSubject" ADD CONSTRAINT "_programToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_programToSubject" ADD CONSTRAINT "_programToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_programToSemesters" ADD CONSTRAINT "_programToSemesters_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_programToSemesters" ADD CONSTRAINT "_programToSemesters_B_fkey" FOREIGN KEY ("B") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subjectCourses" ADD CONSTRAINT "_subjectCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subjectCourses" ADD CONSTRAINT "_subjectCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseToSubjectCategory" ADD CONSTRAINT "_courseToSubjectCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseToSubjectCategory" ADD CONSTRAINT "_courseToSubjectCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subjectCourseBuckets" ADD CONSTRAINT "_subjectCourseBuckets_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subjectCourseBuckets" ADD CONSTRAINT "_subjectCourseBuckets_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseBucketToSubjectTypes" ADD CONSTRAINT "_courseBucketToSubjectTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseBucketToSubjectTypes" ADD CONSTRAINT "_courseBucketToSubjectTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subjectSemesters" ADD CONSTRAINT "_subjectSemesters_A_fkey" FOREIGN KEY ("A") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_subjectSemesters" ADD CONSTRAINT "_subjectSemesters_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
