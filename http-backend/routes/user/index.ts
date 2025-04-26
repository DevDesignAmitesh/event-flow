import { Request, Response, Router } from "express";
import { middleware } from "../../middleware";
import { prisma } from "../../prisma/src";
import { notifyEventSubscription } from "../../hooks";

const userRouter = Router();

// Register for Event (Attendee)
userRouter.post(
  "/register/:eventId",
  middleware, // Ensure the user is authenticated and authorized as attendee
  async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user.userId; // Attendee's user ID from middleware
    const email = (req as any).user.email; // Attendee's user ID from middleware
    const eventId = req.params.eventId;

    try {
      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if the user is already registered for the event
      const existingRegistration = await prisma.registration.findUnique({
        where: {
          attendeeId_eventId: {
            attendeeId: userId,
            eventId: eventId,
          },
        },
      });

      if (existingRegistration) {
        return res
          .status(400)
          .json({ message: "You are already registered for this event" });
      }

      // Register the user for the event
      const registration = await prisma.registration.create({
        data: {
          attendeeId: userId,
          eventId: eventId,
        },
      });

      await notifyEventSubscription(email, event.id);

      await prisma.auditLog.create({
        data: {
          action: "REGISTER_FOR_EVENT",
          userId: userId,
          userRole: "attendee",
          eventId: eventId,
          description: `User with ID "${userId}" registered for event "${event.title}".`,
        },
      });

      return res.status(201).json({
        message: "Successfully registered for the event",
        registration,
      });
    } catch (error) {
      console.error("Error registering for event:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Unregister from Event (Attendee)
userRouter.delete(
  "/unregister/:eventId",
  middleware, // Ensure the user is authenticated and authorized as attendee
  async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user.userId; // Attendee's user ID from middleware
    const eventId = req.params.eventId;

    try {
      const registration = await prisma.registration.findUnique({
        where: {
          attendeeId_eventId: {
            attendeeId: userId,
            eventId: eventId,
          },
        },
      });

      if (!registration) {
        return res
          .status(404)
          .json({ message: "You are not registered for this event" });
      }

      // Unregister the user from the event
      await prisma.registration.delete({
        where: {
          id: registration.id,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "UNREGISTER_FROM_EVENT",
          userId: userId,
          userRole: "attendee",
          eventId: eventId,
          description: `User with ID "${userId}" unregistered from event "${eventId}".`,
        },
      });

      return res
        .status(200)
        .json({ message: "Successfully unregistered from the event" });
    } catch (error) {
      console.error("Error unregistering from event:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

userRouter.get(
  "/upcoming",
  middleware, // Ensure the user is authenticated and authorized as attendee
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).user.userId; // Logged-in user's ID from middleware

      const upcomingEvents = await prisma.event.findMany({
        include: {
          organizer: true,
          registrations: {
            include: {
              attendee: true,
            },
          },
        },
      });

      const eventsWithRegistrationStatus = upcomingEvents.map((event) => {
        const isRegistered = event.registrations.some(
          (registration) => registration.attendeeId === userId
        );

        return {
          ...event, // Keep all existing event data
          isRegistered, // Add new field
        };
      });

      return res.status(200).json(eventsWithRegistrationStatus);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default userRouter;
