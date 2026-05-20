"use client";

import { createContext, useState, useEffect, FC, ReactNode } from "react";
import api from "../api/axios";
import { AxiosError } from "axios";
import { Supplier, Stock, Part, Category } from "@/types";

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

interface RootDataContextType {
  categories: Category[] | null;
  setCategories: (categories: Category[] | null) => void;

  parts: Part[] | null;
  setParts: React.Dispatch<
    React.SetStateAction<Part[] | null>
  >;

  suppliers: Supplier[] | null;
  setSuppliers: React.Dispatch<
    React.SetStateAction<Supplier[] | null>
  >;

  stock: Stock[] | null;
  setStock: React.Dispatch<React.SetStateAction<Stock[] | null>>;

  fetchCategories: () => Promise<void>;
  fetchParts: () => Promise<void>;

  [key: string]: unknown;
}

const RootDataContext = createContext<RootDataContextType | null>(null);

export const RootDataProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [stock, setStock] = useState<Stock[] | null>(null);
  const [parts, setParts] = useState<Part[] | null>([]);


  // ---------- PUBLIC ----------
  const fetchParts = async () => {
    try {
      const res = await api.get("/api/part");
      setParts(res.data);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return {
        success: false, 
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong",
      };
    }
  };

  const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        setCategories(res.data);
        return res.data;
      } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return {
          success: false, 
          error:
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Something went wrong",
        };
      }
  };

  useEffect(() => {
    (async () => {
      await fetchCategories();
      await fetchParts();
    })();
  }, []);

  return (
    <RootDataContext.Provider
      value={{
        suppliers,
        setSuppliers,
        stock,
        setStock,
        categories,
        setCategories,
        parts,
        setParts,
        fetchCategories,
        fetchParts,
      }}
    >
      {children}
    </RootDataContext.Provider>
  );
};

export default RootDataContext;
