export interface PaymentMethod {
  paymentMethodId: number;
  paymentMethodCode: string;
  paymentMethodName: string;
  [key: string]: unknown;
}