import { BsCalendar3EventFill } from "react-icons/bs";
import LayoutWrapper from "./LayoutWrapper";
import { GoClockFill } from "react-icons/go";
import { useContextHook } from "../context/Context";
import { useState } from "react";
import Popup from "./Popup";
import { registerForEvent, unregisterFromEvent } from "../hooks";
import { useNavigate } from "react-router-dom";

type PopupState = { type: "delete" | "edit" | null; event: any } | null;

const Dashboard = () => {
  const { role, eventCards, organizerCards } = useContextHook(); // (optional) if you want live UI update after register/unregister
  const [popup, setPopup] = useState<PopupState>(null);
  const navigate = useNavigate();

  const handleRegister = async (eventId: string) => {
    const res = await registerForEvent(eventId);
    if (!res.error) {
      alert("Registered successfully!");
      navigate(0);
    } else {
      alert(res.error);
    }
  };

  const handleUnregister = async (eventId: string) => {
    const res = await unregisterFromEvent(eventId);
    if (!res.error) {
      alert("Unregistered successfully!");
      navigate(0);
    } else {
      alert(res.error);
    }
  };

  if (!Array.isArray(eventCards) || !role || !Array.isArray(organizerCards)) {
    return (
      <LayoutWrapper>
        <div className="w-full h-[80vh] flex justify-center items-center">
          <p className="text-2xl text-gray-600">Loading...</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <>
      <LayoutWrapper>
        <div className="flex flex-col justify-start items-start w-full">
          <h1 className="text-blue-600 text-xl capitalize font-semibold">
            upcoming events
          </h1>

          {role === "attendee" ? (
            eventCards.length === 0 ? (
              <p className="w-full flex justify-center items-center text-2xl mt-20 capitalize">
                no events
              </p>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 place-items-center place-content-center mt-5 gap-5">
                {eventCards.map((item) => (
                  <div
                    key={item.id}
                    className="w-full p-5 rounded-md bg-white flex flex-col justify-start items-start shadow-md"
                  >
                    <div className="w-full flex flex-col justify-start items-start">
                      <p className="text-[20px] font-semibold">{item.title}</p>
                      <p className="text-[14px] text-gray-600">
                        Organized by: {item.organizer.email}
                      </p>
                    </div>
                    <div className="w-full flex flex-col justify-start items-start mt-4 gap-4">
                      <div className="flex justify-center items-center gap-2 text-[14px]">
                        <BsCalendar3EventFill />
                        <p>
                          {new Date(item.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="text-neutral-800">{item.description}</p>
                    </div>

                    {item.isRegistered ? (
                      <button
                        onClick={() => handleUnregister(item.id)}
                        className="w-full p-3 rounded-md bg-red-600 text-white mt-4 hover:opacity-80 cursor-pointer"
                      >
                        Unregister
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(item.id)}
                        className="w-full p-3 rounded-md bg-blue-700 text-white mt-4 hover:opacity-80 cursor-pointer"
                      >
                        Register
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : organizerCards.length === 0 ? (
            <p className="w-full flex justify-center items-center text-2xl mt-20 capitalize">
              no events
            </p>
          ) : (
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 place-items-center place-content-center mt-5 gap-5">
              {organizerCards.map((item) => (
                <div
                  key={item.id}
                  className="w-full p-5 rounded-md bg-white flex flex-col justify-start items-start shadow-md"
                >
                  <div className="w-full flex flex-col justify-start items-start">
                    <p className="text-[20px] font-semibold">{item.title}</p>
                    <p className="text-[14px] text-gray-600">
                      Organized by: {item.organizer.email}
                    </p>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start mt-4 gap-4">
                    <div className="flex justify-center items-center gap-2 text-[14px]">
                      <GoClockFill />
                      <p>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-neutral-800">{item.description}</p>
                  </div>
                  <div className="w-full flex justify-center items-center gap-5">
                    <button
                      onClick={() => setPopup({ type: "edit", event: item })}
                      className="w-full p-3 rounded-md bg-green-600 text-white mt-4 hover:opacity-80 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setPopup({ type: "delete", event: item })}
                      className="w-full p-3 rounded-md bg-red-600 text-white mt-4 hover:opacity-80 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </LayoutWrapper>

      {popup && (
        <Popup type={popup.type} setPopup={setPopup} event={popup.event} />
      )}
    </>
  );
};

export default Dashboard;
