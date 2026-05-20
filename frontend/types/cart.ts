import { CartItem } from "./cartItem";

export interface Cart {
  cartId: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}