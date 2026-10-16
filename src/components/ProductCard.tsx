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
    <div className="card h-100 border rounded-4 shadow-sm p-3 bg-white d-flex flex-column justify-content-between">
      <div className="text-center py-3 bg-light rounded-4 mb-3 border border-opacity-10 position-relative">
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid rounded-3"
          style={{ height: "180px", objectFit: "contain", opacity: isOutOfStock ? 0.6 : 1 }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/Image/Logo.png";
          }}
        />
      </div>
      <div className="text-center my-2">
        <h5 className="fw-bold mb-2 text-dark fs-5">{product.name}</h5>
        <div className="fw-bold fs-4 text-danger mb-2" style={{ color: "#FF0000" }}>
          ${Number(product.price).toFixed(2)}
        </div>
        {/* 2. Badge បង្ហាញស្ថានភាពស្តុក (In Stock / Low Stock / Out of Stock) */}
        <div className="mb-3">
          {isOutOfStock ? (
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 rounded-pill small fw-bold">
              Out of Stock
            </span>
          ) : product.stock !== undefined && product.stock <= 5 ? (
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-pill small fw-semibold">
              Only {product.stock} left in stock!
            </span>
          ) : (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill small fw-semibold">
              In Stock
            </span>
          )}
        </div>
        {/* Warranty Info */}
        <div className="mb-3">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill small fw-semibold d-inline-flex align-items-center gap-1">
            <ShieldCheck size={13}/> {product.category === "laptop" ? "2 Year Warranty" : "1 Year Warranty"} 
          </span>
        </div>

        {product.category === "laptop" && product.specs && (
          <div className="text-secondary small mb-3">
            <ul className="list-unstyled mb-0">
              {product.specs.cpu && (
                <li>
                  <strong>CPU:</strong> {product.specs.cpu}
                </li>
              )}
              {product.specs.ram && (
                <li>
                  <strong>RAM:</strong> {product.specs.ram}
                </li>
              )}
              {product.specs.storage && (
                <li>
                  <strong>Storage:</strong> {product.specs.storage}
                </li>
              )}
              {product.specs.screen && (
                <li>
                  <strong>Screen:</strong> {product.specs.screen}
                </li>
              )}
            </ul>
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
