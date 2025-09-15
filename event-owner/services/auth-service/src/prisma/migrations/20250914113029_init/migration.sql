-- AlterEnum
ALTER TYPE "public"."OwnerRole" ADD VALUE 'PROMOTER';

-- AlterTable
ALTER TABLE "public"."EventOwner" ADD COLUMN     "emailTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerifyToken" TEXT,
ADD COLUMN     "phoneCodeExpiry" TIMESTAMP(3),
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneVerifyCode" TEXT;
