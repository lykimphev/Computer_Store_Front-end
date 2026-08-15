import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { User } from '../model';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess?: (user: User) => void;
  onNavigateToRegister?: () => void;
  onBackToHome?: () => void;
}

/**
 * LOGIN PAGE COMPONENT (With Eye Password Toggle)
 */
export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onBackToHome,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.login(email, password);
      const user = res.data;
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/');
    } catch {
      setErrorMsg('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBackToHome) onBackToHome();
    else navigate('/');
  };

  const handleGoRegister = () => {
    if (onNavigateToRegister) onNavigateToRegister();
    else navigate('/register');
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5 px-3">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden w-100" style={{ maxWidth: '440px' }}>
        {/* Card Header */}
        <div className="bg-primary text-white p-4 text-center position-relative" style={{ backgroundColor: '#1877F2' }}>
          <button
            onClick={handleBack}
            className="btn btn-sm btn-light rounded-circle position-absolute top-0 start-0 m-3 d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px' }}
            title="Back to Home"
          >
            <ArrowLeft size={18} color="#1877F2" />
          </button>
          <div className="mx-auto rounded-circle bg-white shadow-sm p-1 mb-2 d-inline-block" style={{ width: '60px', height: '60px' }}>
            <img src="/Image/Logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <h4 className="fw-bold mb-1">Welcome Back!</h4>
          <p className="small opacity-75 mb-0">Log in to KP Computer Store</p>
        </div>

        {/* Card Body */}
        <div className="card-body p-4">
          {errorMsg && <div className="alert alert-danger py-2 small rounded-3 mb-3">{errorMsg}</div>}

          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted"><Mail size={18} /></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted"><Lock size={18} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary bg-white text-muted border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberCheck"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label small text-secondary" htmlFor="rememberCheck">Remember me</label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: '#1877F2' }}
              disabled={loading}
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <LogIn size={18} /> Log In
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-2 border-top">
            <span className="small text-muted me-1">Don't have an account?</span>
            <button onClick={handleGoRegister} className="btn btn-link p-0 small fw-bold text-decoration-none">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
