/*
  Warnings:

  - You are about to drop the column `courseBucketId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Subject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "courseBucketId",
DROP COLUMN "courseId";
