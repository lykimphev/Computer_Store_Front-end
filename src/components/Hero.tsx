import React, { useState, useEffect } from 'react';
import { Laptop, Cpu, HardDrive } from 'lucide-react';

interface HeroProps {
  activeTab: string;
  activeBrand: string;
  onTabChange: (tab: string) => void;
  onBrandChange: (brand: string) => void;
}

/**
 * HERO BANNER & NAVIGATION COMPONENT
 * ==================================
 * DEVELOPER NOTE / CHANGE LOG:
 * - Fixed left corner slide bleed glitch by moving padding inside slides and applying clip-path inset with rounded corners.
 * - Removed floating arrow buttons; uses right-to-left smooth slider track.
 */
const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'ASUS ProArt P16',
    subtitle: 'Creator Laptop with 4K OLED Display & AMD Ryzen™ AI 9',
    image: '/Image/Laptop/ProArt.png',
    badge: 'Featured Creator Laptop',
    price: '$ 2,749',
  },
  {
    id: 2,
    title: 'ASUS ROG Strix G615',
    subtitle: 'Ultra-High Performance Gaming Laptop with 240Hz Display',
    image: '/Image/Laptop/ROG Strix G615.png',
    badge: 'Ultimate Gaming',
    price: '$ 2,499',
  },
  {
    id: 3,
    title: 'MacBook Pro M5',
    subtitle: 'Extreme Apple Silicon Performance & 120Hz Liquid Retina Display',
    image: '/Image/Laptop/macbook-pro-14-inch-m5-cambodia.png',
    badge: 'Apple Next-Gen',
    price: '$ 2,729',
  },
  {
    id: 4,
    title: 'MSI Raider A18',
    subtitle: 'Monster 18" 4K MiniLED 120Hz Display with Ryzen 9 9955HX3D',
    image: '/Image/Laptop/Raider A18.png',
    badge: 'Flagship Performance',
    price: '$ 3,999',
  },
];

