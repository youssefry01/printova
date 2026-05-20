import { useContext } from "react";
import SupplierContext from "@/context/SupplierContext";

const useSupplier = () => {
  const context = useContext(SupplierContext);

  if (!context) {
    throw new Error("useSupplier must be used within SupplierProvider");
  }

  return context;
};

export default useSupplier;