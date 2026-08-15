import type { Product } from './Product';

/**
 * CART ITEM MODEL
 */
export interface CartItem {
  product: Product;
  quantity: number;
}
