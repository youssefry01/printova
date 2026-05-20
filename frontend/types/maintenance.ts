export interface Maintenance {
  maintenanceId: number;
  customerId: number;
  technicianUserId: number;
  maintenanceStatus: string;
  paymentMethod: string;
  totalAmount: number;
  serviceId: number;
  servicePrice: number;
  address: string;
  description: string;
  date: string;
  completedAt?: string;
  createdAt: string;
}