/*
  Warnings:

  - The `virtualType` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `layoutType` on the `Venue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."VirtualType" AS ENUM ('VR', 'LIVE', 'BOTH');

-- CreateEnum
CREATE TYPE "public"."LayoutType" AS ENUM ('FOOTBALL_STADIUM', 'CONFERENCE', 'SHOW');

-- DropIndex
DROP INDEX "public"."Venue_eventId_key";

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "virtualType",
ADD COLUMN     "virtualType" "public"."VirtualType";

-- AlterTable
ALTER TABLE "public"."Venue" DROP COLUMN "layoutType",
ADD COLUMN     "layoutType" "public"."LayoutType" NOT NULL;
