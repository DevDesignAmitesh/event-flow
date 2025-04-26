import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "../hooks";
import { useContextHook } from "../context/Context";

const DeletePopup = ({
  setPopup,
  eventId,
}: {
  setPopup: React.Dispatch<
    React.SetStateAction<{ type: "delete" | "edit" | null; event: any } | null>
  >;
  eventId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { getEventCards, getOrganizerCards } = useContextHook();

  const handleDelete = async () => {
    setLoading(true);
    const response = await deleteEvent(eventId);
    setLoading(false);

    if (response?.error) {
      alert(response.error);
    } else {
      alert("Event deleted successfully!");
      getEventCards();
      getOrganizerCards();
      setPopup(null); // Close the popup
      navigate("/"); // Redirect to home page (or wherever you want after deleting)
    }
  };

  return (
    <div className="p-6 bg-white w-[500px] rounded-xl text-gray-900 flex flex-col justify-center items-center">
      <p className="text-xl font-bold w-full text-left">Are you sure?</p>
      <p className="text-gray-500 text-[14px] mt-2 w-full text-left">
        This action cannot be undone. This will permanently delete the event's
        data from our servers.
      </p>
      <div className="w-full mt-5 flex justify-center items-center gap-5">
        <button
          onClick={() => setPopup(null)}
          className="bg-gray-900 text-white w-full rounded-md py-2 hover:opacity-80 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white w-full rounded-md py-2 hover:opacity-80 cursor-pointer"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeletePopup;
