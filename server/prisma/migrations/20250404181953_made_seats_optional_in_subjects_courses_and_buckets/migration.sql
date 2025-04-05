-- AlterTable
ALTER TABLE "SubjectCourseBucketWithSeats" ALTER COLUMN "totalSeats" DROP NOT NULL,
ALTER COLUMN "availableSeats" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SubjectCourseWithSeats" ALTER COLUMN "totalSeats" DROP NOT NULL,
ALTER COLUMN "availableSeats" DROP NOT NULL;
