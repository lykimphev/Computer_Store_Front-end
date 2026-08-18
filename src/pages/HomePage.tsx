import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Product } from "../model";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { Hero } from "../components/Hero";
import { ProductCard } from "../components/ProductCard";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface HomePageProps {
  activeTab?: string;
  activeBrand?: string;
  onTabChange?: (tab: string) => void;
  onBrandChange?: (brand: string) => void;
  onViewDetail?: (product: Product) => void;
}

/**
 * HOME PAGE VIEW (Live PostgreSQL Connected & Fully Interactive)
 * Allows filtering by Category Tabs, Brand/Component Filter Pills, and Opening Product Details.
 */
export const HomePage: React.FC<HomePageProps> = ({
  activeTab: propTab,
  activeBrand: propBrand,
  onTabChange,
  onBrandChange,
  onViewDetail,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");

  const [internalTab, setInternalTab] = useState<string>("laptop");
  const [internalBrand, setInternalBrand] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (urlTab) {
      setInternalTab(urlTab);
      setInternalBrand("all");
    }
  }, [urlTab]);

  const activeTab = propTab !== undefined ? propTab : internalTab;
  const activeBrand = propBrand !== undefined ? propBrand : internalBrand;

  const handleTabChange = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
    setInternalBrand("all");
    if (onBrandChange) onBrandChange("all");
  };

  const handleBrandChange = (brand: string) => {
    if (onBrandChange) onBrandChange(brand);
    setInternalBrand(brand);
  };

  const handleOpenDetail = (product: Product) => {
    if (onViewDetail) onViewDetail(product);
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const currentCart = cartService.getCart();
    const existingIndex = currentCart.findIndex((item) => item.product.id === product.id);
    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...currentCart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...currentCart, { product, quantity }];
    }
    cartService.saveCart(updatedCart);

    // Trigger toast notification
    setToastMessage(`Added ${quantity}x "${product.name}" to your cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    handleAddToCart(product, quantity);
    navigate("/cart");
  };

  // Fetch products whenever active category tab changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryCategory = activeTab === "pc_builder" ? "pc_hardware" : activeTab;

    productService
      .getProducts(queryCategory)
      .then((res) => {
        if (isMounted) {
          setProducts(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const laptopSeriesList = [
    { title: "Mac Series", key: "mac" },
    { title: "ASUS Series", key: "asus" },
    { title: "ASUS ROG Series", key: "asus_rog" },
    { title: "MSI Series", key: "msi" },
  ];

  const pcHardwareList = [
    { title: "Processors (CPU)", key: "cpu" },
    { title: "Graphics Cards (GPU)", key: "gpu" },
    { title: "Motherboards", key: "motherboard" },
    { title: "RAM Memory", key: "ram" },
    { title: "Storage (SSD)", key: "storage" },
    { title: "CPU Liquid & Air Coolers", key: "cooler" },
    { title: "Monitors", key: "monitor" },
    { title: "Power Supplies (PSU)", key: "powersupply" },
    { title: "Computer Cases", key: "case" },
  ];

  const accessoriesList = [
    { title: "Headphones & Headsets", key: "headphone" },
    { title: "Gaming & Wireless Mice", key: "mouse" },
    { title: "Keyboards", key: "keyboard" },
    { title: "External Storage", key: "external" },
    { title: "USB Flash Drives", key: "usb" },
    { title: "Wi-Fi & Networking", key: "wifi" },
    { title: "Ergonomic Gaming Chairs", key: "chair" },
  ];

  const pcBuilderList = [
    { title: "Processors (CPU)", key: "cpu" },
    { title: "Motherboards", key: "motherboard" },
    { title: "Graphics Cards (GPU)", key: "gpu" },
    { title: "RAM Memory", key: "ram" },
    { title: "Storage (SSD)", key: "storage" },
    { title: "CPU Coolers", key: "cooler" },
    { title: "Power Supplies", key: "powersupply" },
    { title: "Computer Cases", key: "case" },
  ];

  // Helper to match key against brand, subCategory, series, or name
  const matchesKey = (product: Product, key: string): boolean => {
    if (key === "all") return true;
    const cleanKey = key.toLowerCase().replace(/[\s_-]+/g, "");
    const brand = (product.brand || "").toLowerCase().replace(/[\s_-]+/g, "");
    const sub = (product.subCategory || "").toLowerCase().replace(/[\s_-]+/g, "");
    const series = (product.series || "").toLowerCase().replace(/[\s_-]+/g, "");
    const name = (product.name || "").toLowerCase().replace(/[\s_-]+/g, "");

    if (cleanKey === "asus") {
      return (brand === "asus" && sub !== "asusrog") || (sub === "asus");
    }
    if (cleanKey === "asusrog") {
      return brand === "asusrog" || sub === "asusrog" || name.includes("rog");
    }

    return brand === cleanKey || sub === cleanKey || series.includes(cleanKey) || name.includes(cleanKey);
  };

  // Filtered product items based on active brand/component filter
  const displayedProducts = products.filter((p) => matchesKey(p, activeBrand));

  // Determine title for single filtered view
  const getFilterTitle = (key: string): string => {
    if (activeTab === "laptop") {
      return laptopSeriesList.find((s) => s.key === key)?.title || `${key.toUpperCase()} Laptops`;
    }
    if (activeTab === "pc_hardware" || activeTab === "pc_builder") {
      return pcHardwareList.find((s) => s.key === key)?.title || `${key.toUpperCase()} Components`;
    }
    if (activeTab === "accessories") {
      return accessoriesList.find((s) => s.key === key)?.title || `${key.toUpperCase()} Accessories`;
    }
    return "Products";
  };

  const renderProductGrid = (items: Product[]) => (
    <div className="row g-4">
      {items.map((product) => (
        <div key={product.id} className="col-12 col-md-6 col-lg-4">
          <ProductCard product={product} onViewDetail={handleOpenDetail} onAddToCart={(p) => handleAddToCart(p, 1)} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 bg-white border border-primary shadow-lg rounded-4 d-flex align-items-center gap-3 z-3"
          style={{ animation: "fadeIn 0.2s ease-out forwards", maxWidth: "400px" }}
        >
          <CheckCircle2 size={24} color="#1877F2" className="flex-shrink-0" />
          <div className="flex-grow-1 small fw-bold text-dark">{toastMessage}</div>
          <button
            onClick={() => navigate("/cart")}
            className="btn btn-sm btn-primary rounded-pill px-3 fw-bold text-nowrap"
            style={{ backgroundColor: "#1877F2" }}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Hero with Category Tabs, Subcategory Filters, and Carousel */}
      <Hero
        activeTab={activeTab}
        activeBrand={activeBrand}
        onTabChange={handleTabChange}
        onBrandChange={handleBrandChange}
      />

      <div className="w-100 px-3 px-md-4 py-4" id="products-grid">
        <h2 className="fw-bold text-center mb-5 fs-2">
          {activeTab === "laptop" && "Featured Laptop Series"}
          {activeTab === "pc_hardware" && "PC Hardware Components"}
          {activeTab === "pc_builder" && "Custom PC Builder Components"}
          {activeTab === "accessories" && "Gaming & Tech Accessories"}
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
            <p className="mt-3 text-muted">Loading live products from database...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="fs-5 mb-3">No products found for the selected filter.</p>
            <button
              className="btn btn-outline-primary rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2"
              onClick={() => handleBrandChange("all")}
            >
              <RotateCcw size={16} /> Show All Products
            </button>
          </div>
        ) : (
          <div>
            {/* 1. LAPTOP CATEGORY */}
            {activeTab === "laptop" && (
              activeBrand === "all" ? (
                laptopSeriesList.map((series) => {
                  const seriesItems = products.filter((p) => matchesKey(p, series.key));
                  if (seriesItems.length === 0) return null;
                  return (
                    <div key={series.key} className="mb-5">
                      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                        <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                          {series.title}
                        </h3>
                        <button
                          className="btn btn-sm btn-link text-decoration-none fw-bold"
                          onClick={() => handleBrandChange(series.key)}
                        >
                          View All ({seriesItems.length}) &rarr;
                        </button>
                      </div>
                      {renderProductGrid(seriesItems.slice(0, 3))}
                    </div>
                  );
                })
              ) : (
                <div className="mb-5">
                  <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                    <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                      {getFilterTitle(activeBrand)}
                    </h3>
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold"
                      onClick={() => handleBrandChange("all")}
                    >
                      Show All Laptops
                    </button>
                  </div>
                  {renderProductGrid(displayedProducts)}
                </div>
              )
            )}

            {/* 2. PC HARDWARE CATEGORY */}
            {activeTab === "pc_hardware" && (
              activeBrand === "all" ? (
                pcHardwareList.map((section) => {
                  const sectionItems = products.filter((p) => matchesKey(p, section.key));
                  if (sectionItems.length === 0) return null;
                  return (
                    <div key={section.key} className="mb-5">
                      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                        <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                          {section.title}
                        </h3>
                        <button
                          className="btn btn-sm btn-link text-decoration-none fw-bold"
                          onClick={() => handleBrandChange(section.key)}
                        >
                          View All ({sectionItems.length}) &rarr;
                        </button>
                      </div>
                      {renderProductGrid(sectionItems.slice(0, 3))}
                    </div>
                  );
                })
              ) : (
                <div className="mb-5">
                  <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                    <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                      {getFilterTitle(activeBrand)}
                    </h3>
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold"
                      onClick={() => handleBrandChange("all")}
                    >
                      Show All Hardware
                    </button>
                  </div>
                  {renderProductGrid(displayedProducts)}
                </div>
              )
            )}

            {/* 3. ACCESSORIES CATEGORY */}
            {activeTab === "accessories" && (
              activeBrand === "all" ? (
                accessoriesList.map((section) => {
                  const sectionItems = products.filter((p) => matchesKey(p, section.key));
                  if (sectionItems.length === 0) return null;
                  return (
                    <div key={section.key} className="mb-5">
                      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                        <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                          {section.title}
                        </h3>
                        <button
                          className="btn btn-sm btn-link text-decoration-none fw-bold"
                          onClick={() => handleBrandChange(section.key)}
                        >
                          View All ({sectionItems.length}) &rarr;
                        </button>
                      </div>
                      {renderProductGrid(sectionItems.slice(0, 3))}
                    </div>
                  );
                })
              ) : (
                <div className="mb-5">
                  <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                    <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                      {getFilterTitle(activeBrand)}
                    </h3>
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold"
                      onClick={() => handleBrandChange("all")}
                    >
                      Show All Accessories
                    </button>
                  </div>
                  {renderProductGrid(displayedProducts)}
                </div>
              )
            )}

            {/* 4. PC BUILDER CATEGORY */}
            {activeTab === "pc_builder" && (
              activeBrand === "all" ? (
                pcBuilderList.map((section) => {
                  const sectionItems = products.filter((p) => matchesKey(p, section.key));
                  if (sectionItems.length === 0) return null;
                  return (
                    <div key={section.key} className="mb-5">
                      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                        <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                          {section.title}
                        </h3>
                        <button
                          className="btn btn-sm btn-link text-decoration-none fw-bold"
                          onClick={() => handleBrandChange(section.key)}
                        >
                          View All ({sectionItems.length}) &rarr;
                        </button>
                      </div>
                      {renderProductGrid(sectionItems)}
                    </div>
                  );
                })
              ) : (
                <div className="mb-5">
                  <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                    <h3 className="fw-bold text-primary mb-0" style={{ color: "#1877F2" }}>
                      {getFilterTitle(activeBrand)}
                    </h3>
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold"
                      onClick={() => handleBrandChange("all")}
                    >
                      Show All Components
                    </button>
                  </div>
                  {renderProductGrid(displayedProducts)}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Interactive Product Details Popup Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseDetail}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </>
  );
};

