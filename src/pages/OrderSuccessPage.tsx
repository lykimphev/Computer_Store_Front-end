import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Truck, ShieldCheck, Home } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};

  const orderNumber = stateData.orderNumber || `ORD-KP-${Math.floor(100000 + Math.random() * 900000)}`;
  const totalAmount = stateData.totalAmount || 0;
  const paymentMethod = stateData.paymentMethod || 'Bakong KHQR (Paid)';

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 text-center p-4 p-md-5 bg-white">
            
            {/* Animated / Styled Success Icon Badge */}
            <div className="mx-auto rounded-circle bg-success-subtle text-success p-4 mb-4 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px' }}>
              <CheckCircle2 size={56} className="text-success" />
            </div>

            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold mb-3 fs-6 align-self-center">
              <ShieldCheck size={16} className="me-1" /> Payment Verified Successfully
            </span>

            <h2 className="fw-bold text-dark mb-2">Thank You For Your Order!</h2>
            <p className="text-secondary mb-4" style={{ fontSize: '15px' }}>
              Your order has been placed and confirmed. Our team is packing your items for delivery.
            </p>

            {/* Order Details Receipt Box */}
            <div className="bg-light rounded-4 p-4 text-start mb-4 border">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <span className="text-muted small fw-semibold">Order Number:</span>
                <span className="fw-bold text-dark font-monospace fs-6">{orderNumber}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Total Paid:</span>
                <span className="fw-bold text-primary fs-5">${Number(totalAmount).toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Payment Method:</span>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1.5 fw-bold">{paymentMethod}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Order Status:</span>
                <span className="badge bg-success text-white rounded-pill px-3 py-1 fw-bold">Processing</span>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-3">
                <span className="text-muted small d-flex align-items-center gap-1">
                  <Truck size={16} className="text-primary" /> Estimated Delivery:
                </span>
                <span className="fw-bold text-dark small">1 - 2 Working Days (Phnom Penh)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary px-4 py-2.5 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: '#1877F2' }}
              >
                <Home size={18} /> ចុចបន្តទិញទំនិញបន្ថែម (Continue Shopping)
              </button>

              <button
                onClick={() => navigate('/profile?tab=invoices')}
                className="btn btn-outline-secondary px-4 py-2.5 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                <Package size={18} /> មើលវិក្កយបត្រ & ការកុម្ម៉ង់ (View Invoices) <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
