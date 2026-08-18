import React, { useState, useEffect } from 'react';
import type { Product } from '../model';
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

/**
 * PRODUCT DETAIL POPUP MODAL COMPONENT
 * =====================================
 * DEVELOPER NOTE / CHANGE LOG:
 * - Category-specific technical specs for ALL categories (CPU, Motherboard, GPU, RAM, Storage, Cooler, Monitor, PSU, Case, Laptops, Accessories).
 * - Displays accurate labels for every component type.
 */
export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Reset quantity to 1 whenever a new product modal is opened or product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAddedNotice(false);
    }
  }, [product?.id]);

  if (!product) return null;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1200);
  };

  const handleBuy = () => {
    onBuyNow(product, quantity);
    onClose();
  };

  // Helper to determine upgrade options for laptops
  const getUpgradeOptions = (prod: Product) => {
    if (prod.specs?.upgradeOptions && Array.isArray(prod.specs.upgradeOptions)) {
      return prod.specs.upgradeOptions;
    }
    const b = (prod.brand || '').toLowerCase();
    const sub = (prod.subCategory || '').toLowerCase();
    const name = (prod.name || '').toLowerCase();

    // Macbooks / soldered laptops cannot be upgraded
    if (b.includes('mac') || b.includes('apple') || sub.includes('mac') || name.includes('macbook')) {
      return null;
    }

    // Upgradable Gaming & Power Laptops
    if (prod.category === 'laptop') {
      const p = Number(prod.price || 0);
      return [
        { price: p, ram: '16GB', storage: '512GB' },
        { price: Math.round(p + 150), ram: '32GB', storage: '1TB' },
        { price: Math.round(p + 220), ram: '32GB', storage: '1.5TB' },
        { price: Math.round(p + 300), ram: '32GB', storage: '2TB' },
      ];
    }
    return null;
  };

  // Render Technical Specifications based on category & subcategory
  const renderSpecs = () => {
    // 1. LAPTOPS: Display "About this product" format with conditional Upgrade Spec
    if (product.category === 'laptop') {
      const upgradeOpts = getUpgradeOptions(product);

      return (
        <div className="mt-2">
          <h5 className="fw-bold text-dark mb-3 fs-5">About this product</h5>
          <ul className="list-unstyled mb-3 text-dark" style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <li>- CODE : <span className="text-secondary fw-semibold">LAP-{product.id || 'ROG117'}</span></li>
            <li>- CPU : <span className="text-danger fw-bold">{product.specs.cpu || 'AMD Ryzen™ 9 8940HX'}</span></li>
            <li>- RAM : <span className="text-danger fw-bold">{product.specs.ram || '16GB DDR5'}</span></li>
            <li>- Storage : <span className="text-danger fw-bold">{product.specs.storage || '512GB PCIe® 4.0 NVMe™ M.2'}</span></li>
            <li>- Screen : <span className="text-danger fw-bold">{product.specs.screen || '16" FHD+ ( 1920 × 1200 ) IPS 165Hz'}</span></li>
            <li>- VGA : <span className="text-danger fw-bold">{product.specs.vga || 'NVIDIA® GeForce RTX™ 4060 8GB GDDR6'}</span></li>
            <li>- Keyboard : <span className="text-secondary">4 Zone RGB Backlit</span></li>
            <li>- OS : <span className="text-secondary">Windows 11 Home (64-bit)</span></li>
            <li>- Battery : <span className="text-secondary">90WHrs, 4S1P</span></li>
            <li>- Weight : <span className="text-secondary">2.5 Kg | Color : Eclipse Gray</span></li>
            <li>- Official Warranty : <span className="text-secondary fw-bold">2 YEARS</span></li>
          </ul>

          {/* Render Upgrade Spec ONLY if laptop supports upgrade */}
          {upgradeOpts && upgradeOpts.length > 0 && (
            <div className="border-top pt-3">
              <h6 className="fw-bold text-dark mb-2">Upgrade Spec :</h6>
              <ul className="list-unstyled mb-0" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                {upgradeOpts.map((opt: any, idx: number) => (
                  <li key={idx}>
                    <span className="text-danger fw-bold">${opt.price}</span>{' '}
                    <span className="text-secondary fw-semibold">RAM {opt.ram} | {opt.storage}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    // 2. PROCESSORS / CPU
    if (product.subCategory === 'cpu') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Cores & Threads:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Clock Speed:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Cache:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Socket Type:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 3. MOTHERBOARDS
    if (product.subCategory === 'motherboard') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Socket / CPU:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>RAM Support:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Storage Slots:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Connectivity:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 4. GRAPHICS CARDS (GPU)
    if (product.subCategory === 'gpu') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>VRAM Memory:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Architecture:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Power Required:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Video Outputs:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 5. RAM MEMORY
    if (product.subCategory === 'ram') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Capacity & Kit:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Speed & Type:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Latency:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Features:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 6. STORAGE / SSD
    if (product.subCategory === 'storage') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Capacity & Form Factor:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Read Speed:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Write Speed:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Interface:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 7. CPU COOLERS
    if (product.subCategory === 'cooler') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Radiator Size:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Fan Type:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Display / Pump:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Socket Support:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 8. MONITORS
    if (product.subCategory === 'monitor') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Display & Panel:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Refresh & Response:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>HDR & Sync:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Video Inputs:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 9. POWER SUPPLIES (PSU)
    if (product.subCategory === 'powersupply') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Wattage:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Efficiency Rating:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Modularity:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Standard:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 10. COMPUTER CASES
    if (product.subCategory === 'case') {
      return (
        <ul className="list-unstyled text-secondary small mb-0">
          {product.specs.cpu && <li className="py-1"><strong>Form Factor & Type:</strong> {product.specs.cpu}</li>}
          {product.specs.ram && <li className="py-1"><strong>Motherboard Support:</strong> {product.specs.ram}</li>}
          {product.specs.storage && <li className="py-1"><strong>Radiator Support:</strong> {product.specs.storage}</li>}
          {product.specs.screen && <li className="py-1"><strong>Features:</strong> {product.specs.screen}</li>}
        </ul>
      );
    }

    // 11. ACCESSORIES & OTHER PRODUCTS
    return (
      <ul className="list-unstyled text-secondary small mb-0">
        {product.specs.cpu && <li className="py-1"><strong>Feature 1:</strong> {product.specs.cpu}</li>}
        {product.specs.ram && <li className="py-1"><strong>Feature 2:</strong> {product.specs.ram}</li>}
        {product.specs.storage && <li className="py-1"><strong>Feature 3:</strong> {product.specs.storage}</li>}
        {product.specs.screen && <li className="py-1"><strong>Feature 4:</strong> {product.specs.screen}</li>}
      </ul>
    );
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-0 pb-0 pe-4 pt-4">
            <h4 className="modal-title fw-bold text-dark">{product.name}</h4>
            <button
              type="button"
              className="btn-close rounded-circle p-2"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            <div className="row align-items-center g-4">
              {/* Product Image */}
              <div className="col-md-6 text-center">
                <div className="p-3 bg-light rounded-4 border">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '280px', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/Image/Logo.png";
                    }}
                  />
                </div>
              </div>

              {/* Specifications & Price */}
              <div className="col-md-6">
                <div className="mb-3">
                  <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill fs-6 mb-2">
                    {product.series}
                  </span>
                  <div className="fs-3 fw-bold text-primary mt-2" style={{ color: '#1877F2' }}>
                    ${Number(product.price * quantity).toFixed(2)}
                    {quantity > 1 && (
                      <span className="text-muted fs-6 fw-normal ms-2">
                        (${Number(product.price).toFixed(2)} each)
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-top pt-3 mb-4">
                  <h6 className="fw-bold mb-2">Technical Details:</h6>
                  {renderSpecs()}
                </div>

                {/* Select Quantity */}
                <div className="mb-4">
                  <label className="fw-bold text-dark mb-2 d-block">Select Quantity:</label>
                  <div className="d-flex align-items-center gap-3">
                    <div className="input-group" style={{ width: '140px' }}>
                      <button
                        className="btn btn-outline-secondary rounded-start-3"
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        className="form-control text-center fw-bold bg-white"
                        value={quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary rounded-end-3"
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-muted small">Items to add</span>
                  </div>
                </div>

                {/* Added Confirmation Alert */}
                {addedNotice && (
                  <div className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 rounded-3 mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Check size={18} />
                      <span className="small fw-bold">Added {quantity} item(s) to shopping cart!</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary flex-grow-1 py-2.5 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAdd}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary flex-grow-1 py-2.5 rounded-pill fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#1877F2', borderColor: '#1877F2' }}
                    onClick={handleBuy}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
