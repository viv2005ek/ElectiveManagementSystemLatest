-- CreateTable
CREATE TABLE "StudentCredentials" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "StudentCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyCredentials" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "FacultyCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCredentials" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "AdminCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDetails" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "DepartmentId" TEXT NOT NULL,
    "DepartmentName" TEXT NOT NULL,
    "BranchId" TEXT NOT NULL,
    "BranchName" TEXT NOT NULL,

    CONSTRAINT "StudentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyDetails" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "FacultyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeElective" (
    "id" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,

    CONSTRAINT "ProgrammeElective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeElectiveAllotment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "electiveId" TEXT NOT NULL,
    "electiveName" TEXT NOT NULL,
    "electiveCourseCode" TEXT NOT NULL,
    "allotmentSemester" INTEGER NOT NULL,

    CONSTRAINT "ProgrammeElectiveAllotment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyElectiveAllotment" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "electiveId" TEXT NOT NULL,
    "electiveName" TEXT NOT NULL,
    "electiveCourseCode" TEXT NOT NULL,
    "allotmentSemester" INTEGER NOT NULL,

    CONSTRAINT "FacultyElectiveAllotment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemesterBranchPermissions" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "enrollmentIsActive" BOOLEAN NOT NULL,
    "changePeriodIsActive" BOOLEAN NOT NULL,

    CONSTRAINT "SemesterBranchPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "currentProgrammeElectiveId" TEXT NOT NULL,
    "requestedProgrammeElectiveId" TEXT NOT NULL,

    CONSTRAINT "ChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentCredentials_registrationNumber_key" ON "StudentCredentials"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCredentials_email_key" ON "StudentCredentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyCredentials_registrationNumber_key" ON "FacultyCredentials"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyCredentials_email_key" ON "FacultyCredentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCredentials_registrationNumber_key" ON "AdminCredentials"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCredentials_email_key" ON "AdminCredentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDetails_registrationNumber_key" ON "StudentDetails"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDetails_email_key" ON "StudentDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyDetails_registrationNumber_key" ON "FacultyDetails"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyDetails_email_key" ON "FacultyDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProgrammeElective_courseCode_key" ON "ProgrammeElective"("courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProgrammeElective_name_key" ON "ProgrammeElective"("name");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_currentProgrammeElectiveId_fkey" FOREIGN KEY ("currentProgrammeElectiveId") REFERENCES "ProgrammeElective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_requestedProgrammeElectiveId_fkey" FOREIGN KEY ("requestedProgrammeElectiveId") REFERENCES "ProgrammeElective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
