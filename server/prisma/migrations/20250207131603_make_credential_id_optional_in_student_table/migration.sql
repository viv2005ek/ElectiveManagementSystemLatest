-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_credentialId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "credentialId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
