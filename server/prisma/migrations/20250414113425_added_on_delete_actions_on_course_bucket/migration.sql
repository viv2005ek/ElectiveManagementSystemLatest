-- DropForeignKey
ALTER TABLE "CourseBucketCourse" DROP CONSTRAINT "CourseBucketCourse_courseBucketId_fkey";

-- DropForeignKey
ALTER TABLE "CourseBucketCourse" DROP CONSTRAINT "CourseBucketCourse_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "semesterId" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "cgpa" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBucketCourse" ADD CONSTRAINT "CourseBucketCourse_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBucketCourse" ADD CONSTRAINT "CourseBucketCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
