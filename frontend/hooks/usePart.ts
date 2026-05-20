import { useContext } from "react";
import PartContext from "@/context/PartContext";

const usePart = () => {
  const context = useContext(PartContext);

  if (!context) {
    throw new Error("usePart must be used within PartProvider");
  }

  return context;
};

export default usePart;