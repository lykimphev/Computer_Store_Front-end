import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem, Currency } from "../model";
import { cartService } from "../services/cartService";
import { orderService } from "../services/orderService";
import { authService } from "../services/authService";
import { CartView } from "../components/CartView";
import { KHQRModal } from "../components/KHQRModal";
import { QrCode, Banknote, Phone, MapPin, X, ArrowRight, ShieldCheck } from "lucide-react";

interface CartPageProps {
  cart?: CartItem[];
  currency?: Currency;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
  onBack?: () => void;
}

/**
 * CART PAGE VIEW (Direct Order Submission & Live KHQR / COD Payment Options)
 */
export const CartPage: React.FC<CartPageProps> = (props) => {
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState<CartItem[]>(() => cartService.getCart());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"khqr" | "cash">("khqr");
  const [phone, setPhone] = useState<string>("012 345 678");
  const [shippingAddress, setShippingAddress] = useState<string>("Phnom Penh, Cambodia");

  // Automatically scroll to top and refresh cart whenever CartPage mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setLocalCart(cartService.getCart());
  }, []);

  const cart = props.cart || localCart;
  const currency = props.currency || "USD";
  const totalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

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

  const handleProceedOrder = () => {
    if (cart.length === 0) return;

    // Require Customer Authentication
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !shippingAddress.trim()) {
      alert("Please enter your delivery phone number and address.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await orderService.createOrder(cart, paymentMethod, phone, shippingAddress);
      const orderData = res.data;

      // Clear local cart
      cartService.clearCart();
      setLocalCart([]);
      setShowCheckoutModal(false);

      if (paymentMethod === "khqr") {
        setCreatedOrder(orderData);
      } else {
        // Cash on delivery: navigate directly to success page
        const orderNum =
          orderData?.order_number ||
          `ORD-KP-${orderData?.id || Math.floor(100000 + Math.random() * 900000)}`;
        const amt = orderData?.total_amount || totalUSD;

        navigate("/order-success", {
          state: {
            orderNumber: orderNum,
            totalAmount: amt,
            paymentMethod: "Cash on Delivery (Pending)",
          },
        });
      }
    } catch (err: any) {
      alert(err?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    const orderNum =
      createdOrder?.order_number ||
      `ORD-KP-${createdOrder?.id || Math.floor(100000 + Math.random() * 900000)}`;
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
          <div className="bg-white p-4 rounded-4 text-center shadow-lg">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="mb-0 fw-bold">Processing Order...</p>
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

      {/* Checkout & Payment Method Selection Modal */}
      {showCheckoutModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(6px)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "520px" }}>
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div
                className="p-3 px-4 text-white d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#1877F2" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={22} />
                  <span className="fw-bold fs-5">Checkout & Payment</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="btn btn-sm btn-link text-white text-decoration-none p-0"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleConfirmCheckout}>
                <div className="modal-body p-4 bg-white">
                  {/* Shipping Contact Details */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-3">📍 Delivery Information</h6>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary mb-1">
                        <Phone size={14} className="me-1" /> Phone Number:
                      </label>
                      <input
                        type="tel"
                        className="form-control rounded-3"
                        placeholder="e.g. 012 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-secondary mb-1">
                        <MapPin size={14} className="me-1" /> Shipping Address:
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Street 271, Boeng Tumpun, Phnom Penh"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method Choice */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-3">💳 Select Payment Method</h6>
                    <div className="vstack gap-2">
                      {/* Option 1: Bakong KHQR */}
                      <label
                        className={`d-flex align-items-center p-3 rounded-3 border cursor-pointer transition ${
                          paymentMethod === "khqr" ? "border-danger bg-danger-subtle bg-opacity-25" : "border-light-subtle"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="khqr"
                          checked={paymentMethod === "khqr"}
                          onChange={() => setPaymentMethod("khqr")}
                          className="form-check-input me-3"
                        />
                        <div className="p-2 rounded-3 bg-danger text-white me-3">
                          <QrCode size={22} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="fw-bold text-dark">Bakong KHQR</span>
                            <span className="badge bg-danger rounded-pill px-2.5 py-1 small">Scan to Pay</span>
                          </div>
                          <div className="small text-muted">Pay instantly via ABA, Wing, ACLEDA, or any bank app</div>
                        </div>
                      </label>

                      {/* Option 2: Cash on Delivery */}
                      <label
                        className={`d-flex align-items-center p-3 rounded-3 border cursor-pointer transition ${
                          paymentMethod === "cash" ? "border-success bg-success-subtle bg-opacity-25" : "border-light-subtle"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="form-check-input me-3"
                        />
                        <div className="p-2 rounded-3 bg-success text-white me-3">
                          <Banknote size={22} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="fw-bold text-dark">Cash on Delivery (COD)</span>
                            <span className="badge bg-success rounded-pill px-2.5 py-1 small">Pay Upon Receipt</span>
                          </div>
                          <div className="small text-muted">Pay cash directly when order arrives at your door</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Order Total Overview */}
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Grand Total:</span>
                    <span className="fs-4 fw-extrabold text-primary" style={{ color: "#1877F2" }}>
                      ${totalUSD.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="modal-footer border-0 p-3 bg-light d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary rounded-pill px-4 fw-bold text-white d-flex align-items-center gap-2 shadow-sm"
                    style={{ backgroundColor: "#1877F2", borderColor: "#1877F2" }}
                  >
                    Confirm & Place Order <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
