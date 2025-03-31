/*
  Warnings:

  - You are about to drop the `_CourseBucketToCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CourseBucketToCourse" DROP CONSTRAINT "_CourseBucketToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseBucketToCourse" DROP CONSTRAINT "_CourseBucketToCourse_B_fkey";

-- AlterTable
ALTER TABLE "CourseBucket" ADD COLUMN     "courseId" TEXT;

-- DropTable
DROP TABLE "_CourseBucketToCourse";
