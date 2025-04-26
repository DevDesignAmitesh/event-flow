import { config } from "dotenv";
config();

import { WebSocket, WebSocketServer } from "ws";
import http, { IncomingMessage } from "http";
import { prisma } from "../prisma/src";

const server = http.createServer();
const wss = new WebSocketServer({ server });
const PORT = Number(process.env.PORT) || 8080;

const clients = new Map<string, WebSocket>(); // Store active WebSocket connections
const eventSubscribers = new Map<string, Set<string>>(); // Store event subscriptions

start();

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  const baseUrl = "http://localhost:5173";
  const email = new URL(req.url ?? "", baseUrl).searchParams.get("email");

  if (!email) {
    ws.close();
    return;
  }

  if (clients.has(email)) {
    clients.get(email)?.close(); // Close the previous connection
  }
  clients.set(email, ws);

  ws.on("message", async (data: any) => {
    try {
      const messageString = data.toString();

      // Check if it looks like a JSON object or array
      if (!messageString.startsWith("{") && !messageString.startsWith("[")) {
        console.warn("Skipping non-JSON message:", messageString);
        return;
      }

      const parsedMessage = JSON.parse(messageString);

      console.log(parsedMessage)

      if (parsedMessage.type === "event-subscribe") {
        handleEventSubscription(parsedMessage);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  ws.on("close", () => {
    clients.delete(email);
    // Unsubscribe user from all events
    for (const [_, subscribers] of eventSubscribers) {
      subscribers.delete(email);
    }
  });
});

// Start the server
async function start() {
  try {
    server.listen(PORT);
    console.log(`Server listening on port ${PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

/** Handle Event Subscription */
async function handleEventSubscription(parsedMessage: any) {
  const { eventId, email } = parsedMessage;

  const user = await prisma.user.findUnique({
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
  const notification = await prisma.notifications.create({
    data: {
      userId: user.id,
      message,
    },
  });

  const recipient = clients.get(email);
  if (recipient && recipient.readyState === WebSocket.OPEN) {
    recipient.send(
      JSON.stringify({
        type: "subscription-update",
        message: notification.message,
      })
    );
  }

  // Find the event and get the organizer
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { organizer: true }, // Include the organizer details
  });

  if (event && event.organizer) {
    const organizer = event.organizer;

    // Create notification for the organizer
    const organizerNotification = await prisma.notifications.create({
      data: {
        userId: organizer.id,
        message: `A user with userId: ${user.id} has subscribed to your event: ${event.title}`,
      },
    });

    // Send notification to the organizer
    const organizerRecipient = clients.get(organizer.email);
    if (
      organizerRecipient &&
      organizerRecipient.readyState === WebSocket.OPEN
    ) {
      organizerRecipient.send(
        JSON.stringify({
          type: "organizer-subscription-update",
          message: organizerNotification.message,
        })
      );
    }
  }
}
