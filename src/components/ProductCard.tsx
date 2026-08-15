import React from "react";
import type { Product } from "../model";
import { ShoppingCart } from "lucide-react";

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
  return (
    <div className="card h-100 border rounded-4 shadow-sm p-3 bg-white d-flex flex-column justify-content-between">
      <div className="text-center py-3 bg-light rounded-4 mb-3 border border-opacity-10">
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid rounded-3"
          style={{ height: "180px", objectFit: "contain" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/Image/Logo.png";
          }}
        />
      </div>

      <div className="text-center my-2">
        <h5 className="fw-bold mb-2 text-dark fs-5">{product.name}</h5>

        <div className="fw-bold fs-4 text-danger mb-3" style={{ color: "#FF0000" }}>
          ${Number(product.price).toFixed(2)}
        </div>

        {product.category === "laptop" && product.specs && (
          <div className="text-secondary small mb-3">
            <ul className="list-unstyled mb-0">
              {product.specs.cpu && <li><strong>CPU:</strong> {product.specs.cpu}</li>}
              {product.specs.ram && <li><strong>RAM:</strong> {product.specs.ram}</li>}
              {product.specs.storage && <li><strong>Storage:</strong> {product.specs.storage}</li>}
              {product.specs.screen && <li><strong>Screen:</strong> {product.specs.screen}</li>}
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
        {onAddToCart && (
          <button
            className="btn text-white py-2 px-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#1877F2", borderColor: "#1877F2" }}
            onClick={() => onAddToCart(product)}
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
