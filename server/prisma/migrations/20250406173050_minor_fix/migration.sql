/*
  Warnings:

  - You are about to drop the column `courseId` on the `StandaloneSubjectPreference` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StandaloneSubjectPreference" DROP CONSTRAINT "StandaloneSubjectPreference_courseId_fkey";

-- AlterTable
ALTER TABLE "StandaloneSubjectPreference" DROP COLUMN "courseId";
