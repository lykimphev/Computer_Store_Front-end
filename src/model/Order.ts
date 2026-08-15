import type { CartItem } from './CartItem';

/**
 * ORDER & PAYMENT MODELS
 */
export type Currency = 'USD' | 'KHR';
export type PaymentMethod = 'cash' | 'qr';

export interface Order {
  id?: string;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  totalAmount: number;
  status?: string;
  createdAt?: string;
}
