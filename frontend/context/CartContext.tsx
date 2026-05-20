"use client";

import { createContext, useState, FC, ReactNode } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { Cart } from "@/types";

interface CartContextType {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  fetchCart: () => Promise<unknown>;
  getCart: () => Promise<Cart | null>;

  addToCart: (partId: number) => Promise<unknown>;

  updateCartItemQuantity: (
    partId: number,
    quantity: number
  ) => Promise<unknown>;

  removeCartItem: (partId: number) => Promise<unknown>;

  clearCart: () => Promise<unknown>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const fetchCart = async (): Promise<void> => {
    const res = await handleRequest<Cart>(() =>
      api.get<Cart>("/api/cart")
    );

    if ("cartId" in res) {
      setCart(res);
    }
  };

  const getCart = async (): Promise<Cart | null> => {
    const res = await handleRequest<Cart>(() =>
      api.get<Cart>("/api/cart")
    );

    if ("cartId" in res) return res;
    return null;
  };
  
  const addToCart = async (partId: number): Promise<unknown> => {
    const res = await handleRequest(() =>
      api.post("/api/cart", { partId, quantity: 1 })
    );

    await fetchCart();
    return res;
  };

  const updateCartItemQuantity = async (partId: number, quantity: number): Promise<void> => {
    try {
      await handleRequest(() => api.put(`/api/cart/item/${partId}`, { quantity }));
      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const removeCartItem = async (partId: number): Promise<unknown> => {
    const res = await handleRequest(() => api.delete(`/api/cart/item/${partId}`));
    fetchCart();
    return res;
  };

  const clearCart = async (): Promise<unknown> => {
    const res = await handleRequest(() => api.delete(`/api/cart/clear`));
    fetchCart();
    return res;
  };
  

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, getCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;