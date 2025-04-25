/*
  Warnings:

  - A unique constraint covering the columns `[attendeeId,eventId]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rating` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "rating" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_attendeeId_eventId_key" ON "Feedback"("attendeeId", "eventId");
