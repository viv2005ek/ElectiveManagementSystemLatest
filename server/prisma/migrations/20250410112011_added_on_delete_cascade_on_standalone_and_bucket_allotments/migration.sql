-- DropForeignKey
ALTER TABLE "BucketAllotment" DROP CONSTRAINT "BucketAllotment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneAllotment" DROP CONSTRAINT "StandaloneAllotment_subjectId_fkey";

-- AddForeignKey
ALTER TABLE "StandaloneAllotment" ADD CONSTRAINT "StandaloneAllotment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketAllotment" ADD CONSTRAINT "BucketAllotment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
