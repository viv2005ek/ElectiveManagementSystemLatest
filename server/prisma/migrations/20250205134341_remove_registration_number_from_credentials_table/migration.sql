/*
  Warnings:

  - You are about to drop the column `registrationNumber` on the `Credential` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Credential_registrationNumber_key";

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "registrationNumber";
