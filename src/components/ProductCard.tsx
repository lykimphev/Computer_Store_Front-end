import React from "react";
import type { Product } from "../model";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

/**
 * APPLE-STYLE MINIMALIST PRODUCT CARD
 * ====================================
 * Clean, modern, high-conversion design with spacious typography,
 * subtle muted specs, and pill buttons.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail, onAddToCart }) => {
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  // Clean Apple-style single-line spec summary (no cluttered badges)
  const getSpecSummary = () => {
    if (product.category !== "laptop" || !product.specs) {
      return product.brand ? `${product.brand.toUpperCase()} Series` : null;
    }
    const parts: string[] = [];
    if (product.specs.cpu) {
      parts.push(product.specs.cpu.replace(/^Intel Core\s+|^AMD Ryzen\s+/i, "").trim());
    }
    if (product.specs.ram) {
      parts.push(product.specs.ram.trim());
    }
    if (product.specs.storage) {
      parts.push(product.specs.storage.replace(/\s+Gen\d+/i, "").trim());
    }
    return parts.slice(0, 3).join(" • ");
  };

  const specSummary = getSpecSummary();

  return (
    <div className="card h-100 border border-light-subtle rounded-4 shadow-sm p-3 bg-white d-flex flex-column justify-content-between transition-all" style={{ borderRadius: "20px" }}>
      {/* 1. Seamless Product Photo */}
      <div 
        className="text-center py-3 bg-light rounded-4 mb-2 d-flex align-items-center justify-content-center position-relative overflow-hidden" 
        style={{ height: "155px", cursor: "pointer", backgroundColor: "#f8fafc" }}
        onClick={() => onViewDetail(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid"
          style={{ maxHeight: "135px", maxWidth: "90%", objectFit: "contain", opacity: isOutOfStock ? 0.6 : 1, transition: "transform 0.3s ease" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/Image/Logo.png";
          }}
        />
        {isOutOfStock && (
          <span className="position-absolute badge bg-dark bg-opacity-75 text-white px-3 py-1.5 rounded-pill small fw-semibold">
            Out of Stock
          </span>
        )}
      </div>

      {/* 2. Content Info (Clean Typography) */}
      <div className="text-center my-1 flex-grow-1 d-flex flex-column justify-content-center">
        {/* Title */}
        <h5 
          className="fw-bold mb-1 text-dark fs-6" 
          style={{ minHeight: "2.6rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.3" }}
          title={product.name}
        >
          {product.name}
        </h5>

        {/* Apple-Style Clean Muted Spec Summary (No chunky badge clutter) */}
        <div className="text-muted small mb-2 fw-medium" style={{ fontSize: "11.5px", minHeight: "17px", letterSpacing: "0.2px" }}>
          {specSummary || "\u00A0"}
        </div>

        {/* Price */}
        <div className="fw-bold fs-5 text-dark mb-1" style={{ letterSpacing: "-0.3px" }}>
          ${Number(product.price).toFixed(2)}
        </div>

        {/* Subtle Stock & Warranty Status Line */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2 text-muted" style={{ fontSize: "11.5px" }}>
          {!isOutOfStock ? (
            product.stock !== undefined && product.stock <= 5 ? (
              <span className="text-warning-emphasis fw-semibold">● Only {product.stock} left</span>
            ) : (
              <span className="text-success fw-semibold">● In Stock</span>
            )
          ) : (
            <span className="text-danger fw-semibold">● Out of Stock</span>
          )}
          <span className="opacity-50">·</span>
          <span>{product.category === "laptop" ? "2-Yr Warranty" : "1-Yr Warranty"}</span>
        </div>
      </div>

      {/* 3. Action Buttons (Clean Rounded Pills) */}
      <div className="pt-2 d-flex gap-2">
        <button
          className="btn btn-primary flex-grow-1 py-2 rounded-pill fw-semibold shadow-sm text-nowrap d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#1877F2", borderColor: "#1877F2", fontSize: "13.5px" }}
          onClick={() => onViewDetail(product)}
        >
          View Details
        </button>
        {onAddToCart && (
          <button
            className={`btn py-2 px-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center ${
              isOutOfStock ? "btn-secondary opacity-50" : "btn-light border"
            }`}
            style={{
              backgroundColor: isOutOfStock ? "#6c757d" : "#f1f5f9",
              borderColor: isOutOfStock ? "#6c757d" : "#e2e8f0",
              color: isOutOfStock ? "#ffffff" : "#1877F2",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
            }}
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            title={isOutOfStock ? "Out of stock" : "Add to Cart"}
          >
            <ShoppingCart size={17} />
          </button>
        )}
      </div>
    </div>
  );
};
