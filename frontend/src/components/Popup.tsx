import { IoClose } from "react-icons/io5";
import DeletePopup from "./DeletePopup";
import EditPopup from "./EditPopup";

type PopupProps = {
  type: "delete" | "edit" | null;
  event: any;
  setPopup: React.Dispatch<
    React.SetStateAction<{ type: "delete" | "edit" | null; event: any } | null>
  >;
};

const Popup = ({ type, event, setPopup }: PopupProps) => {
  return (
    <div className="w-full h-screen bg-black/90 absolute top-0 left-0 z-50 flex justify-center items-center">
      {/* Cross Button */}
      <button
        onClick={() => setPopup(null)}
        className="absolute top-5 right-5 text-white text-3xl hover:opacity-80"
      >
        <IoClose size={25} />
      </button>
      {type === "delete" && (
        <DeletePopup setPopup={setPopup} eventId={event.id} />
      )}
      {type === "edit" && <EditPopup />}
    </div>
  );
};

export default Popup;
