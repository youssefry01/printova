"use client";

import { createContext, useContext, FC, ReactNode } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import RootDataContext from "./RootDataContext";
import { Part } from "@/types";

interface PartContextType {
  parts: Part[] | null;
  setParts: React.Dispatch<React.SetStateAction<Part[] | null>>;
  getAllParts: () => Promise<unknown>;
  getPartById: (partId: number) => Promise<unknown>;
  addPart: (partName: string, partDescription: string, categoryId: number, supplierId: number, initialPrice: number) => Promise<unknown>;
  updatePart: (partId: number, partName: string, partDescription: string, categoryId: number, supplierId: number) => Promise<unknown>;
  removePart: (partId: number) => Promise<unknown>;
}

const PartContext = createContext<PartContextType | undefined>(undefined);

export const PartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue = useContext(RootDataContext);

  if (!contextValue) {
    throw new Error("PartProvider must be used within RootDataProvider");
  }

  const { parts, setParts } = contextValue;

  const getAllParts = async () => {
    return await handleRequest(() => api.get(`/api/part`));
  };

  const getPartById = async (partId: number) => {
    return await handleRequest(() => api.get(`/api/part/${partId}`));
  };
  
  const addPart = async (partName: string, partDescription: string, categoryId: number, supplierId: number, initialPrice: number) => {
    return await handleRequest(() => api.post(`/api/part`, { partName, partDescription, categoryId, supplierId, initialPrice }));
  };

  const updatePart = async (partId: number, partName: string, partDescription: string, categoryId: number, supplierId: number) => {
    return await handleRequest(() => api.put(`/api/part/${partId}`, { partName, partDescription, categoryId, supplierId }));
  };

  const removePart = async (partId: number) => {
    return await handleRequest(() => api.delete(`/api/part/${partId}`));
  };

  return (
    <PartContext.Provider value={{ parts, setParts, getAllParts, getPartById, addPart, updatePart, removePart }}>
      {children}
    </PartContext.Provider>
  );
};

export default PartContext;
