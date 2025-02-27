/*
  Warnings:

  - You are about to drop the column `allowAnyDepartment` on the `SubjectType` table. All the data in the column will be lost.
  - You are about to drop the column `allowSameDepartment` on the `SubjectType` table. All the data in the column will be lost.
  - You are about to drop the column `allowSameFaculty` on the `SubjectType` table. All the data in the column will be lost.
  - You are about to drop the column `allowSameSchool` on the `SubjectType` table. All the data in the column will be lost.
  - Added the required column `scope` to the `SubjectType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectScope" AS ENUM ('AnyDepartment', 'SameFaculty', 'SameSchool', 'SameDepartment');

-- AlterTable
ALTER TABLE "SubjectType" DROP COLUMN "allowAnyDepartment",
DROP COLUMN "allowSameDepartment",
DROP COLUMN "allowSameFaculty",
DROP COLUMN "allowSameSchool",
ADD COLUMN     "scope" "SubjectScope" NOT NULL;
