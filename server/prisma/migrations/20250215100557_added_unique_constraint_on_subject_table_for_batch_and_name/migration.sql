/*
  Warnings:

  - A unique constraint covering the columns `[batch,name]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subject_batch_name_key" ON "Subject"("batch", "name");
