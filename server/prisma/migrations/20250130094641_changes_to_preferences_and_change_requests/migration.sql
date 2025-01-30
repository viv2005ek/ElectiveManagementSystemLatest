/*
  Warnings:

  - You are about to drop the `ChangeRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacultyElectiveAllotment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SemesterBranchPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChangeRequest" DROP CONSTRAINT "ChangeRequest_approvedByAdminId_fkey";

-- DropForeignKey
ALTER TABLE "ChangeRequest" DROP CONSTRAINT "ChangeRequest_currentProgrammeElectiveId_fkey";

-- DropForeignKey
ALTER TABLE "ChangeRequest" DROP CONSTRAINT "ChangeRequest_programmeElectiveAllotmentId_fkey";

-- DropForeignKey
ALTER TABLE "ChangeRequest" DROP CONSTRAINT "ChangeRequest_requestedProgrammeElectiveId_fkey";

-- DropForeignKey
ALTER TABLE "FacultyElectiveAllotment" DROP CONSTRAINT "FacultyElectiveAllotment_facultyId_fkey";

-- AlterTable
ALTER TABLE "ProgrammeElective" ADD COLUMN     "isStandalone" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ChangeRequest";

-- DropTable
DROP TABLE "FacultyElectiveAllotment";

-- DropTable
DROP TABLE "SemesterBranchPermission";

-- DropEnum
DROP TYPE "PreferenceLevel";

-- CreateTable
CREATE TABLE "FacultyProgrammeElectiveAllotment" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "electiveId" TEXT NOT NULL,
    "electiveName" TEXT NOT NULL,
    "electiveCourseCode" TEXT NOT NULL,
    "allotmentSemester" INTEGER NOT NULL,

    CONSTRAINT "FacultyProgrammeElectiveAllotment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeElectivePreference" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "firstPreferenceId" TEXT,
    "secondPreferenceId" TEXT,
    "thirdPreferenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgrammeElectivePreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FacultyProgrammeElectiveAllotment" ADD CONSTRAINT "FacultyProgrammeElectiveAllotment_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectivePreference" ADD CONSTRAINT "ProgrammeElectivePreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectivePreference" ADD CONSTRAINT "ProgrammeElectivePreference_firstPreferenceId_fkey" FOREIGN KEY ("firstPreferenceId") REFERENCES "ProgrammeElective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectivePreference" ADD CONSTRAINT "ProgrammeElectivePreference_secondPreferenceId_fkey" FOREIGN KEY ("secondPreferenceId") REFERENCES "ProgrammeElective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectivePreference" ADD CONSTRAINT "ProgrammeElectivePreference_thirdPreferenceId_fkey" FOREIGN KEY ("thirdPreferenceId") REFERENCES "ProgrammeElective"("id") ON DELETE SET NULL ON UPDATE CASCADE;
