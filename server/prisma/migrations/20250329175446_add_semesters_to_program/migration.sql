-- CreateTable
CREATE TABLE "_ProgramToSemesters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProgramToSemesters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProgramToSemesters_B_index" ON "_ProgramToSemesters"("B");

-- AddForeignKey
ALTER TABLE "_ProgramToSemesters" ADD CONSTRAINT "_ProgramToSemesters_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramToSemesters" ADD CONSTRAINT "_ProgramToSemesters_B_fkey" FOREIGN KEY ("B") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
