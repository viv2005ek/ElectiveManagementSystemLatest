/*
  Warnings:

  - You are about to drop the column `BranchId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `BranchName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `DepartmentId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `DepartmentName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `SampleTable` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `allotedSeats` to the `ProgrammeElectiveAllotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch` to the `ProgrammeElectiveAllotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSeats` to the `ProgrammeElectiveAllotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minorSpecializationId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgrammeElectiveAllotment" ADD COLUMN     "allotedSeats" INTEGER NOT NULL,
ADD COLUMN     "batch" INTEGER NOT NULL,
ADD COLUMN     "totalSeats" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "BranchId",
DROP COLUMN "BranchName",
DROP COLUMN "DepartmentId",
DROP COLUMN "DepartmentName",
ADD COLUMN     "batch" INTEGER NOT NULL,
ADD COLUMN     "branchId" TEXT NOT NULL,
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "minorSpecializationId" TEXT NOT NULL,
ADD COLUMN     "profilePictureId" TEXT,
ADD COLUMN     "section" TEXT NOT NULL;

-- DropTable
DROP TABLE "SampleTable";

-- CreateTable
CREATE TABLE "MinorSpecializationAllotment" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "minorSpecializationId" TEXT NOT NULL,

    CONSTRAINT "MinorSpecializationAllotment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_minorSpecializationId_fkey" FOREIGN KEY ("minorSpecializationId") REFERENCES "MinorSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinorSpecializationAllotment" ADD CONSTRAINT "MinorSpecializationAllotment_minorSpecializationId_fkey" FOREIGN KEY ("minorSpecializationId") REFERENCES "MinorSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
