"use client";

import { createContext, useState, FC, ReactNode } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { Maintenance } from "@/types";

interface MaintenanceContextType {
  maintenances: Maintenance[];
  setMaintenances: React.Dispatch<React.SetStateAction<Maintenance[]>>;
  fetchMaintenances: () => Promise<void>;
  getMaintenanceById: (maintenanceId: string) => Promise<unknown>;
  createMaintenance: (maintenanceData: unknown) => Promise<unknown>;
  getTechnicianMaintenances: (status?: string) => Promise<unknown>;
  completeMaintenance: (maintenanceId: string) => Promise<unknown>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const fetchMaintenances = async () => {
    const res = await handleRequest<Maintenance[]>(() =>
      api.get<Maintenance[]>("/api/maintenance")
    );

    if ("success" in res) return; // (success is only present in ErrorResponse)

    setMaintenances(res);
  };

  const getMaintenanceById = async (maintenanceId: string) => {
    return await handleRequest(() => api.get(`/api/maintenance/${maintenanceId}`));
  };

  const createMaintenance = async (maintenanceData: unknown) => {
    const res = await handleRequest(() => api.post("/api/maintenance", maintenanceData));
    await fetchMaintenances();
    return res;
  };

  const getTechnicianMaintenances = async (status?: string) => {
    return await handleRequest(() => api.get(`/api/maintenance/technician?status=${status || "SCHEDULED"}`));
  };

  const completeMaintenance = async (maintenanceId: string) => {
    return await handleRequest(() => api.patch(`/api/maintenance/technician/complete/${maintenanceId}`));
  };

  return (
    <MaintenanceContext.Provider value={{ maintenances, setMaintenances, fetchMaintenances, getMaintenanceById, createMaintenance, getTechnicianMaintenances, completeMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export default MaintenanceContext;
