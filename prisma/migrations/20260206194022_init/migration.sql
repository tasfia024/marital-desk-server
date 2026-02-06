-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('pending', 'married', 'divorced');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'checked', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mobile" TEXT,
    "address" TEXT,
    "age" INTEGER,
    "dob" TIMESTAMP(3),
    "gender" TEXT,
    "image" TEXT,
    "nid" TEXT,
    "status" VARCHAR(50) DEFAULT 'active',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaziApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nid" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "officeAddress" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,
    "photo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KaziApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarriageApplication" (
    "id" TEXT NOT NULL,
    "groomId" TEXT NOT NULL,
    "groomFather" TEXT NOT NULL,
    "groomMother" TEXT NOT NULL,
    "groomReligion" TEXT NOT NULL,
    "groomOccupation" TEXT NOT NULL,
    "groomEducation" TEXT NOT NULL,
    "groomAddress" TEXT NOT NULL,
    "brideId" TEXT NOT NULL,
    "brideFather" TEXT NOT NULL,
    "brideMother" TEXT NOT NULL,
    "brideOccupation" TEXT NOT NULL,
    "brideEducation" TEXT NOT NULL,
    "brideReligion" TEXT NOT NULL,
    "brideAddress" TEXT NOT NULL,
    "kaziId" TEXT,
    "proposalDate" TIMESTAMP(3),
    "marriageDate" TIMESTAMP(3),
    "approvalDate" TIMESTAMP(3),
    "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'pending',
    "proposalStatus" "ProposalStatus" NOT NULL DEFAULT 'pending',
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "proposedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarriageApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nid_key" ON "User"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_email_key" ON "KaziApplication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_phone_key" ON "KaziApplication"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_nid_key" ON "KaziApplication"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_registrationNo_key" ON "KaziApplication"("registrationNo");

-- CreateIndex
CREATE INDEX "MarriageApplication_groomId_idx" ON "MarriageApplication"("groomId");

-- CreateIndex
CREATE INDEX "MarriageApplication_brideId_idx" ON "MarriageApplication"("brideId");

-- CreateIndex
CREATE INDEX "MarriageApplication_kaziId_idx" ON "MarriageApplication"("kaziId");
