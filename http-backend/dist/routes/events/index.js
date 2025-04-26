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
const eventRouter = (0, express_1.Router)();
// Create Event
eventRouter.post("/create", middleware_1.middleware, // Ensure the user is authenticated and authorized as organizer
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "Your are not organizer" });
    }
    const { title, description, date } = req.body;
    if (!title || !date) {
        return res
            .status(400)
            .json({ message: "Event title and date are required" });
    }
    try {
        // Create a new event linked to the logged-in organizer
        const event = yield src_1.prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date), // Ensure proper date format
                organizerId: req.user.userId, // Using user ID from the middleware
            },
        });
        yield src_1.prisma.auditLog.create({
            data: {
                action: "CREATE_EVENT",
                userId: req.user.userId,
                userRole: req.user.role,
                eventId: event.id,
                description: `Event "${event.title}" created by organizer.`,
            },
        });
        return res.status(201).json(event);
    }
    catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// Edit Event
eventRouter.put("/edit/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "Your are not organizer" });
    }
    const eventId = req.params.id;
    const { title, description, date } = req.body;
    if (!title || !date) {
        return res
            .status(400)
            .json({ message: "Event title and date are required" });
    }
    try {
        const event = yield src_1.prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Check if the logged-in user is the organizer of the event
        if (event.organizerId !== req.user.userId) {
            return res.status(403).json({
                message: "Unauthorized: You are not the organizer of this event",
            });
        }
        const updatedEvent = yield src_1.prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                description,
                date: new Date(date), // Ensure proper date format
            },
        });
        yield src_1.prisma.auditLog.create({
            data: {
                action: "EDIT_EVENT",
                userId: req.user.userId,
                userRole: req.user.role,
                eventId: event.id,
                description: `Event "${event.title}" edited by organizer.`,
            },
        });
        return res.status(200).json(updatedEvent);
    }
    catch (error) {
        console.error("Error editing event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// Delete Event
eventRouter.delete("/delete/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "Your are not organizer" });
    }
    const eventId = req.params.id;
    try {
        const event = yield src_1.prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Check if the logged-in user is the organizer of the event
        if (event.organizerId !== req.user.userId) {
            return res.status(403).json({
                message: "Unauthorized: You are not the organizer of this event",
            });
        }
        yield src_1.prisma.auditLog.create({
            data: {
                action: "DELETE_EVENT",
                userId: req.user.userId,
                userRole: req.user.role,
                eventId: event.id,
                description: `Event "${event.title}" deleted by organizer.`,
            },
        });
        // Delete the event
        yield src_1.prisma.event.delete({
            where: { id: eventId },
        });
        return res.status(200).json({ message: "Event deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// Get all events created by organizer
eventRouter.get("/my-events", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "You are not organizer" });
    }
    console.log(req.user);
    try {
        const events = yield src_1.prisma.event.findMany({
            where: {
                organizerId: req.user.userId,
            },
            orderBy: {
                date: "asc", // you can also remove this if you don't want sorted events
            },
            include: {
                organizer: true,
            },
        });
        return res.status(200).json(events);
    }
    catch (error) {
        console.error("Error fetching organizer's events:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// View Event Registrations
eventRouter.get("/registrations/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "Your are not organizer" });
    }
    const eventId = req.params.id;
    try {
        const event = yield src_1.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                registrations: {
                    include: {
                        attendee: true, // Include attendee details
                    },
                },
            },
        });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Check if the logged-in user is the organizer of the event
        if (event.organizerId !== req.user.userId) {
            return res.status(403).json({
                message: "Unauthorized: You are not the organizer of this event",
            });
        }
        return res.status(200).json(event.registrations);
    }
    catch (error) {
        console.error("Error fetching registrations:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// Confirm Attendance
eventRouter.put("/confirm-attendance/:eventId", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "Your are not organizer" });
    }
    const userId = req.user.userId;
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
            return res.status(404).json({ message: "Registration not found" });
        }
        const updatedRegistration = yield src_1.prisma.registration.update({
            where: {
                id: registration.id,
            },
            data: {
                attendanceConfirmed: true,
            },
        });
        return res
            .status(200)
            .json({ message: "Attendance confirmed", updatedRegistration });
    }
    catch (error) {
        console.error("Error confirming attendance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// Submit Event Feedback
eventRouter.post("/feedback/:eventId", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "Your are not organizer" });
    }
    const userId = req.user.userId;
    const eventId = req.params.eventId;
    const { feedback, rating } = req.body;
    if (!feedback || !rating) {
        return res
            .status(400)
            .json({ message: "Feedback and rating are required" });
    }
    try {
        const existingFeedback = yield src_1.prisma.feedback.findUnique({
            where: {
                attendeeId_eventId: {
                    attendeeId: userId,
                    eventId: eventId,
                },
            },
        });
        if (existingFeedback) {
            return res.status(400).json({ message: "Feedback already submitted" });
        }
        const newFeedback = yield src_1.prisma.feedback.create({
            data: {
                attendeeId: userId,
                eventId: eventId,
                feedback,
                rating,
            },
        });
        return res
            .status(201)
            .json({ message: "Feedback submitted", newFeedback });
    }
    catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// Calculate Engagement Score
eventRouter.get("/engagement/:eventId", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== "organizer") {
        return res.status(401).json({ message: "Your are not organizer" });
    }
    const eventId = req.params.eventId;
    try {
        const event = yield src_1.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                registrations: true, // Get registrations
                Feedback: true, // Get feedback
            },
        });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Number of registrations
        const numRegistrations = event.registrations.length;
        // Attendance confirmation rate
        const confirmedAttendance = event.registrations.filter((registration) => registration.attendanceConfirmed).length;
        const attendanceConfirmationRate = numRegistrations
            ? (confirmedAttendance / numRegistrations) * 100
            : 0;
        // Organizer responsiveness (time taken to edit event, for example)
        const organizer = yield src_1.prisma.user.findUnique({
            where: { id: event.organizerId },
        });
        const responseTime = (organizer === null || organizer === void 0 ? void 0 : organizer.createdAt)
            ? (new Date().getTime() - new Date(organizer.createdAt).getTime()) /
                1000
            : 0;
        // Average rating from feedback
        const averageRating = event.Feedback.length > 0
            ? event.Feedback.reduce((sum, feedback) => sum + feedback.rating, 0) /
                event.Feedback.length
            : 0;
        // Calculate engagement score (simplified)
        const engagementScore = (numRegistrations * 0.25 +
            attendanceConfirmationRate * 0.25 +
            (100 - responseTime) * 0.25 +
            averageRating * 0.25) /
            100;
        return res.status(200).json({
            engagementScore: engagementScore.toFixed(2), // engagement score between 0 and 1
            details: {
                numRegistrations,
                attendanceConfirmationRate,
                responseTime,
                averageRating,
            },
        });
    }
    catch (error) {
        console.error("Error calculating engagement score:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = eventRouter;
