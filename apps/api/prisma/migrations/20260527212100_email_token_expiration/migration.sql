-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerificationExpiresAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "passwordResetExpiresAt" DATETIME;
