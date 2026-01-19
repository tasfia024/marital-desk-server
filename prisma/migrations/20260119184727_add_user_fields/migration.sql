/*
  Warnings:

  - A unique constraint covering the columns `[nid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "nid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_nid_key" ON "User"("nid");
