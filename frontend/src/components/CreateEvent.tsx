import { useState } from "react";
import InputBox from "./InputBox";
import LayoutWrapper from "./LayoutWrapper";
import { createEvent } from "../hooks";
import { useContextHook } from "../context/Context";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { getEventCards, getOrganizerCards } = useContextHook();

  const handleCreateEvent = async () => {
    if (!title || !date) {
      alert("Title and Date are required");
      return;
    }

    try {
      setLoading(true);
      const res = await createEvent(title, description, date);

      if (res.error) {
        throw new Error(res.error);
      }

      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      getEventCards();
      getOrganizerCards();
    } catch (error: any) {
      console.error("Error creating event:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <div className="flex flex-col justify-start items-start w-full">
        <div className="flex flex-col justify-start items-start w-full">
          <h1 className="text-blue-600 text-xl capitalize font-semibold">
            create events
          </h1>
          <div className="flex flex-col w-full justify-center items-center gap-5 mt-10">
            <InputBox
              label="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <InputBox
              label="Event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <InputBox
              label="Event time"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreateEvent}
            className="w-full p-3 rounded-md bg-blue-700 text-white mt-5 hover:opacity-80 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default CreateEvent;
