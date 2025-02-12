/*
  Warnings:

  - You are about to drop the `MinorSpecialization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MinorSpecializationAllotmentWindow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MinorSpecializationChoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgrammeElective` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgrammeElectiveAllotment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgrammeElectiveChoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgrammeElectiveCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgrammeElectiveCourseBranch` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AllotmentType" AS ENUM ('STANDALONE', 'BUCKET');

-- CreateEnum
CREATE TYPE "AllotmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "MinorSpecialization" DROP CONSTRAINT "MinorSpecialization_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "MinorSpecializationChoice" DROP CONSTRAINT "MinorSpecializationChoice_minorSpecializationId_fkey";

-- DropForeignKey
ALTER TABLE "MinorSpecializationChoice" DROP CONSTRAINT "MinorSpecializationChoice_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElective" DROP CONSTRAINT "ProgrammeElective_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElective" DROP CONSTRAINT "ProgrammeElective_minorSpecializationId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveAllotment" DROP CONSTRAINT "ProgrammeElectiveAllotment_programmeElectiveCourseId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveAllotment" DROP CONSTRAINT "ProgrammeElectiveAllotment_programmeElectiveId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveAllotment" DROP CONSTRAINT "ProgrammeElectiveAllotment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveChoice" DROP CONSTRAINT "ProgrammeElectiveChoice_programmeElectiveCourseId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveChoice" DROP CONSTRAINT "ProgrammeElectiveChoice_programmeElectiveId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveChoice" DROP CONSTRAINT "ProgrammeElectiveChoice_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveCourseBranch" DROP CONSTRAINT "ProgrammeElectiveCourseBranch_branchId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectiveCourseBranch" DROP CONSTRAINT "ProgrammeElectiveCourseBranch_programmeElectiveCourseId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_minorSpecializationId_fkey";

-- DropTable
DROP TABLE "MinorSpecialization";

-- DropTable
DROP TABLE "MinorSpecializationAllotmentWindow";

-- DropTable
DROP TABLE "MinorSpecializationChoice";

-- DropTable
DROP TABLE "ProgrammeElective";

-- DropTable
DROP TABLE "ProgrammeElectiveAllotment";

-- DropTable
DROP TABLE "ProgrammeElectiveChoice";

-- DropTable
DROP TABLE "ProgrammeElectiveCourse";

-- DropTable
DROP TABLE "ProgrammeElectiveCourseBranch";

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseBucket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "CourseBucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectAllotmentWindow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "batch" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubjectAllotmentWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectPreferences" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT,
    "courseBucketId" TEXT,
    "allotmentWindowId" TEXT NOT NULL,
    "preferenceOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAllotment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT,
    "courseBucketId" TEXT,
    "allotmentWindowId" TEXT NOT NULL,
    "type" "AllotmentType" NOT NULL,
    "status" "AllotmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseAllotment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubjectAllotmentWindowToBranch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectAllotmentWindowToBranch_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToCourseCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToCourseCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToCourseBucket" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToCourseBucket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_name_key" ON "CourseCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectPreferences_studentId_courseId_courseBucketId_allotm_key" ON "SubjectPreferences"("studentId", "courseId", "courseBucketId", "allotmentWindowId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseAllotment_studentId_courseId_courseBucketId_allotment_key" ON "CourseAllotment"("studentId", "courseId", "courseBucketId", "allotmentWindowId");

-- CreateIndex
CREATE INDEX "_SubjectAllotmentWindowToBranch_B_index" ON "_SubjectAllotmentWindowToBranch"("B");

-- CreateIndex
CREATE INDEX "_CourseToCourseCategory_B_index" ON "_CourseToCourseCategory"("B");

-- CreateIndex
CREATE INDEX "_CourseToCourseBucket_B_index" ON "_CourseToCourseBucket"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBucket" ADD CONSTRAINT "CourseBucket_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPreferences" ADD CONSTRAINT "SubjectPreferences_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPreferences" ADD CONSTRAINT "SubjectPreferences_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPreferences" ADD CONSTRAINT "SubjectPreferences_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPreferences" ADD CONSTRAINT "SubjectPreferences_allotmentWindowId_fkey" FOREIGN KEY ("allotmentWindowId") REFERENCES "SubjectAllotmentWindow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAllotment" ADD CONSTRAINT "CourseAllotment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAllotment" ADD CONSTRAINT "CourseAllotment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAllotment" ADD CONSTRAINT "CourseAllotment_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAllotment" ADD CONSTRAINT "CourseAllotment_allotmentWindowId_fkey" FOREIGN KEY ("allotmentWindowId") REFERENCES "SubjectAllotmentWindow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectAllotmentWindowToBranch" ADD CONSTRAINT "_SubjectAllotmentWindowToBranch_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectAllotmentWindowToBranch" ADD CONSTRAINT "_SubjectAllotmentWindowToBranch_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectAllotmentWindow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseCategory" ADD CONSTRAINT "_CourseToCourseCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseCategory" ADD CONSTRAINT "_CourseToCourseCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseBucket" ADD CONSTRAINT "_CourseToCourseBucket_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseBucket" ADD CONSTRAINT "_CourseToCourseBucket_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
