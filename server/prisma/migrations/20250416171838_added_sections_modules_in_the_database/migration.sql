-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "sectionId" TEXT;

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectiveSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "professorId" TEXT,

    CONSTRAINT "ElectiveSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubjectSections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectSections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ElectiveSection_subjectId_courseId_name_key" ON "ElectiveSection"("subjectId", "courseId", "name");

-- CreateIndex
CREATE INDEX "_SubjectSections_B_index" ON "_SubjectSections"("B");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectiveSection" ADD CONSTRAINT "ElectiveSection_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectiveSection" ADD CONSTRAINT "ElectiveSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectiveSection" ADD CONSTRAINT "ElectiveSection_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectSections" ADD CONSTRAINT "_SubjectSections_A_fkey" FOREIGN KEY ("A") REFERENCES "ElectiveSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectSections" ADD CONSTRAINT "_SubjectSections_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
