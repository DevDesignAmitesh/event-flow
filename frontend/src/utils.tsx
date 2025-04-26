import { ReactElement } from "react";
import { IoHomeSharp } from "react-icons/io5";
import {
  MdAccessTimeFilled,
  MdNotificationsActive,
  MdOutlineAddCircleOutline,
} from "react-icons/md";

interface SideBarItemsProps {
  label: "dashboard" | "notifications" | "audit logs" | "create event";
  icon: ReactElement;
  role: string;
}

export const SideBarItems: SideBarItemsProps[] = [
  {
    label: "dashboard",
    icon: <IoHomeSharp size={20} />,
    role: "everyone",
  },
  {
    label: "audit logs",
    icon: <MdAccessTimeFilled size={20} />,
    role: "everyone",
  },
  {
    label: "notifications",
    icon: <MdNotificationsActive size={20} />,
    role: "everyone",
  },
  {
    label: "create event",
    icon: <MdOutlineAddCircleOutline size={20} />,
    role: "organizer",
  },
];

export interface DataTableProps {
  action: string;
  id: string;
  timestamp: string;
  event: { title: string; id: string };
  userId: string;
  userRole: string;
}

export type EventCardProps = {
  id: string;
  title: string;
  organizer: { email: string };
  date: string;
  time: string;
  description: string;
  buttonText: string;
  isRegistered: boolean;
};

interface NotificationsProps {
  id: number;
  message: string;
  timestamp: string;
}

export const notifications: NotificationsProps[] = [
  {
    id: 1,
    message: "John Doe has joined your event: Annual Tech Conference.",
    timestamp: "April 26, 2025 - 10:45 AM",
  },
  {
    id: 2,
    message: "New comment on your session: Building Scalable Systems.",
    timestamp: "April 25, 2025 - 5:22 PM",
  },
  {
    id: 3,
    message: "Your event has been approved by the admin team.",
    timestamp: "April 24, 2025 - 2:10 PM",
  },
];
