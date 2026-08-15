import React from 'react';
import { LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  onNavigateToLogin?: () => void;
}

/**
 * PROTECTED ROUTE COMPONENT
 * =========================
 * DEVELOPER NOTE:
 * Restricts checkout & purchase workflows to logged-in users only.
 * If user is not logged in, displays a login prompt card.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  onNavigateToLogin,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center py-4">
          <div className="col-md-6 text-center">
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white">
              <div className="bg-primary-subtle text-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                <LogIn size={40} color="#1877F2" />
              </div>
              <h4 className="fw-bold text-dark mb-2">Login Required to Purchase</h4>
              <p className="text-secondary mb-4">
                Please sign in to your KP Computer Store account to proceed with checkout and complete your order.
              </p>
              {onNavigateToLogin && (
                <button
                  className="btn btn-primary py-3 px-4 rounded-3 fw-bold text-white shadow-sm"
                  style={{ backgroundColor: '#1877F2', borderColor: '#1877F2' }}
                  onClick={onNavigateToLogin}
                >
                  <LogIn size={20} className="me-2" />
                  Log In to Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
