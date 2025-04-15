-- CreateIndex
CREATE INDEX "Course_departmentId_idx" ON "Course"("departmentId");

-- CreateIndex
CREATE INDEX "StandaloneAllotment_studentId_idx" ON "StandaloneAllotment"("studentId");

-- CreateIndex
CREATE INDEX "StandaloneSubjectPreference_subjectId_idx" ON "StandaloneSubjectPreference"("subjectId");

-- CreateIndex
CREATE INDEX "StandaloneSubjectPreference_studentId_idx" ON "StandaloneSubjectPreference"("studentId");

-- CreateIndex
CREATE INDEX "Subject_batchId_idx" ON "Subject"("batchId");

-- CreateIndex
CREATE INDEX "Subject_semesterId_idx" ON "Subject"("semesterId");

-- CreateIndex
CREATE INDEX "Subject_departmentId_idx" ON "Subject"("departmentId");

-- CreateIndex
CREATE INDEX "SubjectCourseWithSeats_subjectId_idx" ON "SubjectCourseWithSeats"("subjectId");
