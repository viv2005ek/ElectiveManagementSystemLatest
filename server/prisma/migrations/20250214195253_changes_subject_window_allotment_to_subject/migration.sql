/*
  Warnings:

  - You are about to drop the column `allotmentWindowId` on the `CourseAllotment` table. All the data in the column will be lost.
  - You are about to drop the column `allotmentWindowId` on the `SubjectPreferences` table. All the data in the column will be lost.
  - You are about to drop the `SubjectAllotmentWindow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectAllotmentWindowToBranch` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,courseId,subjectId]` on the table `CourseAllotment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,courseId,courseBucketId,subjectId]` on the table `SubjectPreferences` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subjectId` to the `CourseAllotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `SubjectPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseAllotment" DROP CONSTRAINT "CourseAllotment_allotmentWindowId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectPreferences" DROP CONSTRAINT "SubjectPreferences_allotmentWindowId_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectAllotmentWindowToBranch" DROP CONSTRAINT "_SubjectAllotmentWindowToBranch_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectAllotmentWindowToBranch" DROP CONSTRAINT "_SubjectAllotmentWindowToBranch_B_fkey";

-- DropIndex
DROP INDEX "CourseAllotment_studentId_courseId_allotmentWindowId_key";

-- DropIndex
DROP INDEX "SubjectPreferences_studentId_courseId_courseBucketId_allotm_key";

-- AlterTable
ALTER TABLE "CourseAllotment" DROP COLUMN "allotmentWindowId",
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubjectPreferences" DROP COLUMN "allotmentWindowId",
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "SubjectAllotmentWindow";

-- DropTable
DROP TABLE "_SubjectAllotmentWindowToBranch";

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "batch" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubjectToBranch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToBranch_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectToBranch_B_index" ON "_SubjectToBranch"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CourseAllotment_studentId_courseId_subjectId_key" ON "CourseAllotment"("studentId", "courseId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectPreferences_studentId_courseId_courseBucketId_subjec_key" ON "SubjectPreferences"("studentId", "courseId", "courseBucketId", "subjectId");

-- AddForeignKey
ALTER TABLE "SubjectPreferences" ADD CONSTRAINT "SubjectPreferences_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAllotment" ADD CONSTRAINT "CourseAllotment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToBranch" ADD CONSTRAINT "_SubjectToBranch_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToBranch" ADD CONSTRAINT "_SubjectToBranch_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
