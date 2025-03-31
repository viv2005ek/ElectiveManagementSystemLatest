/*
  Warnings:

  - You are about to drop the `_subjectCourseBuckets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_subjectCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_subjectCourseBuckets" DROP CONSTRAINT "_subjectCourseBuckets_A_fkey";

-- DropForeignKey
ALTER TABLE "_subjectCourseBuckets" DROP CONSTRAINT "_subjectCourseBuckets_B_fkey";

-- DropForeignKey
ALTER TABLE "_subjectCourses" DROP CONSTRAINT "_subjectCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_subjectCourses" DROP CONSTRAINT "_subjectCourses_B_fkey";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "courseBucketId" TEXT,
ADD COLUMN     "courseId" TEXT;

-- DropTable
DROP TABLE "_subjectCourseBuckets";

-- DropTable
DROP TABLE "_subjectCourses";
