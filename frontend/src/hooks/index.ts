import { useEffect, useRef } from "react";

export const checkAuth = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/isAuth", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      return { isAuthenticated: false, message: "Something went wrong" };
    }

    return data; // will contain { isAuthenticated, message, username }
  } catch (error) {
    console.error("Authentication check failed:", error);
    return { isAuthenticated: false, message: "Something went wrong" };
  }
};

export const signup = async (email: string, password: string, role: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data; // { message, user }
  } catch (error) {
    console.error("Signup failed:", error);
    return { error: "Something went wrong" };
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signin failed");
    }

    return data; // { message, user }
  } catch (error) {
    console.error("Signin failed:", error);
    return { error: "Something went wrong" };
  }
};

export const signout = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signout failed");
    }

    return data; // { message }
  } catch (error) {
    console.error("Signout failed:", error);
    return { error: "Something went wrong" };
  }
};

// Register for an Event
export const registerForEvent = async (eventId: string) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/user/register/${eventId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data; // { message, registration }
  } catch (error) {
    console.error("Register for event failed:", error);
    return { error: "Something went wrong" };
  }
};

// Unregister from an Event
export const unregisterFromEvent = async (eventId: string) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/user/unregister/${eventId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Unregistration failed");
    }

    return data; // { message }
  } catch (error) {
    console.error("Unregister from event failed:", error);
    return { error: "Something went wrong" };
  }
};

// View Upcoming Events
export const getUpcomingEvents = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/user/upcoming`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }

    return data; // array of events
  } catch (error) {
    console.error("Fetching upcoming events failed:", error);
    return { error: "Something went wrong" };
  }
};

export const createEvent = async (
  title: string,
  description: string,
  date: string
) => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/event/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, date }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Create event failed");
    }

    return data; // newly created event
  } catch (error) {
    console.error("Create event failed:", error);
    return { error: "Something went wrong" };
  }
};

export const editEvent = async (
  id: string,
  title: string,
  description: string,
  date: string
) => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/event/edit/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, date }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Edit event failed");
    }

    return data; // updated event
  } catch (error) {
    console.error("Edit event failed:", error);
    return { error: "Something went wrong" };
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/event/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Delete event failed");
    }

    return data; // { message: "Event deleted successfully" }
  } catch (error) {
    console.error("Delete event failed:", error);
    return { error: "Something went wrong" };
  }
};

export const getOrganizerEvents = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/event/my-events", {
      method: "GET",
      credentials: "include", // Ensures cookies are sent
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }

    return data; // Returns the array of events
  } catch (error) {
    console.error("Failed to fetch organizer's events:", error);
    return { error: "Something went wrong" };
  }
};

export const getAuditLogs = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/audit", {
      method: "GET",
      credentials: "include", // important for cookies/session
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch audit logs");
    }

    return data; // { auditLogs: [...] }
  } catch (error) {
    console.error("Fetching audit logs failed:", error);
    return { error: "Something went wrong" };
  }
};

export const getNotifications = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/notifications", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch notifications");
    }

    return data; // { notifications: [...] }
  } catch (error) {
    console.error("Fetching notifications failed:", error);
    return { error: "Something went wrong" };
  }
};

export default function useNotifications(email: string) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!email) return;

    const socket = new WebSocket(`https://event-flow-4vsr.onrender.com?email=${email}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (
          data.type === "subscription-update" ||
          data.type === "organizer-subscription-update"
        ) {
          console.log("Received notification:", data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", event.data);
      }
    };

    socket.onopen = () => {
      console.log("connected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }, [email]);
}
