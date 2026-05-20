"use client";

import { createContext, useContext, FC, ReactNode } from "react";
import api from "../api/axios";
import RootDataContext from "./RootDataContext";
import handleRequest from "../api/requestHandler";
import { Stock } from "@/types";

interface StockContextType {
  stock: Stock[] | null;
  setStock: React.Dispatch<React.SetStateAction<Stock[] | null>>;
  getStockByName: (stockName: string) => Stock | null;
  getAllStock: () => Promise<unknown>;
  getStockByPartId: (partId: string) => Promise<unknown>;
  updatePartStock: (partId: string, stockQuantity: string) => Promise<unknown>;
  adjustPartStock: (partId: string, quantityChange: string) => Promise<unknown>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const contextValue = useContext(RootDataContext);
    if (!contextValue) {
      throw new Error("StockProvider must be used within RootDataProvider");
    }
    const { stock, setStock } = contextValue;

    const getStockByName = (stockName: string): Stock | null => {
      if (!stock) return null;
      return (
        stock.find(
          (s) =>
            s.stockName?.toLowerCase() === stockName.toLowerCase()
        ) ?? null
      );
    };

    const getAllStock = async () => {
      return await handleRequest(() => api.get(`/api/stock`));
    };

    const getStockByPartId = async (partId: string) => {
      return await handleRequest(() => api.get(`/api/stock/part/${partId}`));
    };

    const updatePartStock = async (partId: string, stockQuantity: string) => {
      return await handleRequest(() => api.put(`/api/stock/${partId}`, { stockQuantity: Number(stockQuantity) }));
    };

    const adjustPartStock = async (partId: string, quantityChange: string) => {
      return await handleRequest(() => api.post(`/api/stock/${partId}/adjust`, { quantityChange: Number(quantityChange) }));
    };

  return (
    <StockContext.Provider value={{ stock, setStock, getStockByName, getAllStock, getStockByPartId, updatePartStock, adjustPartStock }}>
      {children}
    </StockContext.Provider>
  );
};

export default StockContext;
