-- CreateTable
CREATE TABLE "_SubjectToCourseBucket" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToCourseBucket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectToCourseBucket_B_index" ON "_SubjectToCourseBucket"("B");

-- AddForeignKey
ALTER TABLE "_SubjectToCourseBucket" ADD CONSTRAINT "_SubjectToCourseBucket_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToCourseBucket" ADD CONSTRAINT "_SubjectToCourseBucket_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
