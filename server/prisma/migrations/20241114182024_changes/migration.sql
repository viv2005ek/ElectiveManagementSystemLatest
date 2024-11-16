/*
  Warnings:

  - You are about to drop the `AdminCredentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacultyCredentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacultyDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SemesterBranchPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentCredentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `approvedByAdminId` to the `ChangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ChangeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PreferenceLevel" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- AlterTable
ALTER TABLE "ChangeRequest" ADD COLUMN     "approvedByAdminId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "programmeElectiveAllotmentId" TEXT,
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ProgrammeElective" ADD COLUMN     "minorSpecializationId" TEXT;

-- DropTable
DROP TABLE "AdminCredentials";

-- DropTable
DROP TABLE "FacultyCredentials";

-- DropTable
DROP TABLE "FacultyDetails";

-- DropTable
DROP TABLE "SemesterBranchPermissions";

-- DropTable
DROP TABLE "StudentCredentials";

-- DropTable
DROP TABLE "StudentDetails";

-- CreateTable
CREATE TABLE "StudentCredential" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "StudentCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyCredential" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "FacultyCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCredential" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "AdminCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "DepartmentId" TEXT NOT NULL,
    "DepartmentName" TEXT NOT NULL,
    "BranchId" TEXT NOT NULL,
    "BranchName" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemesterBranchPermission" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "enrollmentIsActive" BOOLEAN NOT NULL DEFAULT false,
    "changePeriodIsActive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SemesterBranchPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinorSpecializationPreference" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "firstPreferenceId" TEXT NOT NULL,
    "secondPreferenceId" TEXT NOT NULL,
    "thirdPreferenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinorSpecializationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinorSpecialization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MinorSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentCredential_registrationNumber_key" ON "StudentCredential"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCredential_email_key" ON "StudentCredential"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyCredential_registrationNumber_key" ON "FacultyCredential"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyCredential_email_key" ON "FacultyCredential"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCredential_registrationNumber_key" ON "AdminCredential"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCredential_email_key" ON "AdminCredential"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_registrationNumber_key" ON "Student"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_registrationNumber_key" ON "Faculty"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_email_key" ON "Faculty"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_registrationNumber_key" ON "Admin"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MinorSpecializationPreference_studentId_key" ON "MinorSpecializationPreference"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "MinorSpecialization_name_key" ON "MinorSpecialization"("name");

-- AddForeignKey
ALTER TABLE "ProgrammeElective" ADD CONSTRAINT "ProgrammeElective_minorSpecializationId_fkey" FOREIGN KEY ("minorSpecializationId") REFERENCES "MinorSpecialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyElectiveAllotment" ADD CONSTRAINT "FacultyElectiveAllotment_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_programmeElectiveAllotmentId_fkey" FOREIGN KEY ("programmeElectiveAllotmentId") REFERENCES "ProgrammeElectiveAllotment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_approvedByAdminId_fkey" FOREIGN KEY ("approvedByAdminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinorSpecializationPreference" ADD CONSTRAINT "MinorSpecializationPreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinorSpecializationPreference" ADD CONSTRAINT "MinorSpecializationPreference_firstPreferenceId_fkey" FOREIGN KEY ("firstPreferenceId") REFERENCES "MinorSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinorSpecializationPreference" ADD CONSTRAINT "MinorSpecializationPreference_secondPreferenceId_fkey" FOREIGN KEY ("secondPreferenceId") REFERENCES "MinorSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinorSpecializationPreference" ADD CONSTRAINT "MinorSpecializationPreference_thirdPreferenceId_fkey" FOREIGN KEY ("thirdPreferenceId") REFERENCES "MinorSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
