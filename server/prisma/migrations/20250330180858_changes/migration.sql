/*
  Warnings:

  - Added the required column `updatedAt` to the `BucketSubjectPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StandaloneSubjectPreference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BucketSubjectPreference" ADD COLUMN     "changeRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "runAllotment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StandaloneSubjectPreference" ADD COLUMN     "changeRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "runAllotment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
