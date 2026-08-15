import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User as UserIcon } from "lucide-react";
import { authService } from "../services/authService";
import { cartService } from "../services/cartService";
import { Footer } from "../components/Footer";
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
        <Container fluid className="px-4">
          <Navbar.Brand href="/" className="fw-bold fs-4 me-4 d-flex align-items-center gap-2">
            <div className="rounded-circle bg-white p-1 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
              <img src="/Image/Logo.png" alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            KP Computer Store
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="mx-auto gap-3">
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

            {/* Right User Actions */}
            <div className="d-flex align-items-center gap-3">
              <NavLink to="/cart" className="position-relative text-white me-2 text-decoration-none">
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
