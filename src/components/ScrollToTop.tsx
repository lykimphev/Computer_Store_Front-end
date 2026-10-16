import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * AUTOMATIC SCROLL TO TOP COMPONENT
 * =================================
 * Automatically scrolls window to top (0, 0) whenever the route/page changes.
 * Ensures that when customers click "Buy Now" or "Shopping Cart", the page
 * opens at the top displaying the product items instead of scrolling down.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
