/*
  Warnings:

  - Added the required column `departmentId` to the `MinorSpecialization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MinorSpecialization" ADD COLUMN     "departmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MinorSpecialization" ADD CONSTRAINT "MinorSpecialization_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
