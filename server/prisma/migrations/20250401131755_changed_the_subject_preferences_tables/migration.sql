/*
  Warnings:

  - You are about to drop the column `courseBucketId` on the `BucketSubjectPreference` table. All the data in the column will be lost.
  - You are about to drop the column `preferenceRank` on the `BucketSubjectPreference` table. All the data in the column will be lost.
  - You are about to drop the column `preferenceRank` on the `StandaloneSubjectPreference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subjectId,studentId]` on the table `BucketSubjectPreference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectId,studentId]` on the table `StandaloneSubjectPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BucketSubjectPreference" DROP CONSTRAINT "BucketSubjectPreference_courseBucketId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneSubjectPreference" DROP CONSTRAINT "StandaloneSubjectPreference_courseId_fkey";

-- DropIndex
DROP INDEX "BucketSubjectPreference_subjectId_studentId_courseBucketId_key";

-- DropIndex
DROP INDEX "BucketSubjectPreference_subjectId_studentId_preferenceRank_key";

-- DropIndex
DROP INDEX "StandaloneSubjectPreference_subjectId_studentId_courseId_key";

-- DropIndex
DROP INDEX "StandaloneSubjectPreference_subjectId_studentId_preferenceR_key";

-- AlterTable
ALTER TABLE "BucketSubjectPreference" DROP COLUMN "courseBucketId",
DROP COLUMN "preferenceRank",
ADD COLUMN     "firstPreferenceCourseBucketId" TEXT,
ADD COLUMN     "secondPreferenceCourseBucketId" TEXT,
ADD COLUMN     "thirdPreferenceCourseBucketId" TEXT;

-- AlterTable
ALTER TABLE "StandaloneSubjectPreference" DROP COLUMN "preferenceRank",
ADD COLUMN     "firstPreferenceCourseId" TEXT,
ADD COLUMN     "secondPreferenceCourseId" TEXT,
ADD COLUMN     "thirdPreferenceCourseId" TEXT,
ALTER COLUMN "courseId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BucketSubjectPreference_subjectId_studentId_key" ON "BucketSubjectPreference"("subjectId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneSubjectPreference_subjectId_studentId_key" ON "StandaloneSubjectPreference"("subjectId", "studentId");

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_firstPreferenceCourseId_fkey" FOREIGN KEY ("firstPreferenceCourseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_secondPreferenceCourseId_fkey" FOREIGN KEY ("secondPreferenceCourseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_thirdPreferenceCourseId_fkey" FOREIGN KEY ("thirdPreferenceCourseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_firstPreferenceCourseBucketId_fkey" FOREIGN KEY ("firstPreferenceCourseBucketId") REFERENCES "CourseBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_secondPreferenceCourseBucketId_fkey" FOREIGN KEY ("secondPreferenceCourseBucketId") REFERENCES "CourseBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_thirdPreferenceCourseBucketId_fkey" FOREIGN KEY ("thirdPreferenceCourseBucketId") REFERENCES "CourseBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
