import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem, Currency } from "../model";
import { cartService } from "../services/cartService";
import { orderService } from "../services/orderService";
import { authService } from "../services/authService";
import { CartView } from "../components/CartView";
import { KHQRModal } from "../components/KHQRModal";

interface CartPageProps {
  cart?: CartItem[];
  currency?: Currency;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
  onBack?: () => void;
}

/**
 * CART PAGE VIEW (Direct Order Submission & Live KHQR Payment Integration)
 */
export const CartPage: React.FC<CartPageProps> = (props) => {
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState<CartItem[]>(() => cartService.getCart());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const cart = props.cart || localCart;
  const currency = props.currency || "USD";

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (props.onUpdateQuantity) {
      props.onUpdateQuantity(productId, quantity);
    } else {
      const updated = cart
        .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      setLocalCart(updated);
      cartService.saveCart(updated);
    }
  };

  const handleRemoveItem = (productId: string) => {
    if (props.onRemoveItem) {
      props.onRemoveItem(productId);
    } else {
      const updated = cart.filter((item) => item.product.id !== productId);
      setLocalCart(updated);
      cartService.saveCart(updated);
    }
  };

  const handleBack = () => {
    if (props.onBack) props.onBack();
    else navigate("/");
  };

  const handleProceedOrder = async () => {
    if (cart.length === 0) return;

    // Require Customer Authentication
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const res = await orderService.createOrder(cart, "khqr");
      const orderData = res.data;

      // Clear local cart and open KHQR Payment Modal
      cartService.clearCart();
      setLocalCart([]);

      if (orderData) {
        setCreatedOrder(orderData);
      } else {
        alert(res.message || "Order created successfully!");
        navigate("/");
      }
    } catch (err: any) {
      alert(typeof err === "string" ? err : "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    const orderNum = createdOrder?.order_number || `ORD-KP-${createdOrder?.id || Math.floor(100000 + Math.random() * 900000)}`;
    const amt = createdOrder?.total_amount || 0;
    setCreatedOrder(null);
    navigate("/order-success", {
      state: {
        orderNumber: orderNum,
        totalAmount: amt,
        paymentMethod: "Bakong KHQR (Paid)",
      },
    });
  };

  return (
    <div>
      {submitting && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-3">
          <div className="bg-white p-4 rounded-4 text-center">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="mb-0 fw-bold">Creating Order & Generating KHQR...</p>
          </div>
        </div>
      )}

      <CartView
        cart={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onBack={handleBack}
        onProceedOrder={handleProceedOrder}
      />

      {/* Live KHQR Payment Modal */}
      {createdOrder && (
        <KHQRModal
          orderId={createdOrder.id}
          orderNumber={createdOrder.order_number || `ORD-KP-${createdOrder.id}`}
          totalAmount={Number(createdOrder.total_amount)}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => {
            setCreatedOrder(null);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};
