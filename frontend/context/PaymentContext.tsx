"use client";

import { createContext, FC, ReactNode, useState } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { Payment } from "@/types";

interface PaymentContextType {
  payments: Payment[] | null;
  setPayments: React.Dispatch<React.SetStateAction<Payment[] | null>>;
  getAllPayments: () => Promise<unknown>;
  getPaymentById: (paymentId: string) => Promise<unknown>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [payments, setPayments] = useState<Payment[] | null>(null);

    const getAllPayments = async () => {
      return await handleRequest(() => api.get(`/api/payment`));
    };

    const getPaymentById = async (paymentId: string) => {
      return await handleRequest(() => api.get(`/api/payment/${paymentId}`));
    };
    
  return (
    <PaymentContext.Provider value={{ payments, setPayments, getAllPayments, getPaymentById }}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;
