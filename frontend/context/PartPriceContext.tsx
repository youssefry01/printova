"use client";

import { createContext, FC, ReactNode, useState } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { PartPrice } from "@/types";

interface PartPriceContextType {
  partPrices: PartPrice[] | null;
  setPartPrices: React.Dispatch<React.SetStateAction<PartPrice[] | null>>;
  getPartPriceByName: (partPriceName: string) => PartPrice | null;
  getAllPrices: () => Promise<unknown>;
  getPartPrices: (partId: string) => Promise<unknown>;
  getLatestPartPrice: (partId: string) => Promise<unknown>;
  addPartPrice: (partId: string, price: string) => Promise<unknown>;
}

const PartPriceContext = createContext<PartPriceContextType | undefined>(undefined);

export const PartPriceProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [partPrices, setPartPrices] = useState<PartPrice[] | null>(null);

    const getPartPriceByName = (name: string): PartPrice | null => {
      if (!partPrices) return null;

      return (
        partPrices.find(
          (p) => p.partPriceName.toLowerCase() === name.toLowerCase()
        ) ?? null
      );
    };

    const getAllPrices = async () => {
      return await handleRequest(() => api.get(`/api/part-price`));
    };

    const getPartPrices = async (partId: string) => {
      return await handleRequest(() => api.get(`/api/part-price/part/${partId}`));
    };
    
    const getLatestPartPrice = async (partId: string) => {
      return await handleRequest(() => api.get(`/api/part-price/part/${partId}/latest`));
    };

    const addPartPrice = async (partId: string, price: string) => { 
      return await handleRequest(() => api.post(`/api/part-price`, { partId: Number(partId), price: Number(price) }));
    };

  return (
    <PartPriceContext.Provider value={{ partPrices, setPartPrices, getPartPriceByName, getAllPrices, getPartPrices, getLatestPartPrice, addPartPrice }}>
      {children}
    </PartPriceContext.Provider>
  );
};

export default PartPriceContext;