export const Hero: React.FC<HeroProps> = ({
  activeTab,
  activeBrand,
  onTabChange,
  onBrandChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-slide timer effect (4 seconds interval, slides right to left)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Dynamic Subcategory / Filter Pills based on active category tab
  const filterOptions = React.useMemo(() => {
    if (activeTab === 'pc_hardware') {
      return [
        { key: 'all', label: 'All Hardware' },
        { key: 'cpu', label: 'CPU (Processors)' },
        { key: 'motherboard', label: 'Motherboards' },
        { key: 'gpu', label: 'GPU (Graphics Cards)' },
        { key: 'ram', label: 'RAM Memory' },
        { key: 'storage', label: 'Storage (SSD)' },
        { key: 'cooler', label: 'Coolers' },
        { key: 'monitor', label: 'Monitors' },
        { key: 'powersupply', label: 'Power Supplies' },
        { key: 'case', label: 'Cases' },
      ];
    }
    if (activeTab === 'accessories') {
      return [
        { key: 'all', label: 'All Accessories' },
        { key: 'headphone', label: 'Headphones & Headsets' },
        { key: 'mouse', label: 'Gaming Mice' },
        { key: 'keyboard', label: 'Keyboards' },
        { key: 'usb', label: 'USB Flash Drives' },
        { key: 'external', label: 'External Storage' },
        { key: 'gaming_chair', label: 'Gaming Chairs' },
        { key: 'wifi', label: 'Wi-Fi & Networking' },
      ];
    }
    if (activeTab === 'pc_builder') {
      return [
        { key: 'all', label: 'All Builder Parts' },
        { key: 'cpu', label: 'CPU (Processors)' },
        { key: 'motherboard', label: 'Motherboards' },
        { key: 'gpu', label: 'GPU (Graphics Cards)' },
        { key: 'ram', label: 'RAM Memory' },
        { key: 'storage', label: 'Storage (SSD)' },
        { key: 'cooler', label: 'Coolers' },
        { key: 'powersupply', label: 'Power Supplies' },
        { key: 'case', label: 'Cases' },
      ];
    }
    // Laptop brands default
    return [
      { key: 'all', label: 'All Products' },
      { key: 'asus', label: 'ASUS' },
      { key: 'asus_rog', label: 'ASUS ROG' },
      { key: 'msi', label: 'MSI' },
      { key: 'mac', label: 'Mac' },
    ];
  }, [activeTab]);

  return (
    <div className="bg-white w-100">
      {/* Welcome Title */}
      <div className="text-center py-4 px-3 border-bottom">
        <h1 className="fw-bold fs-2 mb-2">
          Welcome to <span style={{ color: '#1877F2' }}>KP Computer Store</span>
        </h1>
        <p className="text-secondary fs-5 mb-0 mx-auto" style={{ maxWidth: '700px' }}>
          Your one-stop destination for the latest mobile technology.
        </p>
      </div>

      {/* Main Categories Navigation */}
      <div className="border-bottom py-3">
        <div className="w-100 px-3 px-md-4">
          <div className="row text-center g-3">
            <div className="col-4">
              <button
                type="button"
                className={`btn w-100 category-tab-btn fw-bold d-flex align-items-center justify-content-center gap-2 ${
                  activeTab === 'laptop' ? 'active' : 'text-dark'
                }`}
                onClick={() => onTabChange('laptop')}
                style={{ fontSize: '16px', letterSpacing: '0.5px', cursor: 'pointer' }}
              >
                <Laptop size={20} />
                LAPTOP
              </button>
            </div>
            <div className="col-4">
              <button
                type="button"
                className={`btn w-100 category-tab-btn fw-bold d-flex align-items-center justify-content-center gap-2 ${
                  activeTab === 'pc_hardware' ? 'active' : 'text-dark'
                }`}
                onClick={() => onTabChange('pc_hardware')}
                style={{ fontSize: '16px', letterSpacing: '0.5px', cursor: 'pointer' }}
              >
                <Cpu size={20} />
                PC HARDWARE
              </button>
            </div>
            <div className="col-4">
              <button
                type="button"
                className={`btn w-100 category-tab-btn fw-bold d-flex align-items-center justify-content-center gap-2 ${
                  activeTab === 'accessories' ? 'active' : 'text-dark'
                }`}
                onClick={() => onTabChange('accessories')}
                style={{ fontSize: '16px', letterSpacing: '0.5px', cursor: 'pointer' }}
              >
                <HardDrive size={20} />
                ACCESSORIES
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories / Component Filter Pills */}
      <div className="border-bottom bg-white py-3">
        <div className="w-100 px-3 px-md-4">
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 gap-md-3 py-1">
            {filterOptions.map((opt) => {
              const isSelected = activeBrand === opt.key;
              return (
                <button
                  type="button"
                  key={opt.key}
                  className={`btn px-4 py-2 rounded-pill fw-bold text-nowrap transition-all ${
                    isSelected
                      ? 'btn-primary text-white shadow-sm'
                      : 'btn-outline-light text-dark border-0 hover-bg-light'
                  }`}
                  onClick={() => onBrandChange(opt.key)}
                  style={{
                    backgroundColor: isSelected ? '#1877F2' : 'transparent',
                    fontSize: '14px',
                    borderRadius: '50rem',
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Smooth Horizontal Auto-Slide Hero Carousel (Clip-path prevents edge bleed completely) */}
      <div className="w-100 px-3 px-md-4 py-4">
        <div
          className="bg-light shadow-sm position-relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            minHeight: '380px',
            borderRadius: '24px',
            overflow: 'hidden',
            clipPath: 'inset(0 round 24px)',
            WebkitClipPath: 'inset(0 round 24px)',
            isolation: 'isolate',
          }}
        >
          {/* Track containing all slides side-by-side */}
          <div
            className="d-flex h-100"
            style={{
              transform: `translateX(-${currentIndex * (100 / CAROUSEL_SLIDES.length)}%)`,
              transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
              width: `${CAROUSEL_SLIDES.length * 100}%`,
            }}
          >
            {CAROUSEL_SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 p-4 p-md-5"
                style={{ width: `${100 / CAROUSEL_SLIDES.length}%` }}
              >
                <div className="row align-items-center g-4 py-2 h-100">
                  <div className="col-lg-7 text-center text-lg-start ps-lg-4">
                    <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold mb-2">
                      {slide.badge}
                    </span>
                    <h2 className="fw-bold display-6 text-dark mt-2 mb-3">
                      {slide.title}
                    </h2>
                    <p className="text-secondary fs-5 mb-4" style={{ maxWidth: '550px' }}>
                      {slide.subtitle}
                    </p>
                    <div className="fs-3 fw-bold text-primary mb-2" style={{ color: '#1877F2' }}>
                      {slide.price}
                    </div>
                  </div>

                  <div className="col-lg-5 text-center">
                    <img
                      src={slide.image.startsWith('http') ? slide.image : slide.image}
                      alt={slide.title}
                      className="img-fluid rounded-4"
                      style={{ maxHeight: '320px', objectFit: 'contain', width: '100%' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/Image/Logo.png";
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Indicator Dots */}
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2" style={{ zIndex: 10 }}>
            {CAROUSEL_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                className="btn p-0 rounded-pill transition-all"
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: currentIndex === index ? '28px' : '10px',
                  height: '10px',
                  backgroundColor: currentIndex === index ? '#1877F2' : '#C1C1C1',
                  border: 'none',
                  transition: 'all 0.3s ease',
                }}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
