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

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_email_key" ON "KaziApplication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_phone_key" ON "KaziApplication"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_nid_key" ON "KaziApplication"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "KaziApplication_registrationNo_key" ON "KaziApplication"("registrationNo");
