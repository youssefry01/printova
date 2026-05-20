import { OrderItem } from './orderItem';

export interface Order {
  orderId: number;
  customerId: number;
  deliveryUserId: number;
  orderStatus: string;
  paymentMethod: string;
  totalAmount: number;
  serviceId: number;
  servicePrice: number;
  address: string;
  completedAt: string;
  createdAt: string;
  items: OrderItem[];
}