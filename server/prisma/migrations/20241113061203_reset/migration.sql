/*
  Warnings:

  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgrammeElective` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserSections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProgrammeElective" DROP CONSTRAINT "ProgrammeElective_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_programmeElectiveId_fkey";

-- DropForeignKey
ALTER TABLE "_UserSections" DROP CONSTRAINT "_UserSections_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSections" DROP CONSTRAINT "_UserSections_B_fkey";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "ProgrammeElective";

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_UserSections";

-- DropEnum
DROP TYPE "Role";
