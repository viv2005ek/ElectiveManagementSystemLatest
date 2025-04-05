/*
  Warnings:

  - Made the column `firstPreferenceCourseBucketId` on table `BucketSubjectPreference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `secondPreferenceCourseBucketId` on table `BucketSubjectPreference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thirdPreferenceCourseBucketId` on table `BucketSubjectPreference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstPreferenceCourseId` on table `StandaloneSubjectPreference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `secondPreferenceCourseId` on table `StandaloneSubjectPreference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thirdPreferenceCourseId` on table `StandaloneSubjectPreference` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BucketSubjectPreference" ALTER COLUMN "firstPreferenceCourseBucketId" SET NOT NULL,
ALTER COLUMN "secondPreferenceCourseBucketId" SET NOT NULL,
ALTER COLUMN "thirdPreferenceCourseBucketId" SET NOT NULL;

-- AlterTable
ALTER TABLE "StandaloneSubjectPreference" ALTER COLUMN "firstPreferenceCourseId" SET NOT NULL,
ALTER COLUMN "secondPreferenceCourseId" SET NOT NULL,
ALTER COLUMN "thirdPreferenceCourseId" SET NOT NULL;
