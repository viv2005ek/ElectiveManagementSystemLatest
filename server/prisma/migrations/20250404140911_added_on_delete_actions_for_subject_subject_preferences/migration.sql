-- DropForeignKey
ALTER TABLE "BucketSubjectPreference" DROP CONSTRAINT "BucketSubjectPreference_firstPreferenceCourseBucketId_fkey";

-- DropForeignKey
ALTER TABLE "BucketSubjectPreference" DROP CONSTRAINT "BucketSubjectPreference_secondPreferenceCourseBucketId_fkey";

-- DropForeignKey
ALTER TABLE "BucketSubjectPreference" DROP CONSTRAINT "BucketSubjectPreference_studentId_fkey";

-- DropForeignKey
ALTER TABLE "BucketSubjectPreference" DROP CONSTRAINT "BucketSubjectPreference_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "BucketSubjectPreference" DROP CONSTRAINT "BucketSubjectPreference_thirdPreferenceCourseBucketId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneSubjectPreference" DROP CONSTRAINT "StandaloneSubjectPreference_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneSubjectPreference" DROP CONSTRAINT "StandaloneSubjectPreference_firstPreferenceCourseId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneSubjectPreference" DROP CONSTRAINT "StandaloneSubjectPreference_secondPreferenceCourseId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneSubjectPreference" DROP CONSTRAINT "StandaloneSubjectPreference_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneSubjectPreference" DROP CONSTRAINT "StandaloneSubjectPreference_thirdPreferenceCourseId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCourseBucketWithSeats" DROP CONSTRAINT "SubjectCourseBucketWithSeats_courseBucketId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCourseBucketWithSeats" DROP CONSTRAINT "SubjectCourseBucketWithSeats_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCourseWithSeats" DROP CONSTRAINT "SubjectCourseWithSeats_courseId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCourseWithSeats" DROP CONSTRAINT "SubjectCourseWithSeats_subjectId_fkey";

-- AddForeignKey
ALTER TABLE "SubjectCourseWithSeats" ADD CONSTRAINT "SubjectCourseWithSeats_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCourseWithSeats" ADD CONSTRAINT "SubjectCourseWithSeats_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCourseBucketWithSeats" ADD CONSTRAINT "SubjectCourseBucketWithSeats_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCourseBucketWithSeats" ADD CONSTRAINT "SubjectCourseBucketWithSeats_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_firstPreferenceCourseId_fkey" FOREIGN KEY ("firstPreferenceCourseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_secondPreferenceCourseId_fkey" FOREIGN KEY ("secondPreferenceCourseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_thirdPreferenceCourseId_fkey" FOREIGN KEY ("thirdPreferenceCourseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_firstPreferenceCourseBucketId_fkey" FOREIGN KEY ("firstPreferenceCourseBucketId") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_secondPreferenceCourseBucketId_fkey" FOREIGN KEY ("secondPreferenceCourseBucketId") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_thirdPreferenceCourseBucketId_fkey" FOREIGN KEY ("thirdPreferenceCourseBucketId") REFERENCES "CourseBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
