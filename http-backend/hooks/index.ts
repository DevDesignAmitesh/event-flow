import WebSocket from "ws";

export async function notifyEventSubscription(
  userEmail: string,
  eventId: string
) {
  const socket = new WebSocket(`https://event-flow-4vsr.onrender.com?email=${userEmail}`);

  socket.onopen = () => {
    const message = {
      type: "event-subscribe",
      email: userEmail,
      eventId,
    };
    socket.send(JSON.stringify(message));
  };

  socket.onmessage = (event) => {
    console.log("Server replied:", event.data);
    socket.close();
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed.");
  };
}
