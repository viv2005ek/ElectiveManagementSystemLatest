/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MinorSpecialization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MinorSpecialization_name_key" ON "MinorSpecialization"("name");
