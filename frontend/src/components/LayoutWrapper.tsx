import { ReactNode } from "react";

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="w-full min-h-screen px-10 py-5">{children} </div>;
};

export default LayoutWrapper;
