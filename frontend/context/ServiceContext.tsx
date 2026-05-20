"use client";

import { createContext, useState, FC, ReactNode } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { Service } from "@/types";

interface ServiceContextType {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  fetchServices: () => Promise<void>;
  getServiceByName: (serviceName: string) => Service | null;
  getAllServices: () => Promise<unknown>;
  getServiceById: (serviceId: string) => Promise<unknown>;
  addService: (serviceName: string, servicePrice: string) => Promise<unknown>;
  updateService: (serviceId: string, serviceName: string, servicePrice: string) => Promise<unknown>;
  removeService: (serviceId: string) => Promise<unknown>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [services, setServices] = useState<Service[]>([]);

    const fetchServices = async () => {
      const res = await api.get<Service[]>(`/api/service`);
      setServices(res.data);
    };

    const getServiceByName = (serviceName: string): Service | null => {
      if (!services) return null;
      return services.find(
        (service: Service) =>
          service.serviceName.toLowerCase() === serviceName.toLowerCase()
      ) || null;
    };

    const getAllServices = async () => {
      return await handleRequest(() => api.get(`/api/service`));
    };

    const getServiceById = async (serviceId: string) => {
      return await handleRequest(() => api.get(`/api/service/${serviceId}`));
    };
    
    const addService = async (serviceName: string, servicePrice: string) => {
      return await handleRequest(() => api.post(`/api/service`, { serviceName, servicePrice: Number(servicePrice) }));
    };

    const updateService = async (serviceId: string, serviceName: string, servicePrice: string) => {
      return await handleRequest(() => api.put(`/api/service/${serviceId}`, { serviceName, servicePrice: Number(servicePrice) }));
    };

    const removeService = async (serviceId: string) => {
      return await handleRequest(() => api.delete(`/api/service/${serviceId}`));
    };

  return (
    <ServiceContext.Provider value={{ services, setServices, fetchServices, getServiceByName, getAllServices, getServiceById, addService, updateService, removeService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceContext;
