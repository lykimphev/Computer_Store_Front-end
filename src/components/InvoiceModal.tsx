import React from "react";
import { Printer, X, ShieldCheck, Store } from "lucide-react";
import { formatImageUrl } from "../services/productService";

interface InvoiceModalProps {
  order: any;
  onClose: () => void;
}

/**
 * OFFICIAL PRINTABLE INVOICE MODAL COMPONENT
 * ==========================================
 * Professional A4 Invoice designed with store branding, itemized table,
 * payment verification stamp, and instant print/PDF support.
 */
export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const orderNum = order.order_number || `ORD-KP-${order.id}`;
  const invNum = `INV-${orderNum.replace("ORD-", "")}`;
  const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleDateString();
  const customerName = order.user?.name || order.customer_name || "Valued Customer";
  const customerEmail = order.user?.email || order.email || "customer@gmail.com";
  const customerPhone = order.phone || "012 345 678";
  const customerAddress = order.shipping_address || "Phnom Penh, Cambodia";
  const totalAmt = Number(order.total_amount || 0);

  const items = order.items || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(6px)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "800px" }}>
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-white">
          
          {/* Header Action Toolbar (Hidden during print) */}
          <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom d-print-none">
            <div className="d-flex align-items-center gap-2 text-primary fw-bold">
              <Store size={20} />
              <span>Official Customer Invoice ({invNum})</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handlePrint}
                className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 text-white shadow-sm"
                style={{ backgroundColor: "#1877F2" }}
              >
                <Printer size={16} /> Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="btn btn-outline-secondary btn-sm rounded-circle p-1.5"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="p-4 p-md-5 bg-white text-dark" id="printable-invoice">
            
            {/* Store Branding Header */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-white border p-1 d-flex align-items-center justify-content-center shadow-sm" style={{ width: "65px", height: "65px" }}>
                  <img src="/Image/Logo.png" alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                </div>
                <div>
                  <h3 className="fw-extrabold mb-1 text-primary" style={{ color: "#1877F2" }}>KP COMPUTER STORE</h3>
                  <p className="small text-muted mb-0">Premium Computers, Laptops & Custom PC Hardware</p>
                  <p className="small text-secondary mb-0">Street 271, Phnom Penh, Cambodia | Tel: +855 12 345 678</p>
                </div>
              </div>

              <div className="text-md-end">
                <span className="badge bg-primary px-3 py-2 fs-6 rounded-pill fw-bold text-uppercase mb-2">INVOICE</span>
                <div className="fw-bold font-monospace fs-6 text-dark">{invNum}</div>
                <div className="small text-muted">Order: {orderNum}</div>
                <div className="small text-muted">Date: {dateStr}</div>
              </div>
            </div>

            {/* Bill To & Payment Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h6 className="fw-bold text-secondary text-uppercase small mb-2">Billed To (Customer):</h6>
                  <div className="fw-bold fs-6 text-dark">{customerName}</div>
                  <div className="small text-muted">{customerEmail}</div>
                  <div className="small text-muted">Phone: {customerPhone}</div>
                  <div className="small text-muted">Address: {customerAddress}</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h6 className="fw-bold text-secondary text-uppercase small mb-2">Payment Details:</h6>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Payment Method:</span>
                    <span className="fw-bold text-uppercase">{order.payment_method || "Bakong KHQR"}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Payment Status:</span>
                    <span className="badge bg-success-subtle text-success fw-bold px-2 py-1 rounded-pill">
                      <ShieldCheck size={12} className="me-1" /> PAID (Verified)
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Delivery Status:</span>
                    <span className="badge bg-info-subtle text-info fw-bold px-2 py-1 rounded-pill text-uppercase">
                      {order.order_status || "Processing"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Products Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }} className="text-center">#</th>
                    <th style={{ width: "55%" }}>Product Description</th>
                    <th style={{ width: "15%" }} className="text-center">Price</th>
                    <th style={{ width: "10%" }} className="text-center">Qty</th>
                    <th style={{ width: "15%" }} className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        No product item details recorded for this invoice.
                      </td>
                    </tr>
                  ) : (
                    items.map((it: any, index: number) => {
                      const prodName = it.product?.name || `Product #${it.product_id || index + 1}`;
                      const prodPrice = Number(it.price || 0);
                      const prodQty = Number(it.qty || 1);
                      const prodSub = Number(it.subtotal || prodPrice * prodQty);

                      return (
                        <tr key={index}>
                          <td className="text-center text-muted fw-bold">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={formatImageUrl(it.product?.image || it.product?.image_url || "/Image/Logo.png")}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/Image/Logo.png";
                                }}
                                alt={prodName}
                                style={{ width: "36px", height: "36px", objectFit: "contain" }}
                                className="rounded border bg-white p-0.5 d-print-none"
                              />
                              <div>
                                <div className="fw-bold text-dark">{prodName}</div>
                                {it.product?.brand && <span className="small text-muted">{it.product.brand}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-semibold">${prodPrice.toFixed(2)}</td>
                          <td className="text-center fw-bold">{prodQty}</td>
                          <td className="text-end fw-bold text-dark">${prodSub.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} rowSpan={3} className="p-3 bg-light align-top">
                      <div className="small text-muted">
                        <strong className="text-dark">Warranty & Terms:</strong> All laptops and PC hardware carry a 1-year official store warranty. For support, contact KP Computer Store.
                      </div>
                    </td>
                    <td className="text-end fw-semibold small">Subtotal:</td>
                    <td className="text-end fw-semibold">${totalAmt.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="text-end fw-semibold small">Tax (0%):</td>
                    <td className="text-end fw-semibold">$0.00</td>
                  </tr>
                  <tr className="table-primary">
                    <td className="text-end fw-extrabold fs-6 text-primary" style={{ color: "#1877F2" }}>Grand Total:</td>
                    <td className="text-end fw-extrabold fs-5 text-primary" style={{ color: "#1877F2" }}>${totalAmt.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer Signatures & QR Code */}
            <div className="d-flex justify-content-between align-items-end pt-3 border-top flex-wrap gap-3">
              <div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=KP_STORE_INVOICE_${invNum}_AMOUNT_${totalAmt}`}
                  alt="Invoice QR Verification"
                  style={{ width: "80px", height: "80px" }}
                  className="rounded border p-1"
                />
                <div className="small text-muted mt-1 font-monospace" style={{ fontSize: "11px" }}>Scan to verify invoice</div>
              </div>

              <div className="text-center" style={{ minWidth: "180px" }}>
                <div className="border-bottom pb-4 mb-1" style={{ width: "160px" }}></div>
                <div className="small fw-bold text-dark">Authorized Signature</div>
                <div className="small text-muted" style={{ fontSize: "11px" }}>KP Computer Store</div>
              </div>
            </div>

          </div>

          {/* Modal Footer (Hidden during print) */}
          <div className="p-3 bg-light border-top d-flex justify-content-end gap-2 d-print-none">
            <button onClick={onClose} className="btn btn-secondary rounded-pill px-4">
              Close
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-primary rounded-pill px-4 fw-bold text-white d-flex align-items-center gap-2 shadow-sm"
              style={{ backgroundColor: "#1877F2" }}
            >
              <Printer size={16} /> Print Invoice
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
