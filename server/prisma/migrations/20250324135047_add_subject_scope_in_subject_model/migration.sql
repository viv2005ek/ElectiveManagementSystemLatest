/*
  Warnings:

  - You are about to drop the column `semester` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `subjectScope` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "semester",
ADD COLUMN     "semesterId" TEXT,
ADD COLUMN     "subjectScope" "SubjectScope" NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;
