/*
  Warnings:

  - You are about to drop the column `venueId` on the `Event` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."TicketType" AS ENUM ('NORMAL', 'VR', 'VIP');

-- CreateEnum
CREATE TYPE "public"."SeatType" AS ENUM ('NORMAL', 'VR', 'VIP');

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "venueId";

-- AlterTable
ALTER TABLE "public"."Seat" DROP COLUMN "type",
ADD COLUMN     "type" "public"."SeatType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "type",
ADD COLUMN     "type" "public"."TicketType" NOT NULL;
