import React from "react";
import type { Product } from "../model";
import { ShoppingCart, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

/**
 * PRODUCT CARD COMPONENT
 * Displays Product Image, Name, Price, View Detail, and Direct Add to Cart buttons.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail, onAddToCart }) => {
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="card h-100 border rounded-4 shadow-sm p-2.5 p-sm-3 bg-white d-flex flex-column justify-content-between">
      <div className="text-center py-2 py-sm-3 bg-light rounded-4 mb-2 border border-opacity-10 position-relative">
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid rounded-3"
          style={{ height: "135px", maxHeight: "175px", objectFit: "contain", opacity: isOutOfStock ? 0.6 : 1 }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/Image/Logo.png";
          }}
        />
      </div>
      <div className="text-center my-1 flex-grow-1 d-flex flex-column justify-content-center">
        <h5 className="fw-bold mb-1 text-dark fs-6 fs-sm-5" style={{ minHeight: "2.4rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </h5>
        <div className="fw-extrabold fs-5 fs-sm-4 text-danger mb-2" style={{ color: "#FF0000" }}>
          ${Number(product.price).toFixed(2)}
        </div>

        {/* Combined Stock & Warranty Badges Row */}
        <div className="d-flex align-items-center justify-content-center gap-1.5 mb-2 flex-wrap">
          {isOutOfStock ? (
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill small fw-bold">
              Out of Stock
            </span>
          ) : product.stock !== undefined && product.stock <= 5 ? (
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 rounded-pill small fw-semibold">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small fw-semibold">
              In Stock
            </span>
          )}
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill small fw-semibold d-inline-flex align-items-center gap-1">
            <ShieldCheck size={12}/> {product.category === "laptop" ? "2 Yr Warranty" : "1 Yr Warranty"} 
          </span>
        </div>

        {/* Compact Modern Tech Specs Pills (Clean Apple-Style Tags) */}
        {product.category === "laptop" && product.specs && (
          <div className="d-flex flex-wrap justify-content-center gap-1 mb-2">
            {product.specs.cpu && (
              <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{ fontSize: "10.5px", fontWeight: 500 }}>
                ⚡ {product.specs.cpu.replace(/^Intel Core\s+|^AMD Ryzen\s+/i, '')}
              </span>
            )}
            {product.specs.ram && (
              <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{ fontSize: "10.5px", fontWeight: 500 }}>
                💾 {product.specs.ram}
              </span>
            )}
            {product.specs.storage && (
              <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{ fontSize: "10.5px", fontWeight: 500 }}>
                💽 {product.specs.storage}
              </span>
            )}
            {product.specs.screen && (
              <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{ fontSize: "10.5px", fontWeight: 500 }}>
                🖥️ {product.specs.screen}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="pt-2 d-flex gap-2">
        <button
          className="btn btn-outline-primary flex-grow-1 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1"
          onClick={() => onViewDetail(product)}
        >
          View Detail
        </button>
        {/* 3. ប៊ូតុង Add to Cart (បើអស់ស្តុក នឹងក្លាយជាពណ៌ប្រផេះ ហើយចុចលែងកើត) */}
        {onAddToCart && (
          <button
            className={`btn py-2 px-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center ${
              isOutOfStock ? "btn-secondary opacity-50" : "text-white"
            }`}
            style={{
              backgroundColor: isOutOfStock ? "#6c757d" : "#1877F2",
              borderColor: isOutOfStock ? "#6c757d" : "#1877F2",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
            }}
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            title={isOutOfStock ? "Product is out of stock" : "Add to Cart"}
          >
            <ShoppingCart size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
