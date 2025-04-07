/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `BucketSubjectPreference` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StandaloneSubjectPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BucketSubjectPreference" DROP COLUMN "updatedAt",
ALTER COLUMN "firstPreferenceCourseBucketId" DROP NOT NULL,
ALTER COLUMN "secondPreferenceCourseBucketId" DROP NOT NULL,
ALTER COLUMN "thirdPreferenceCourseBucketId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StandaloneSubjectPreference" DROP COLUMN "updatedAt",
ALTER COLUMN "firstPreferenceCourseId" DROP NOT NULL,
ALTER COLUMN "secondPreferenceCourseId" DROP NOT NULL,
ALTER COLUMN "thirdPreferenceCourseId" DROP NOT NULL;
