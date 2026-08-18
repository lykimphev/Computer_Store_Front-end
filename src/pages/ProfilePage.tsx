import React, { useState, useEffect, useRef } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  LogOut,
  CheckCircle2,
  Camera,
  FileText,
  Printer,
  Calendar,
  PackageCheck,
  ChevronRight,
} from "lucide-react";
import type { User } from "../model";
import { authService } from "../services/authService";
import { orderService } from "../services/orderService";
import { formatImageUrl } from "../services/productService";
import { InvoiceModal } from "../components/InvoiceModal";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "invoices">("profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("012 345 678");
  const [address, setAddress] = useState("Phnom Penh, Cambodia");
  const [avatar, setAvatar] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Orders / Invoices State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (!u) {
      navigate("/login");
      return;
    }
    setCurrentUser(u);
    setFullName(u.fullName || "");
    setEmail(u.email || "");
    setAvatar(u.avatar || "");

    // Check if URL specifies tab=invoices
    if (searchParams.get("tab") === "invoices") {
      setActiveTab("invoices");
    }

    // Load customer order invoices
    loadUserOrders(u.email);
  }, [navigate, searchParams]);

  const loadUserOrders = async (userEmail?: string) => {
    setLoadingOrders(true);
    try {
      const res = await orderService.getUserOrders(userEmail);
      if (res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compress avatar to 128x128 thumbnail
          const canvas = document.createElement("canvas");
          const maxDim = 128;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          setAvatar(compressedBase64);
          if (currentUser) {
            const updated = { ...currentUser, avatar: compressedBase64 };
            authService.saveUser(updated);
            setCurrentUser(updated);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updated = { ...currentUser, fullName, avatar };
      authService.saveUser(updated);
      setCurrentUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
    window.location.reload();
  };

  if (!currentUser) return null;

  return (
    <div className="container py-5">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div className="row g-4 justify-content-center">
        {/* Profile Sidebar */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 text-center p-4 bg-white mb-4">
            {/* Clickable Profile Avatar */}
            <div className="position-relative mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
              <div
                onClick={handleAvatarClick}
                className="rounded-circle bg-primary-subtle text-primary overflow-hidden d-flex align-items-center justify-content-center border border-3 border-white shadow-sm"
                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                title="Click to change profile picture"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <UserIcon size={48} />
                )}
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-1.5 shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", backgroundColor: "#1877F2" }}
                title="Upload Profile Picture"
              >
                <Camera size={16} />
              </button>
            </div>

            <h5 className="fw-bold text-dark mb-1">{currentUser.fullName}</h5>
            <p className="small text-muted mb-3">{currentUser.email}</p>
            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold mb-4">
              <ShieldCheck size={14} className="me-1" /> Active Member
            </span>

            {/* Sidebar Navigation Tabs */}
            <div className="d-flex flex-column gap-2 text-start border-top pt-3">
              <button
                onClick={() => setActiveTab("profile")}
                className={`btn w-100 text-start rounded-3 d-flex align-items-center gap-2 py-2 fw-semibold ${
                  activeTab === "profile" ? "btn-primary text-white" : "btn-light text-dark"
                }`}
                style={activeTab === "profile" ? { backgroundColor: "#1877F2" } : {}}
              >
                <UserIcon size={18} /> Account Details
              </button>

              <button
                onClick={() => {
                  setActiveTab("invoices");
                  loadUserOrders(currentUser.email);
                }}
                className={`btn w-100 text-start rounded-3 d-flex align-items-center justify-content-between py-2 fw-semibold ${
                  activeTab === "invoices" ? "btn-primary text-white" : "btn-light text-dark"
                }`}
                style={activeTab === "invoices" ? { backgroundColor: "#1877F2" } : {}}
              >
                <div className="d-flex align-items-center gap-2">
                  <FileText size={18} /> My Invoices & Orders
                </div>
                <span className="badge bg-white text-primary rounded-pill small fw-bold px-2">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="btn btn-light text-dark w-100 text-start rounded-3 d-flex align-items-center gap-2 py-2 fw-semibold"
              >
                <ShoppingBag size={18} /> Shopping Cart
              </button>

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger w-100 text-start rounded-3 d-flex align-items-center gap-2 py-2 mt-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-12 col-md-8 col-lg-8">
          {/* TAB 1: PROFILE ACCOUNT DETAILS */}
          {activeTab === "profile" && (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Account Settings</h4>
                  <p className="text-muted small mb-0">Manage your personal profile and default shipping address</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("invoices");
                    loadUserOrders(currentUser.email);
                  }}
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                >
                  <FileText size={14} /> View Invoices ({orders.length})
                </button>
              </div>

              {savedSuccess && (
                <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4">
                  <CheckCircle2 size={20} className="text-success" />
                  <span className="fw-bold small">Profile picture and details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <UserIcon size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Email Address (Read only)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={email}
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <Phone size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Default Shipping Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <MapPin size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2.5 rounded-pill fw-bold shadow-sm"
                    style={{ backgroundColor: "#1877F2" }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MY INVOICES & ORDER HISTORY */}
          {activeTab === "invoices" && (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom flex-wrap gap-2">
                <div>
                  <h4 className="fw-bold text-dark mb-1">My Invoices & Order History</h4>
                  <p className="text-muted small mb-0">Check all products you have purchased and view official invoices</p>
                </div>
                <button
                  onClick={() => loadUserOrders(currentUser.email)}
                  className="btn btn-light btn-sm rounded-pill px-3 fw-semibold text-primary"
                >
                  Refresh Invoices
                </button>
              </div>

              {loadingOrders ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted small">Loading invoices from database...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5 rounded-4 bg-light p-4">
                  <PackageCheck size={56} color="#1877F2" className="mb-3 opacity-75" />
                  <h5 className="fw-bold text-dark mb-2">No Past Orders or Invoices Found</h5>
                  <p className="text-muted small mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
                    You do not have any past orders or invoices yet. Explore our store to find the latest laptops and tech gear!
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-white shadow-sm"
                    style={{ backgroundColor: "#1877F2" }}
                  >
                    Explore Store &rarr;
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {orders.map((order, idx) => {
                    const orderNum = order.order_number || `ORD-KP-${order.id || idx + 1}`;
                    const invNum = `INV-${orderNum.replace("ORD-", "")}`;
                    const totalAmt = Number(order.total_amount || 0);
                    const items = order.items || [];
                    const dateStr = order.created_at
                      ? new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Recently";

                    return (
                      <div
                        key={order.id || idx}
                        className="card border rounded-4 shadow-sm overflow-hidden"
                      >
                        {/* Order / Invoice Header Bar */}
                        <div className="bg-light p-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom">
                          <div className="d-flex align-items-center gap-3">
                            <span className="badge bg-primary px-3 py-1.5 rounded-pill fw-bold font-monospace">
                              {invNum}
                            </span>
                            <span className="small text-muted d-flex align-items-center gap-1">
                              <Calendar size={14} /> {dateStr}
                            </span>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold">
                              <ShieldCheck size={12} className="me-1" /> Paid
                            </span>
                            <span className="badge bg-info-subtle text-info px-3 py-1 rounded-pill fw-bold text-uppercase">
                              {order.order_status || "Processing"}
                            </span>
                          </div>
                        </div>

                        {/* Order Body / Item List */}
                        <div className="p-3 px-4">
                          <div className="vstack gap-2 mb-3">
                            {items.length === 0 ? (
                              <div className="small text-muted">Items purchased with total: ${totalAmt.toFixed(2)}</div>
                            ) : (
                              items.map((it: any, itemIdx: number) => {
                                const prodName = it.product?.name || `Product #${it.product_id || itemIdx + 1}`;
                                const prodPrice = Number(it.price || 0);
                                const prodQty = Number(it.qty || 1);

                                return (
                                  <div
                                    key={itemIdx}
                                    className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light bg-opacity-50"
                                  >
                                    <div className="d-flex align-items-center gap-3">
                                      <img
                                        src={formatImageUrl(it.product?.image || it.product?.image_url || "/Image/Logo.png")}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = "/Image/Logo.png";
                                        }}
                                        alt={prodName}
                                        style={{ width: "48px", height: "48px", objectFit: "contain" }}
                                        className="rounded border bg-white p-1"
                                      />
                                      <div>
                                        <div className="fw-bold text-dark small">{prodName}</div>
                                        <span className="text-muted small">Qty: {prodQty} &times; ${prodPrice.toFixed(2)}</span>
                                      </div>
                                    </div>
                                    <div className="fw-bold text-dark">
                                      ${(prodPrice * prodQty).toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Footer Action Details */}
                          <div className="d-flex justify-content-between align-items-center border-top pt-3 flex-wrap gap-2">
                            <div>
                              <span className="small text-muted me-2">Grand Total:</span>
                              <span className="fw-extrabold fs-5 text-primary" style={{ color: "#1877F2" }}>
                                ${totalAmt.toFixed(2)}
                              </span>
                            </div>

                            <button
                              onClick={() => setSelectedInvoice(order)}
                              className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-white d-flex align-items-center gap-2 shadow-sm"
                              style={{ backgroundColor: "#1877F2" }}
                            >
                              <Printer size={16} /> View Invoice <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Printable Official Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
