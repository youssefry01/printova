"use client";

import { createContext, useState, FC, ReactNode } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { Order } from "@/types";


interface OrderContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  fetchOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<unknown>;
  createOrder: (address: string) => Promise<unknown>;
  getDeliveryOrders: (status?: string) => Promise<unknown>;
  completeOrder: (orderId: string) => Promise<unknown>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await api.get<Order[]>("/api/order");
    setOrders(res.data);
  };

  const getOrderById = async (orderId: string) => {
    return await handleRequest(() => api.get(`/api/order/${orderId}`));
  };

  const createOrder = async (address: string) => {
    const res = await handleRequest(() => api.post("/api/order", { address }));
    await fetchOrders();
    return res;
  };

  const getDeliveryOrders = async (status?: string) => {
    return await handleRequest(() => api.get(`/api/order/delivery?status=${status || "PENDING"}`));
  };

  const completeOrder = async (orderId: string) => {
    return await handleRequest(() => api.patch(`/api/order/delivery/complete/${orderId}`));
  };

  return (
    <OrderContext.Provider value={{ orders, setOrders, fetchOrders, getOrderById, createOrder, getDeliveryOrders, completeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
