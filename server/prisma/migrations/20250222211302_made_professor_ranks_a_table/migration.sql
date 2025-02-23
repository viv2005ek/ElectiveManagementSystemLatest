/*
  Warnings:

  - You are about to drop the column `professorRank` on the `Professor` table. All the data in the column will be lost.
  - Added the required column `professorRankId` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programType` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "professorRank",
ADD COLUMN     "professorRankId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "programType" "ProgramType" NOT NULL;

-- DropEnum
DROP TYPE "ProfessorRank";

-- CreateTable
CREATE TABLE "ProfessorRank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "ProfessorRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorRank_name_key" ON "ProfessorRank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorRank_priority_key" ON "ProfessorRank"("priority");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_professorRankId_fkey" FOREIGN KEY ("professorRankId") REFERENCES "ProfessorRank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
