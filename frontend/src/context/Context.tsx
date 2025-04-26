import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import useNotifications, {
  getAuditLogs,
  getNotifications,
  getOrganizerEvents,
  getUpcomingEvents,
} from "../hooks";
import { DataTableProps, EventCardProps } from "../utils";

type ContextType = {
  username: string;
  setUsername: (e: string) => void;
  setRole: (e: string) => void;
  role: string;
  eventCards: EventCardProps[];
  organizerCards: EventCardProps[];
  getOrganizerCards: () => void;
  getEventCards: () => void;
  auditLogsData: DataTableProps[];
  notifications: any[];
  notify: boolean;
  setNotify: (e: boolean) => void;
};

const Context = createContext<ContextType | null>(null);

type UserContextProviderProps = {
  children: ReactNode;
};

export const ContextProvider = ({ children }: UserContextProviderProps) => {
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState("");
  const [eventCards, setEventCards] = useState<EventCardProps[]>([]);
  const [organizerCards, setOrganizerCards] = useState<EventCardProps[]>([]);
  const [auditLogsData, setAuditLogsData] = useState<DataTableProps[]>([]);
  const [notifications, setNotifications] = useState([]);
  const [notify, setNotify] = useState(false);

  useNotifications(username);

  const getEventCards = async () => {
    const events = await getUpcomingEvents();
    setEventCards(events);
  };
  const getOrganizerCards = async () => {
    const events = await getOrganizerEvents();
    setOrganizerCards(events);
  };
  const fetchLogs = async () => {
    const res = await getAuditLogs();
    if (res.error) {
      console.log(res.error);
    } else {
      console.log(res.auditLogs);
      setAuditLogsData(res.auditLogs);
    }
  };
  const fetchNotifications = async () => {
    const res = await getNotifications();
    if (res.error) {
      console.log(res.error);
    } else {
      setNotifications(res.notifications);
    }
  };

  useEffect(() => {
    if (role) {
      fetchLogs();
      fetchNotifications();
    }

    if (role === "attendee") {
      getEventCards();
    }

    if (role === "organizer") {
      getOrganizerCards();
    }
  }, [role]);

  return (
    <Context.Provider
      value={{
        username,
        setUsername,
        role,
        setRole,
        eventCards,
        organizerCards,
        getOrganizerCards,
        getEventCards,
        notifications,
        auditLogsData,
        notify,
        setNotify,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Custom hook to use the UserContext
export const useContextHook = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useContextHook must be used within a ContextProvider");
  }
  return context;
};
