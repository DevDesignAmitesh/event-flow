import { MdLogout } from "react-icons/md";
import { useContextHook } from "../context/Context";
import { SideBarItems } from "../utils";
import { signout } from "../hooks";
import { useNavigate } from "react-router-dom";

const SideBar = ({
  panel,
  setPanel,
}: {
  panel: string;
  setPanel: (
    e: "dashboard" | "notifications" | "audit logs" | "create event"
  ) => void;
}) => {
  const { role, username } = useContextHook();
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col justify-start items-start px-4 relative">
      <h1 className="text-3xl font-bold mt-5">Event Flow</h1>

      <div className="flex flex-col justify-start items-start mt-10 w-full">
        {SideBarItems.map(
          (item) =>
            (item.role === role || item.role === "everyone") && (
              <div
                onClick={() => setPanel(item.label)}
                className={`flex justify-start items-center gap-2 rounded-md capitalize ${
                  panel === item.label
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-neutral-200 text-neutral-800 cursor-pointer"
                } p-4 w-full`}
              >
                {item.icon}
                <p>{item.label}</p>
              </div>
            )
        )}
      </div>

      <div className="absolute bottom-0 left-0 flex justify-between items-center gap-10 py-5 px-4 bg-blue-800 text-white w-full">
        <div className="flex flex-col justify-start items-start">
          <p className="text-[18px] font-medium leading-[14px]">{username}</p>
          <p className="text-[14px]">{role}</p>
        </div>
        <MdLogout
          onClick={() => {
            signout();
            navigate("/auth");
          }}
          size={25}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
