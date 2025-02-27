/*
  Warnings:

  - You are about to drop the column `allotmentType` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `Allotment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isDeleted` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `CourseBucket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPreferenceWindowOpen` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectTypeId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Allotment" DROP CONSTRAINT "Allotment_courseBucketId_fkey";

-- DropForeignKey
ALTER TABLE "Allotment" DROP CONSTRAINT "Allotment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Allotment" DROP CONSTRAINT "Allotment_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "Allotment" DROP CONSTRAINT "Allotment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Allotment" DROP CONSTRAINT "Allotment_subjectId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "CourseBucket" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "allotmentType",
ADD COLUMN     "isAllotmentFinalized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPreferenceWindowOpen" BOOLEAN NOT NULL,
ADD COLUMN     "subjectTypeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Allotment";

-- DropTable
DROP TABLE "CourseCategory";

-- CreateTable
CREATE TABLE "SubjectType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "allotmentType" "AllotmentType" NOT NULL,
    "allowAnyDepartment" BOOLEAN NOT NULL,
    "allowSameFaculty" BOOLEAN NOT NULL,
    "allowSameSchool" BOOLEAN NOT NULL,
    "allowSameDepartment" BOOLEAN NOT NULL,

    CONSTRAINT "SubjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandaloneSubjectPreference" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "preferenceRank" INTEGER NOT NULL,

    CONSTRAINT "StandaloneSubjectPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketSubjectPreference" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseBucketId" TEXT NOT NULL,
    "preferenceRank" INTEGER NOT NULL,

    CONSTRAINT "BucketSubjectPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandaloneAllotment" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "allotmentStatus" "AllotmentStatus" NOT NULL,

    CONSTRAINT "StandaloneAllotment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketAllotment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "courseBucketId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "allotmentStatus" "AllotmentStatus" NOT NULL,

    CONSTRAINT "BucketAllotment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectType_name_key" ON "SubjectType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneSubjectPreference_subjectId_studentId_preferenceR_key" ON "StandaloneSubjectPreference"("subjectId", "studentId", "preferenceRank");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneSubjectPreference_subjectId_studentId_courseId_key" ON "StandaloneSubjectPreference"("subjectId", "studentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "BucketSubjectPreference_subjectId_studentId_preferenceRank_key" ON "BucketSubjectPreference"("subjectId", "studentId", "preferenceRank");

-- CreateIndex
CREATE UNIQUE INDEX "BucketSubjectPreference_subjectId_studentId_courseBucketId_key" ON "BucketSubjectPreference"("subjectId", "studentId", "courseBucketId");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subjectTypeId_fkey" FOREIGN KEY ("subjectTypeId") REFERENCES "SubjectType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneSubjectPreference" ADD CONSTRAINT "StandaloneSubjectPreference_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketSubjectPreference" ADD CONSTRAINT "BucketSubjectPreference_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneAllotment" ADD CONSTRAINT "StandaloneAllotment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneAllotment" ADD CONSTRAINT "StandaloneAllotment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneAllotment" ADD CONSTRAINT "StandaloneAllotment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneAllotment" ADD CONSTRAINT "StandaloneAllotment_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketAllotment" ADD CONSTRAINT "BucketAllotment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketAllotment" ADD CONSTRAINT "BucketAllotment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketAllotment" ADD CONSTRAINT "BucketAllotment_courseBucketId_fkey" FOREIGN KEY ("courseBucketId") REFERENCES "CourseBucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketAllotment" ADD CONSTRAINT "BucketAllotment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketAllotment" ADD CONSTRAINT "BucketAllotment_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
