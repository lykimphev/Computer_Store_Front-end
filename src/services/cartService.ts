import type { CartItem } from '../model';

/**
 * CART SERVICE LAYER
 * Manages shopping cart state persistence in LocalStorage.
 */
const STORAGE_KEY_CART = 'kp_computer_cart_items';

export const CartService = {
  getCartItems: (): CartItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getCart: (): CartItem[] => {
    return CartService.getCartItems();
  },

  saveCartItems: (items: CartItem[]): void => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
  },

  saveCart: (items: CartItem[]): void => {
    CartService.saveCartItems(items);
  },

  clearCart: (): void => {
    localStorage.removeItem(STORAGE_KEY_CART);
  },
};

// Export lowercase alias for backward compatibility
export const cartService = CartService;
