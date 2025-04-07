/*
  Warnings:

  - You are about to drop the column `changeRequested` on the `BucketSubjectPreference` table. All the data in the column will be lost.
  - You are about to drop the column `changeRequested` on the `StandaloneSubjectPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BucketSubjectPreference" DROP COLUMN "changeRequested";

-- AlterTable
ALTER TABLE "StandaloneSubjectPreference" DROP COLUMN "changeRequested";
