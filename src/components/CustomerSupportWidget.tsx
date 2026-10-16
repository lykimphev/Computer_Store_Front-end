import React, { useState } from "react";
import { 
  Headphones, 
  MessageCircle, 
  Phone, 
  Clock, 
  MapPin, 
  Send, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * TOP NAVBAR CUSTOMER SUPPORT & HOTLINE WIDGET
 * ============================================
 * Located in the top navigation bar right next to the Shopping Cart.
 * Opens an instant dropdown modal for Telegram chat, Phone Hotline, and Support.
 */
export const CustomerSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Store Telegram and Hotline details
  const telegramUsername = "@computerstore_kp_bot"; // Change to your Telegram username
  const telegramUrl = `https://t.me/${telegramUsername}`;
  const hotlinePhone = "+855 963 012 012 / 68 616 858";
  const hotlineTel = "tel:+855 963 012 012";

  return (
    <div className="position-relative d-inline-block">
      <style>{`
        @keyframes supportSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* 1. Navbar Support & Hotline Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-link text-white position-relative p-0 border-0 text-decoration-none d-flex align-items-center justify-content-center"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: isOpen ? "rgba(255, 255, 255, 0.22)" : "transparent",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = "transparent";
        }}
        title="Customer Support & Hotline (ជំនួយអតិថិជន)"
        aria-label="Customer Support"
      >
        <Headphones size={22} className="text-white" />
        
        {/* Online Status Green Dot */}
        <span 
          className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-white rounded-circle"
          style={{ width: "11px", height: "11px" }}
        >
          <span className="visually-hidden">Online</span>
        </span>
      </button>

      {/* 2. Customer Support Dropdown Modal */}
      {isOpen && (
        <>
          {/* Transparent Backdrop to close when clicking outside */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100" 
            style={{ zIndex: 1040 }} 
            onClick={() => setIsOpen(false)} 
          />

          <div
            className="position-fixed shadow-lg rounded-4 overflow-hidden bg-white border"
            style={{
              top: "65px",
              right: "24px",
              width: "360px",
              maxWidth: "calc(100vw - 48px)",
              zIndex: 1050,
              animation: "supportSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.22)",
            }}
          >
            {/* Header */}
            <div 
              className="p-3 text-white d-flex align-items-center justify-content-between"
              style={{ background: "linear-gradient(135deg, #1877F2 0%, #0052cc 100%)" }}
            >
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle bg-white bg-opacity-25 p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "38px", height: "38px" }}
                >
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">KP Support • ជំនួយអតិថិជន</h6>
                  <small className="opacity-75 d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                    <span className="bg-success rounded-circle d-inline-block" style={{ width: "7px", height: "7px" }}></span>
                    We're Online • ឆ្លើយតបរហ័ស
                  </small>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="btn-close btn-close-white btn-sm"
                aria-label="Close support modal"
              ></button>
            </div>

            {/* Body */}
            <div className="p-3 bg-light">
              <div className="bg-white p-3 rounded-3 shadow-sm mb-3 border">
                <p className="small text-muted mb-2">
                  👋 សួស្តី! មានសំណួរ ឬត្រូវការជំនួយពីក្រុមការងារបច្ចេកទេស? សូមទំនាក់ទំនងមកកាន់យើងខ្ញុំផ្ទាល់៖
                </p>

                {/* Direct Telegram Chat Channel */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-between mb-2 text-decoration-none rounded-3"
                  style={{
                    borderColor: "#229ED9",
                    color: "#229ED9",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#229ED9";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#229ED9";
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-light p-1 text-primary d-flex align-items-center justify-content-center">
                      <Send size={15} />
                    </div>
                    <div className="text-start">
                      <div className="fw-bold small">Chat on Telegram</div>
                      <small style={{ fontSize: "11px" }}>@{telegramUsername}</small>
                    </div>
                  </div>
                  <ExternalLink size={15} />
                </a>

                {/* Direct Phone Call Hotline */}
                <a
                  href={hotlineTel}
                  className="btn btn-outline-success w-100 py-2 d-flex align-items-center justify-content-between text-decoration-none rounded-3"
                  style={{ transition: "all 0.2s ease" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-light p-1 text-success d-flex align-items-center justify-content-center">
                      <Phone size={15} />
                    </div>
                    <div className="text-start">
                      <div className="fw-bold small">Call Hotline</div>
                      <small style={{ fontSize: "11px" }}>{hotlinePhone}</small>
                    </div>
                  </div>
                  <ChevronRight size={15} />
                </a>
              </div>

              {/* Quick Navigation Help Links */}
              <div className="bg-white p-3 rounded-3 shadow-sm mb-3 border">
                <div className="fw-bold small text-secondary mb-2 text-uppercase" style={{ fontSize: "11px" }}>
                  Quick Assistance (សេវាកម្មរហ័ស)
                </div>
                <div className="d-flex flex-column gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="d-flex align-items-center justify-content-between p-2 rounded text-dark text-decoration-none bg-light"
                    style={{ fontSize: "13px" }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <ShieldCheck size={16} className="text-primary" />
                      Track Order & Warranty
                    </span>
                    <ChevronRight size={14} className="text-muted" />
                  </Link>

                  <Link
                    to="/pc-builder"
                    onClick={() => setIsOpen(false)}
                    className="d-flex align-items-center justify-content-between p-2 rounded text-dark text-decoration-none bg-light"
                    style={{ fontSize: "13px" }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <Headphones size={16} className="text-success" />
                      PC Builder Assistance
                    </span>
                    <ChevronRight size={14} className="text-muted" />
                  </Link>
                </div>
              </div>

              {/* Store Information */}
              <div className="text-muted small px-1">
                <div className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: "11.5px" }}>
                  <Clock size={13} className="text-primary flex-shrink-0" />
                  <span>Working Hours: <strong>8:00 AM - 8:00 PM</strong> (Everyday)</span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: "11.5px" }}>
                  <MapPin size={13} className="text-danger flex-shrink-0" />
                  <span>Store: Phnom Penh, Cambodia</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSupportWidget;
