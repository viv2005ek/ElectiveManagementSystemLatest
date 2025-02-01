-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_minorSpecializationId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "minorSpecializationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_minorSpecializationId_fkey" FOREIGN KEY ("minorSpecializationId") REFERENCES "MinorSpecialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
