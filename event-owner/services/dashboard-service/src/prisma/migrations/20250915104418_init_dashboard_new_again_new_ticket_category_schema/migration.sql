/*
  Warnings:

  - You are about to drop the column `name` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `soldQuantity` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "quantity",
DROP COLUMN "soldQuantity";

-- AlterTable
ALTER TABLE "public"."TicketInstance" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "public"."TicketCategory" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "soldQuantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TicketCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TicketCategory" ADD CONSTRAINT "TicketCategory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketInstance" ADD CONSTRAINT "TicketInstance_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."TicketCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
