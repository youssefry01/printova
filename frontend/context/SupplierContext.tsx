"use client";

import { createContext, useContext, FC, ReactNode } from "react";
import api from "../api/axios";
import RootDataContext from "./RootDataContext";
import handleRequest from "../api/requestHandler";
import { Supplier } from "@/types";


interface SupplierContextType {
  suppliers: Supplier[] | null;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[] | null>>;
  getAllSuppliers: () => Promise<unknown>;
  getSupplierById: (supplierId: string) => Promise<unknown>;
  addSupplier: (supplierName: string, supplierEmail: string, supplierPhone: string) => Promise<unknown>;
  updateSupplier: (supplierId: string, supplierName: string, supplierEmail: string, supplierPhone: string) => Promise<unknown>;
  deleteSupplier: (supplierId: string) => Promise<unknown>;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue = useContext(RootDataContext);
  if (!contextValue) {
    throw new Error(
      "SupplierProvider must be used within RootDataProvider"
    );
  }
  const { suppliers, setSuppliers } = contextValue;

  const getAllSuppliers = async () => {
    return await handleRequest(() => api.get(`/api/supplier`));
  };

  const getSupplierById = async (supplierId: string) => {
    return await handleRequest(() => api.get(`/api/supplier/${supplierId}`));
  };
  
  const addSupplier = async (supplierName: string, supplierEmail: string, supplierPhone: string) => {
    return await handleRequest(() => api.post(`/api/supplier`, { supplierName, supplierEmail, supplierPhone }));
  };

  const updateSupplier = async (supplierId: string, supplierName: string, supplierEmail: string, supplierPhone: string) => {
    return await handleRequest(() => api.put(`/api/supplier/${supplierId}`, { supplierName, supplierEmail, supplierPhone }));
  };

  const deleteSupplier = async (supplierId: string) => {
    return await handleRequest(() => api.delete(`/api/supplier/${supplierId}`));
  };

  return (
    <SupplierContext.Provider value={{ suppliers, setSuppliers, getAllSuppliers, getSupplierById, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};

export default SupplierContext;
