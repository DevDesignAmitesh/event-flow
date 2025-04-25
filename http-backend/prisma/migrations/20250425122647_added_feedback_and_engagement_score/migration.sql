-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attendeeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "confirmedAttendance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "organizerResponsiveness" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "registrationCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "attendanceConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "feedback" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
