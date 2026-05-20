"use client";

import { createContext, FC, ReactNode, useState } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { PaymentMethod } from "@/types";

interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[] | null;
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[] | null>>;
  getAllPaymentMethods: () => Promise<unknown>;
  getPaymentMethodById: (paymentMethodId: string) => Promise<unknown>;
  addPaymentMethod: (paymentMethodCode: string, paymentMethodName: string) => Promise<unknown>;
  updatePaymentMethod: (paymentMethodId: string, paymentMethodCode: string, paymentMethodName: string) => Promise<unknown>;
  removePaymentMethod: (paymentMethodId: string) => Promise<unknown>;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export const PaymentMethodProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);

    const getAllPaymentMethods = async () => {
      return await handleRequest(() => api.get(`/api/payment-method`));
    };

    const getPaymentMethodById = async (paymentMethodId: string) => {
      return await handleRequest(() => api.get(`/api/payment-method/${paymentMethodId}`));
    };
    
    const addPaymentMethod = async (paymentMethodCode: string, paymentMethodName: string) => {
      return await handleRequest(() => api.post(`/api/payment-method`, { paymentMethodCode, paymentMethodName }));
    };

    const updatePaymentMethod = async (paymentMethodId: string, paymentMethodCode: string, paymentMethodName: string) => {
      return await handleRequest(() => api.put(`/api/payment-method/${paymentMethodId}`, { paymentMethodCode, paymentMethodName }));
    };

    const removePaymentMethod = async (paymentMethodId: string) => {
      return await handleRequest(() => api.delete(`/api/payment-method/${paymentMethodId}`));
    };

  return (
    <PaymentMethodContext.Provider value={{ paymentMethods, setPaymentMethods, getAllPaymentMethods, getPaymentMethodById, addPaymentMethod, updatePaymentMethod, removePaymentMethod }}>
      {children}
    </PaymentMethodContext.Provider>
  );
};

export default PaymentMethodContext;
