import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { PCBuilderPage } from "../pages/PCBuilderPage";
import { ProfilePage } from "../pages/ProfilePage";
import { OrderSuccessPage } from "../pages/OrderSuccessPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

/**
 * APPLICATION ROUTES COMPONENT
 * ============================
 * Standard clean React Router definitions matching Backend API endpoints.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/pc-builder" element={<PCBuilderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
