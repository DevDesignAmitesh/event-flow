import { MdNotificationsActive } from "react-icons/md";
import LayoutWrapper from "./LayoutWrapper";
import { useContextHook } from "../context/Context";

const Notifications = () => {
  const { notifications } = useContextHook();
  return (
    <LayoutWrapper>
      <div className="flex flex-col justify-start items-start w-full">
        <h1 className="text-blue-600 text-xl capitalize font-semibold mb-4">
          Notifications
        </h1>
        <div className="w-full flex flex-col gap-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="w-full p-4 border border-gray-200 rounded-md bg-white shadow-sm flex items-start gap-3"
            >
              <MdNotificationsActive size={22} className="text-blue-600 mt-1" />
              <div className="flex flex-col">
                <p className="text-sm text-gray-800">{notif.message}</p>
                <span className="text-xs text-gray-500 mt-1">
                  {notif.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Notifications;
