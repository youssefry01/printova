export interface CartItem {
  cartItemId: number;
  stockId: number;
  partId: number;
  partName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}