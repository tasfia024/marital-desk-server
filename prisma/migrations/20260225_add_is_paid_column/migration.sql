-- Add isPaid column to MarriageApplication
ALTER TABLE "MarriageApplication" ADD COLUMN "isPaid" BOOLEAN NOT NULL DEFAULT false;
