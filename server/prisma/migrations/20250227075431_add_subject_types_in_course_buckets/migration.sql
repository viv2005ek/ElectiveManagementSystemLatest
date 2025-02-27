-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "isPreferenceWindowOpen" SET DEFAULT false;

-- CreateTable
CREATE TABLE "_CourseBucketToSubjectTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseBucketToSubjectTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseBucketToSubjectTypes_B_index" ON "_CourseBucketToSubjectTypes"("B");

-- AddForeignKey
ALTER TABLE "_CourseBucketToSubjectTypes" ADD CONSTRAINT "_CourseBucketToSubjectTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseBucketToSubjectTypes" ADD CONSTRAINT "_CourseBucketToSubjectTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
