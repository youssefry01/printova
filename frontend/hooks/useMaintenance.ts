import { useContext } from "react";
import MaintenanceContext from "@/context/MaintenanceContext";

const useMaintenance = () => {
  const context = useContext(MaintenanceContext);

  if (!context) {
    throw new Error("useMaintenance must be used within MaintenanceProvider");
  }

  return context;
};

export default useMaintenance;