"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const src_1 = require("../../prisma/src");
const hooks_1 = require("../../hooks");
const userRouter = (0, express_1.Router)();
// Register for Event (Attendee)
userRouter.post("/register/:eventId", middleware_1.middleware, // Ensure the user is authenticated and authorized as attendee
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId; // Attendee's user ID from middleware
    const email = req.user.email; // Attendee's user ID from middleware
    const eventId = req.params.eventId;
    try {
        const event = yield src_1.prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Check if the user is already registered for the event
        const existingRegistration = yield src_1.prisma.registration.findUnique({
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
        const registration = yield src_1.prisma.registration.create({
            data: {
                attendeeId: userId,
                eventId: eventId,
            },
        });
        yield (0, hooks_1.notifyEventSubscription)(email, event.id);
        yield src_1.prisma.auditLog.create({
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
    }
    catch (error) {
        console.error("Error registering for event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// Unregister from Event (Attendee)
userRouter.delete("/unregister/:eventId", middleware_1.middleware, // Ensure the user is authenticated and authorized as attendee
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId; // Attendee's user ID from middleware
    const eventId = req.params.eventId;
    try {
        const registration = yield src_1.prisma.registration.findUnique({
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
        yield src_1.prisma.registration.delete({
            where: {
                id: registration.id,
            },
        });
        yield src_1.prisma.auditLog.create({
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
    }
    catch (error) {
        console.error("Error unregistering from event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
userRouter.get("/upcoming", middleware_1.middleware, // Ensure the user is authenticated and authorized as attendee
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId; // Logged-in user's ID from middleware
        const upcomingEvents = yield src_1.prisma.event.findMany({
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
            const isRegistered = event.registrations.some((registration) => registration.attendeeId === userId);
            return Object.assign(Object.assign({}, event), { // Keep all existing event data
                isRegistered });
        });
        return res.status(200).json(eventsWithRegistrationStatus);
    }
    catch (error) {
        console.error("Error fetching upcoming events:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = userRouter;
