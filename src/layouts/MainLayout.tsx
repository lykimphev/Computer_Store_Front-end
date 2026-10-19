import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User as UserIcon } from "lucide-react";
import { authService } from "../services/authService";
import { cartService } from "../services/cartService";
import { Footer } from "../components/Footer";
import { CustomerSupportWidget } from "../components/CustomerSupportWidget";
import type { User } from "../model";

/**
 * MAIN LAYOUT COMPONENT (Teacher's Exact Pattern)
 * ===============================================
 * Contains Navbar directly with NavLinks to allow users to click back and forth between pages,
 * and renders child routes cleanly inside <Outlet />.
 */
export default function MainLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [cartCount, setCartCount] = useState<number>(() => {
    return cartService.getCart().reduce((sum, item) => sum + item.quantity, 0);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser(authService.getCurrentUser());
      setCartCount(cartService.getCart().reduce((sum, item) => sum + item.quantity, 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    cartService.clearCart();
    setCartCount(0);
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="bg-light min-vh-100 w-100 d-flex flex-column justify-content-between">
      {/* 1. Navbar (Full Screen Fluid Container) */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm py-2 sticky-top" style={{ backgroundColor: "#1877F2" }}>
        <Container fluid className="px-4 position-relative">
          <Navbar.Brand href="/" className="fw-bold fs-4 me-auto me-lg-4 d-flex align-items-center gap-2">
            <div className="rounded-circle bg-white p-1 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "34px", height: "34px" }}>
              <img src="/Image/Logo.png" alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <span className="fs-6 fs-sm-5 fw-bold text-nowrap">KP Computer Store</span>
          </Navbar.Brand>

          {/* Quick Actions & Menu Toggle on Mobile (Always in 1 Single Row) */}
          <div className="d-flex d-lg-none align-items-center gap-2 ms-auto flex-nowrap">
            <CustomerSupportWidget />
            <NavLink to="/cart" className="position-relative text-white p-1 text-decoration-none" title="Shopping Cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{ fontSize: "10px" }}>
                  {cartCount}
                </span>
              )}
            </NavLink>
            <Navbar.Toggle aria-controls="main-navbar-nav" className="border-0 p-1 ms-1 text-white shadow-none" style={{ fontSize: "0.85rem" }} />
          </div>

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="navbar-center-nav gap-3 py-2 py-lg-0">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link text-white fw-semibold ${isActive ? "opacity-100 fw-bold" : "opacity-85"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/pc-builder"
                className={({ isActive }) =>
                  `nav-link text-white fw-semibold ${isActive ? "opacity-100 fw-bold" : "opacity-85"}`
                }
              >
                PC Builder
              </NavLink>
            </Nav>

            {/* Right User Actions (Desktop View) */}
            <div className="d-none d-lg-flex align-items-center gap-3 ms-auto">
              <CustomerSupportWidget />

              <NavLink to="/cart" className="position-relative text-white me-2 text-decoration-none" title="Shopping Cart">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{ fontSize: "10px" }}>
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {currentUser ? (
                <div className="d-flex align-items-center gap-2 text-white">
                  <NavLink to="/profile" className="btn btn-sm btn-light text-primary fw-bold rounded-pill px-3 d-flex align-items-center gap-2 text-decoration-none shadow-sm">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="rounded-circle" style={{ width: "20px", height: "20px", objectFit: "cover" }} />
                    ) : (
                      <UserIcon size={15} />
                    )}
                    {currentUser.fullName?.split(' ')[0] || 'Profile'}
                  </NavLink>
                  <button onClick={handleLogout} className="btn btn-sm btn-outline-light rounded-pill px-3 d-flex align-items-center gap-1">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <NavLink to="/login" className="btn btn-light btn-sm text-primary fw-bold rounded-pill px-3 text-decoration-none">
                  <UserIcon size={16} className="me-1" /> Login
                </NavLink>
              )}
            </div>

            {/* Mobile User Profile/Login Section (inside menu collapse) */}
            <div className="d-lg-none pt-3 mt-2 border-top border-white border-opacity-25">
              {currentUser ? (
                <div className="d-flex flex-column gap-2 text-white">
                  <NavLink to="/profile" className="btn btn-light text-primary fw-bold rounded-pill py-2 w-100 d-flex align-items-center justify-content-center gap-2 text-decoration-none shadow-sm">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="rounded-circle" style={{ width: "22px", height: "22px", objectFit: "cover" }} />
                    ) : (
                      <UserIcon size={16} />
                    )}
                    My Account ({currentUser.fullName?.split(' ')[0] || 'Profile'})
                  </NavLink>
                  <button onClick={handleLogout} className="btn btn-outline-light rounded-pill py-2 w-100 d-flex align-items-center justify-content-center gap-1">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <NavLink to="/login" className="btn btn-light text-primary fw-bold rounded-pill py-2 w-100 d-flex align-items-center justify-content-center text-decoration-none shadow-sm">
                  <UserIcon size={16} className="me-1" /> Login / Register
                </NavLink>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Full Edge-to-Edge Container for rendering page views */}
      <div className="w-100 p-0 flex-grow-1">
        <Outlet />
      </div>

      {/* 3. Footer Matching User Design */}
      <Footer />
    </div>
  );
}

export { MainLayout };
