-- DropForeignKey
ALTER TABLE "ProgrammeElective" DROP CONSTRAINT "ProgrammeElective_departmentId_fkey";

-- AlterTable
ALTER TABLE "ProgrammeElective" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProgrammeElective" ADD CONSTRAINT "ProgrammeElective_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
