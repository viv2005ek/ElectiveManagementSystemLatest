/*
  Warnings:

  - You are about to drop the column `isStandalone` on the `ProgrammeElective` table. All the data in the column will be lost.
  - You are about to drop the column `allotedSeats` on the `ProgrammeElectiveAllotment` table. All the data in the column will be lost.
  - You are about to drop the column `allotmentSemester` on the `ProgrammeElectiveAllotment` table. All the data in the column will be lost.
  - You are about to drop the column `batch` on the `ProgrammeElectiveAllotment` table. All the data in the column will be lost.
  - You are about to drop the column `electiveCourseCode` on the `ProgrammeElectiveAllotment` table. All the data in the column will be lost.
  - You are about to drop the column `electiveId` on the `ProgrammeElectiveAllotment` table. All the data in the column will be lost.
  - You are about to drop the column `electiveName` on the `ProgrammeElectiveAllotment` table. All the data in the column will be lost.
  - You are about to drop the column `totalSeats` on the `ProgrammeElectiveAllotment` table. All the data in the column will be lost.
  - You are about to alter the column `contactNumber` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to drop the `AdminCredential` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacultyCredential` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacultyProgrammeElectiveAllotment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MinorSpecializationAllotment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MinorSpecializationPreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgrammeElectivePreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentCredential` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[credentialId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[credentialId]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[credentialId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credentialId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credentialId` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programmeElectiveCourseId` to the `ProgrammeElectiveAllotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programmeElectiveId` to the `ProgrammeElectiveAllotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `ProgrammeElectiveAllotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credentialId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'FACULTY', 'ADMIN');

-- DropForeignKey
ALTER TABLE "FacultyProgrammeElectiveAllotment" DROP CONSTRAINT "FacultyProgrammeElectiveAllotment_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "MinorSpecializationAllotment" DROP CONSTRAINT "MinorSpecializationAllotment_minorSpecializationId_fkey";

-- DropForeignKey
ALTER TABLE "MinorSpecializationPreference" DROP CONSTRAINT "MinorSpecializationPreference_firstPreferenceId_fkey";

-- DropForeignKey
ALTER TABLE "MinorSpecializationPreference" DROP CONSTRAINT "MinorSpecializationPreference_secondPreferenceId_fkey";

-- DropForeignKey
ALTER TABLE "MinorSpecializationPreference" DROP CONSTRAINT "MinorSpecializationPreference_studentId_fkey";

-- DropForeignKey
ALTER TABLE "MinorSpecializationPreference" DROP CONSTRAINT "MinorSpecializationPreference_thirdPreferenceId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectivePreference" DROP CONSTRAINT "ProgrammeElectivePreference_firstPreferenceId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectivePreference" DROP CONSTRAINT "ProgrammeElectivePreference_secondPreferenceId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectivePreference" DROP CONSTRAINT "ProgrammeElectivePreference_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeElectivePreference" DROP CONSTRAINT "ProgrammeElectivePreference_thirdPreferenceId_fkey";

-- DropIndex
DROP INDEX "MinorSpecialization_name_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "credentialId" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "credentialId" TEXT NOT NULL,
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MinorSpecialization" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProgrammeElective" DROP COLUMN "isStandalone",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isIndependentCourse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProgrammeElectiveAllotment" DROP COLUMN "allotedSeats",
DROP COLUMN "allotmentSemester",
DROP COLUMN "batch",
DROP COLUMN "electiveCourseCode",
DROP COLUMN "electiveId",
DROP COLUMN "electiveName",
DROP COLUMN "totalSeats",
ADD COLUMN     "programmeElectiveCourseId" TEXT NOT NULL,
ADD COLUMN     "programmeElectiveId" TEXT NOT NULL,
ADD COLUMN     "semester" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "credentialId" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "contactNumber" SET DATA TYPE VARCHAR(15),
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- DropTable
DROP TABLE "AdminCredential";

-- DropTable
DROP TABLE "FacultyCredential";

-- DropTable
DROP TABLE "FacultyProgrammeElectiveAllotment";

-- DropTable
DROP TABLE "MinorSpecializationAllotment";

-- DropTable
DROP TABLE "MinorSpecializationPreference";

-- DropTable
DROP TABLE "ProgrammeElectivePreference";

-- DropTable
DROP TABLE "StudentCredential";

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinorSpecializationChoice" (
    "id" TEXT NOT NULL,
    "minorSpecializationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "preferenceRank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinorSpecializationChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinorSpecializationAllotmentWindow" (
    "id" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "batch" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "totalSeats" INTEGER,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinorSpecializationAllotmentWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeElectiveCourse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "batch" INTEGER NOT NULL,
    "enrollmentIsActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgrammeElectiveCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeElectiveChoice" (
    "id" TEXT NOT NULL,
    "programmeElectiveCourseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "preferenceRank" INTEGER NOT NULL,
    "programmeElectiveId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgrammeElectiveChoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credential_email_key" ON "Credential"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_registrationNumber_key" ON "Credential"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_credentialId_key" ON "Admin"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_credentialId_key" ON "Faculty"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_credentialId_key" ON "Student"("credentialId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinorSpecializationChoice" ADD CONSTRAINT "MinorSpecializationChoice_minorSpecializationId_fkey" FOREIGN KEY ("minorSpecializationId") REFERENCES "MinorSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinorSpecializationChoice" ADD CONSTRAINT "MinorSpecializationChoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveChoice" ADD CONSTRAINT "ProgrammeElectiveChoice_programmeElectiveCourseId_fkey" FOREIGN KEY ("programmeElectiveCourseId") REFERENCES "ProgrammeElectiveCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveChoice" ADD CONSTRAINT "ProgrammeElectiveChoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveChoice" ADD CONSTRAINT "ProgrammeElectiveChoice_programmeElectiveId_fkey" FOREIGN KEY ("programmeElectiveId") REFERENCES "ProgrammeElective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveAllotment" ADD CONSTRAINT "ProgrammeElectiveAllotment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveAllotment" ADD CONSTRAINT "ProgrammeElectiveAllotment_programmeElectiveCourseId_fkey" FOREIGN KEY ("programmeElectiveCourseId") REFERENCES "ProgrammeElectiveCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveAllotment" ADD CONSTRAINT "ProgrammeElectiveAllotment_programmeElectiveId_fkey" FOREIGN KEY ("programmeElectiveId") REFERENCES "ProgrammeElective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
