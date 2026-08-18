import React from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-top py-5 text-secondary mt-5" style={{ fontSize: '14px' }}>
      <div className="container">
        <div className="row g-4 justify-content-between">
          
          {/* Column 1: Brand Logo, Description & Social */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="border border-dark px-2 py-1 text-center" style={{ lineHeight: '1.1' }}>
                <span className="fw-bold text-dark d-block" style={{ fontSize: '15px' }}>KP</span>
                <span className="text-muted text-uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>Computer_Store</span>
              </div>
            </div>
            
            <p className="text-muted small mb-3" style={{ maxWidth: '320px', lineHeight: '1.6' }}>
              KP Computer Store is a computer store located in Phnom Penh, Cambodia. We sell a variety of computer hardware and accessories.
            </p>

            <p className="text-muted small mb-3">
              Any Question, Call: <span className="fw-bold text-dark">068 616 858 | 096 301 2012</span>
            </p>

            <div className="pt-1">
              <span className="text-muted small d-block mb-2">Or Find Us On:</span>
              <div className="d-flex align-items-center gap-3">
                {/* Facebook SVG */}
                <a href="https://facebook.com/ly.kimphev.07" target="_blank" rel="noreferrer" className="text-primary text-decoration-none" title="Facebook">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Telegram SVG */}
                <a href="https://t.me/LYKIMPHEV" target="_blank" rel="noreferrer" className="text-info text-decoration-none" title="Telegram">
                  <Send size={18} />
                </a>
                {/* Instagram SVG */}
                <a href="https://instagram.com/kenzygoodboy" target="_blank" rel="noreferrer" className="text-danger text-decoration-none" title="Instagram">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Address & Email */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-dark mb-3 fs-6">Address</h6>
            <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
              #524E0, Kampuchea Krom Blvd (128), Phnom Penh, Cambodia
            </p>

            <h6 className="fw-bold text-dark mb-2 fs-6">Email</h6>
            <p className="text-muted small mb-0">
              <a href="mailto:kpcomputerstore@gmail.com" className="text-muted text-decoration-none hover-text-primary">
                kpcomputerstore@gmail.com
              </a>  
            </p>
          </div>

          {/* Column 3 & 4: Quick Links */}
          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-dark mb-3 fs-6">Quick Links</h6>
            <div className="row g-2">
              <div className="col-6">
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li>
                    <Link to="/?tab=laptop" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">Laptop</Link>
                  </li>
                  <li>
                    <Link to="/?tab=pc_hardware" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">PC Hardware</Link>
                  </li>
                  <li>
                    <Link to="/?tab=accessories" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">Accessories</Link>
                  </li>
                  <li>
                    <Link to="/pc-builder" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">PC Builder</Link>
                  </li>
                </ul>
              </div>

              <div className="col-6">
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li>
                    <Link to="/?tab=laptop" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">Home Store</Link>
                  </li>
                  <li>
                    <Link to="/pc-builder" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">Custom PC Set</Link>
                  </li>
                  <li>
                    <Link to="/cart" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">Shopping Cart</Link>
                  </li>
                  <li>
                    <Link to="/profile" onClick={scrollToTop} className="text-muted text-decoration-none hover-text-primary">User Profile</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
