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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const src_1 = require("../prisma/src");
const server = http_1.default.createServer();
const wss = new ws_1.WebSocketServer({ server });
const PORT = Number(process.env.PORT) || 8080;
const clients = new Map(); // Store active WebSocket connections
const eventSubscribers = new Map(); // Store event subscriptions
start();
wss.on("connection", (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const baseUrl = "http://localhost:5173";
    const email = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "", baseUrl).searchParams.get("email");
    if (!email) {
        ws.close();
        return;
    }
    if (clients.has(email)) {
        (_b = clients.get(email)) === null || _b === void 0 ? void 0 : _b.close(); // Close the previous connection
    }
    clients.set(email, ws);
    ws.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messageString = data.toString();
            // Check if it looks like a JSON object or array
            if (!messageString.startsWith("{") && !messageString.startsWith("[")) {
                console.warn("Skipping non-JSON message:", messageString);
                return;
            }
            const parsedMessage = JSON.parse(messageString);
            console.log(parsedMessage);
            if (parsedMessage.type === "event-subscribe") {
                handleEventSubscription(parsedMessage);
            }
        }
        catch (error) {
            console.error("Error handling message:", error);
        }
    }));
    ws.on("close", () => {
        clients.delete(email);
        // Unsubscribe user from all events
        for (const [_, subscribers] of eventSubscribers) {
            subscribers.delete(email);
        }
    });
}));
// Start the server
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            server.listen(PORT);
            console.log(`Server listening on port ${PORT}`);
        }
        catch (error) {
            console.error("Error starting server:", error);
        }
    });
}
/** Handle Event Subscription */
function handleEventSubscription(parsedMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const { eventId, email } = parsedMessage;
        const user = yield src_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return;
        }
        // Add user to event subscribers list
        if (!eventSubscribers.has(eventId)) {
            eventSubscribers.set(eventId, new Set());
        }
        const subscribers = eventSubscribers.get(eventId);
        if (subscribers) {
            subscribers.add(email);
        }
        const message = `You have successfully subscribed to event: ${eventId}`;
        // Create notification for the user who subscribed
        const notification = yield src_1.prisma.notifications.create({
            data: {
                userId: user.id,
                message,
            },
        });
        const recipient = clients.get(email);
        if (recipient && recipient.readyState === ws_1.WebSocket.OPEN) {
            recipient.send(JSON.stringify({
                type: "subscription-update",
                message: notification.message,
            }));
        }
        // Find the event and get the organizer
        const event = yield src_1.prisma.event.findUnique({
            where: { id: eventId },
            include: { organizer: true }, // Include the organizer details
        });
        if (event && event.organizer) {
            const organizer = event.organizer;
            // Create notification for the organizer
            const organizerNotification = yield src_1.prisma.notifications.create({
                data: {
                    userId: organizer.id,
                    message: `A user with userId: ${user.id} has subscribed to your event: ${event.title}`,
                },
            });
            // Send notification to the organizer
            const organizerRecipient = clients.get(organizer.email);
            if (organizerRecipient &&
                organizerRecipient.readyState === ws_1.WebSocket.OPEN) {
                organizerRecipient.send(JSON.stringify({
                    type: "organizer-subscription-update",
                    message: organizerNotification.message,
                }));
            }
        }
    });
}
