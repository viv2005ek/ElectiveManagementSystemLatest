/*
  Warnings:

  - Added the required column `departmentId` to the `ProgrammeElective` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgrammeElective" ADD COLUMN     "departmentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProgrammeElectiveCourseBranch" (
    "id" TEXT NOT NULL,
    "programmeElectiveCourseId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "ProgrammeElectiveCourseBranch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgrammeElectiveCourseBranch_programmeElectiveCourseId_bra_key" ON "ProgrammeElectiveCourseBranch"("programmeElectiveCourseId", "branchId");

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveCourseBranch" ADD CONSTRAINT "ProgrammeElectiveCourseBranch_programmeElectiveCourseId_fkey" FOREIGN KEY ("programmeElectiveCourseId") REFERENCES "ProgrammeElectiveCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElectiveCourseBranch" ADD CONSTRAINT "ProgrammeElectiveCourseBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeElective" ADD CONSTRAINT "ProgrammeElective_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
