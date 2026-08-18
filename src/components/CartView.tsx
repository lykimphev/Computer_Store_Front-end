import React from "react";
import type { CartItem, Currency } from "../model";
import { CornerUpLeft, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";

interface CartViewProps {
  cart: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onBack: () => void;
  onProceedOrder: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onBack,
  onProceedOrder,
}) => {
  const totalUSD = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isEmpty = cart.length === 0;

  return (
    <div className="min-vh-100 bg-white d-flex flex-column justify-content-between">
      <div>
        <div className="container-fluid px-4 px-lg-5 pt-4 pb-2">
          <button
            className="btn border-0 d-inline-flex align-items-center gap-3 text-dark p-0"
            onClick={onBack}
            style={{ cursor: "pointer", background: "none" }}
          >
            <CornerUpLeft size={34} color="#1877F2" strokeWidth={2.5} />
            <span className="fw-bold fs-3 text-dark">Back</span>
          </button>
        </div>

        <div className="container-fluid px-4 px-lg-5 my-3">
          {isEmpty ? (
            <div
              className="rounded-5 d-flex flex-column align-items-center justify-content-center text-center p-5 my-3 shadow-sm"
              style={{
                backgroundColor: "#F8F9FA",
                minHeight: "380px",
                border: "2px dashed #D0D5DD",
              }}
            >
              <div className="mb-3 text-primary">
                <ShoppingBag size={72} color="#1877F2" strokeWidth={1.5} />
              </div>
              <h3 className="fw-bold text-dark mb-2">
                No items in your cart
              </h3>
              <p className="text-muted mb-4" style={{ maxWidth: "420px" }}>
                Your shopping cart is currently empty. Explore our store for the latest laptops, PC hardware, and accessories!
              </p>
              <button
                className="btn btn-primary rounded-pill px-4 py-2.5 fs-6 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: "#1877F2" }}
                onClick={onBack}
              >
                Continue Shopping <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {cart.map((item) => (
                <div key={item.product.id} className="col-12">
                  <div className="card rounded-4 border p-3 shadow-sm d-flex flex-row align-items-center justify-content-between flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="rounded-3"
                        style={{ width: "90px", height: "90px", objectFit: "contain" }}
                      />
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">{item.product.name}</h5>
                        <div className="fw-bold text-primary" style={{ color: "#1877F2" }}>
                          ${Number(item.product.price).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 ms-auto">
                      <div className="input-group" style={{ width: "130px" }}>
                        <button
                          className="btn btn-outline-secondary rounded-start-3"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="text"
                          className="form-control text-center fw-bold bg-white"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary rounded-end-3"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger border-0 p-2 rounded-circle"
                        onClick={() => onRemoveItem(item.product.id)}
                        title="Remove Item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-top bg-white py-3 sticky-bottom shadow">
        <div className="container-fluid px-4 px-lg-5">
          <div className="border rounded-4 p-3 ps-4 d-flex align-items-center justify-content-between flex-wrap gap-3 bg-white shadow-sm">
            <div className="fs-3 fw-bold text-primary" style={{ color: "#1877F2" }}>
              Total: {currency === "KHR" ? `KHR ${(totalUSD * 4000).toLocaleString()}` : `$ ${totalUSD.toFixed(2)}`}
            </div>

            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-secondary rounded-pill px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2"
                onClick={onBack}
              >
                <ArrowLeft size={18} /> Continue Shopping
              </button>

              <button
                className="btn btn-primary rounded-pill px-5 py-3 fs-5 fw-bold text-white border-0 shadow d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: "#1877F2" }}
                disabled={isEmpty}
                onClick={onProceedOrder}
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
