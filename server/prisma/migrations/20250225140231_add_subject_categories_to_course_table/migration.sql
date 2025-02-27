-- CreateTable
CREATE TABLE "_CourseToSubjectCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToSubjectCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToSubjectCategory_B_index" ON "_CourseToSubjectCategory"("B");

-- AddForeignKey
ALTER TABLE "_CourseToSubjectCategory" ADD CONSTRAINT "_CourseToSubjectCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToSubjectCategory" ADD CONSTRAINT "_CourseToSubjectCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
