import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../model";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { Cpu, CircuitBoard, Monitor, HardDrive, Fan, Zap, Box, CheckCircle2, AlertTriangle, ShoppingCart } from "lucide-react";

interface SelectedComponents {
  cpu: Product | null;
  motherboard: Product | null;
  gpu: Product | null;
  ram: Product | null;
  storage: Product | null;
  cooler: Product | null;
  powersupply: Product | null;
  case: Product | null;
}

export const PCBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [hardwareProducts, setHardwareProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<SelectedComponents>({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    cooler: null,
    powersupply: null,
    case: null,
  });

  // Fetch PC Hardware Products
  useEffect(() => {
    productService
      .getProducts("pc_hardware")
      .then((res) => {
        setHardwareProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setHardwareProducts([]);
        setLoading(false);
      });
  }, []);

  const getFilteredItems = (subCategoryKey: string) => {
    return hardwareProducts.filter(
      (p) => (p.subCategory || "").toLowerCase() === subCategoryKey.toLowerCase()
    );
  };

  const handleSelectComponent = (slot: keyof SelectedComponents, product: Product | null) => {
    setSelected((prev) => ({ ...prev, [slot]: product }));
  };

  // Total price of custom build
  const calculateTotal = (): number => {
    return Object.values(selected).reduce((sum, p) => sum + (p ? Number(p.price) : 0), 0);
  };

  // Socket Compatibility Check
  const checkSocketCompatibility = () => {
    if (!selected.cpu || !selected.motherboard) {
      return { status: "neutral", message: "Select both a CPU and Motherboard to verify socket compatibility." };
    }

    const cpuSocket = (selected.cpu.specs?.screen || selected.cpu.specs?.cpu || "").toLowerCase();
    const mbSocket = (selected.motherboard.specs?.cpu || selected.motherboard.specs?.screen || "").toLowerCase();

    if (
      (cpuSocket.includes("am5") && mbSocket.includes("am5")) ||
      (cpuSocket.includes("1700") && mbSocket.includes("1700"))
    ) {
      return {
        status: "success",
        message: `✅ Compatible: CPU (${selected.cpu.name}) fits Motherboard (${selected.motherboard.name}).`,
      };
    }

    return {
      status: "warning",
      message: `⚠️ Socket Warning: Please double-check CPU & Motherboard socket specifications (${selected.cpu.name} & ${selected.motherboard.name}).`,
    };
  };

  const handleAddBuildToCart = () => {
    const activeComponents = Object.values(selected).filter(Boolean) as Product[];
    if (activeComponents.length === 0) {
      alert("Please select at least 1 PC component to add to cart!");
      return;
    }

    const currentCart = cartService.getCart();
    let updatedCart = [...currentCart];

    activeComponents.forEach((prod) => {
      const existingIndex = updatedCart.findIndex((item) => item.product.id === prod.id);
      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart.push({ product: prod, quantity: 1 });
      }
    });

    cartService.saveCart(updatedCart);
    navigate("/cart");
  };

  const slots = [
    { key: "cpu" as const, title: "Processor (CPU)", icon: <Cpu className="text-primary" /> },
    { key: "motherboard" as const, title: "Motherboard", icon: <CircuitBoard className="text-primary" /> },
    { key: "gpu" as const, title: "Graphics Card (GPU)", icon: <Monitor className="text-primary" /> },
    { key: "ram" as const, title: "RAM Memory", icon: <HardDrive className="text-primary" /> },
    { key: "storage" as const, title: "Storage (SSD)", icon: <HardDrive className="text-primary" /> },
    { key: "cooler" as const, title: "CPU Cooler", icon: <Fan className="text-primary" /> },
    { key: "powersupply" as const, title: "Power Supply (PSU)", icon: <Zap className="text-primary" /> },
    { key: "case" as const, title: "Computer Case", icon: <Box className="text-primary" /> },
  ];

  const compatibility = checkSocketCompatibility();

  return (
    <div className="container-fluid px-4 py-4 min-vh-100">
      {/* Header Banner */}
      <div className="p-4 rounded-4 bg-primary text-white mb-4 shadow-sm" style={{ backgroundColor: "#1877F2" }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="fw-extrabold m-0">CUSTOM PC BUILDER</h2>
            <p className="mb-0 text-white-50 small mt-1">Select components, check socket compatibility, and order your custom PC build!</p>
          </div>
          <div className="text-end">
            <div className="fs-6 text-white-50">Estimated Total:</div>
            <div className="fs-2 fw-extrabold text-white">${calculateTotal().toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Socket Compatibility Alert Banner */}
      <div className={`alert ${compatibility.status === "success" ? "alert-success" : compatibility.status === "warning" ? "alert-warning" : "alert-info"} rounded-4 p-3 mb-4 d-flex align-items-center gap-3 shadow-sm`}>
        {compatibility.status === "success" ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
        <div className="fw-bold">{compatibility.message}</div>
      </div>

      {/* Component Selection Slots */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted fw-semibold">Loading PC Hardware Catalog...</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            {slots.map((slot) => {
              const availableItems = getFilteredItems(slot.key);
              const selectedItem = selected[slot.key];

              return (
                <div key={slot.key} className="card border rounded-4 shadow-xs mb-3 p-3 bg-white transition-all">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      {slot.icon}
                      <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>{slot.title}</span>
                    </div>
                    {selectedItem && (
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-0.5"
                        style={{ fontSize: "12px" }}
                        onClick={() => handleSelectComponent(slot.key, null)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <select
                    className="form-select py-2 rounded-3 fw-medium text-dark border-secondary-subtle"
                    style={{ fontSize: "14px" }}
                    value={selectedItem ? selectedItem.id : ""}
                    onChange={(e) => {
                      const found = availableItems.find((p) => p.id === e.target.value);
                      handleSelectComponent(slot.key, found || null);
                    }}
                  >
                    <option value="">Choose {slot.title}</option>
                    {availableItems.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (${Number(prod.price).toFixed(2)})
                      </option>
                    ))}
                  </select>

                  {selectedItem && (
                    <div className="d-flex align-items-center gap-3 mt-2 p-2 bg-light rounded-3 border">
                      <img src={selectedItem.image} alt={selectedItem.name} style={{ width: "42px", height: "42px", objectFit: "contain" }} />
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{selectedItem.name}</div>
                        <div className="text-primary fw-bold" style={{ fontSize: "13px" }}>${Number(selectedItem.price).toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Build Summary Card */}
          <div className="col-12 col-lg-4">
            <div className="card border rounded-4 shadow-sm p-3 p-md-4 bg-white sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold text-dark mb-3">Custom Build Summary</h5>
              <hr className="my-2 text-muted" />

              <div className="vstack gap-2 mb-3 mt-3">
                {slots.map((slot) => {
                  const item = selected[slot.key];
                  return (
                    <div key={slot.key} className="d-flex justify-content-between align-items-center py-1 border-bottom border-light" style={{ fontSize: "13.5px" }}>
                      <span className="text-muted">{slot.title}</span>
                      <span className={`fw-semibold text-end ms-2 ${item ? 'text-dark' : 'text-muted opacity-75'}`}>
                        {item ? `$${Number(item.price).toFixed(2)}` : "Not selected"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-top pt-3 mb-3 d-flex justify-content-between align-items-center">
                <span className="fs-6 fw-bold text-dark">Total Price:</span>
                <span className="fs-4 fw-extrabold text-primary" style={{ color: "#1877F2" }}>
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  onClick={handleAddBuildToCart}
                  className="btn btn-primary py-2.5 w-100 rounded-pill fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: "#1877F2", borderColor: "#1877F2", fontSize: "15px" }}
                >
                  <ShoppingCart size={18} /> Add Build to Cart & Proceed
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="btn btn-outline-secondary py-2 w-100 rounded-pill fw-semibold"
                  style={{ fontSize: "14px" }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
