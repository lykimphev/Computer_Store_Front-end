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
  const totalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const isEmpty = cart.length === 0;

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <div className="flex-grow-1">
        <div className="container-fluid px-3 px-sm-4 px-lg-5 pt-3 pt-sm-4 pb-2">
          <button
            className="btn border-0 d-inline-flex align-items-center gap-2 text-dark p-0"
            onClick={onBack}
            style={{ cursor: "pointer", background: "none" }}
          >
            <CornerUpLeft size={28} color="#1877F2" strokeWidth={2.5} />
            <span className="fw-bold fs-4 text-dark">Back</span>
          </button>
        </div>

        <div className="container-fluid px-3 px-sm-4 px-lg-5 my-2 my-sm-3">
          {isEmpty ? (
            <div
              className="rounded-5 d-flex flex-column align-items-center justify-content-center text-center p-4 p-sm-5 my-3 shadow-sm"
              style={{
                backgroundColor: "#F8F9FA",
                minHeight: "360px",
                border: "2px dashed #D0D5DD",
              }}
            >
              <div className="mb-3 text-primary">
                <ShoppingBag size={64} color="#1877F2" strokeWidth={1.5} />
              </div>
              <h4 className="fw-bold text-dark mb-2">No items in your cart</h4>
              <p className="text-muted mb-4 px-2" style={{ maxWidth: "420px", fontSize: "0.95rem" }}>
                Your shopping cart is currently empty. Explore our store for the latest laptops, PC hardware, and
                accessories!
              </p>
              <button
                className="btn btn-primary rounded-pill px-4 py-2.5 fs-6 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: "#1877F2" }}
                onClick={onBack}
              >
                <span>Continue Shopping</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {cart.map((item) => (
                <div key={item.product.id} className="col-12">
                  <div className="card rounded-4 border p-3 shadow-sm">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: "180px" }}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="rounded-3 bg-light p-1 border"
                          style={{ width: "75px", height: "75px", objectFit: "contain", flexShrink: 0 }}
                        />
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-bold mb-1 text-dark text-truncate" title={item.product.name} style={{ maxWidth: "240px" }}>
                            {item.product.name}
                          </h6>
                          <div className="fw-extrabold text-primary fs-6" style={{ color: "#1877F2" }}>
                            ${Number(item.product.price).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 ms-auto">
                        <div className="input-group" style={{ width: "115px" }}>
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-start-3"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="text"
                            className="form-control form-control-sm text-center fw-bold bg-white px-1"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-end-3"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          className="btn btn-outline-danger border-0 p-2 rounded-circle"
                          onClick={() => onRemoveItem(item.product.id)}
                          title="Remove Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isEmpty && (
        <div className="border-top bg-white py-3 sticky-bottom shadow-lg" style={{ zIndex: 1020 }}>
          <div className="container-fluid px-3 px-sm-4 px-lg-5">
            <div className="border rounded-4 p-3 bg-white shadow-sm d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3">
              <div className="d-flex justify-content-between align-items-center align-items-md-start flex-md-column px-1">
                <span className="text-secondary small fw-bold text-uppercase">Total Amount</span>
                <span className="fs-3 fw-extrabold text-primary" style={{ color: "#1877F2" }}>
                  {currency === "KHR"
                    ? `KHR ${(totalUSD * 4000).toLocaleString()}`
                    : `$${totalUSD.toFixed(2)}`}
                </span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 gap-sm-3">
                <button
                  className="btn btn-outline-secondary rounded-pill py-2.5 px-4 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 order-2 order-sm-1"
                  onClick={onBack}
                >
                  <ArrowLeft size={18} />
                  <span>Continue Shopping</span>
                </button>

                <button
                  className="btn btn-primary rounded-pill py-2.5 px-4 px-sm-5 fw-bold text-white border-0 shadow d-inline-flex align-items-center justify-content-center gap-2 order-1 order-sm-2"
                  style={{ backgroundColor: "#1877F2" }}
                  onClick={onProceedOrder}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
