-- CreateTable
CREATE TABLE "SampleTable" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SampleTable_firstName_key" ON "SampleTable"("firstName");
