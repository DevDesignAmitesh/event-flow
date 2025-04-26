import { useState } from "react";
import SideBar from "../components/SideBar";
import Dashboard from "../components/Dashboard";
import Notifications from "../components/Notifications";
import AuditLogs from "../components/AuditLogs";
import CreateEvent from "../components/CreateEvent";

const Main = () => {
  const [panel, setPanel] = useState<
    "dashboard" | "notifications" | "audit logs" | "create event"
  >("dashboard");

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="h-full w-[20%]">
        <SideBar panel={panel} setPanel={setPanel} />
      </div>
      <div className="min-h-full w-[80%] bg-neutral-100">
        {panel === "dashboard" && <Dashboard />}
        {panel === "notifications" && <Notifications />}
        {panel === "audit logs" && <AuditLogs />}
        {panel === "create event" && <CreateEvent />}
      </div>
    </div>
  );
};

export default Main;
