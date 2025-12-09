import React, { useState } from 'react';
import Background from './Background';
import '../css/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";


function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Login successful:', response.data);
      if (response.data.token) {
        // Persist token (adjust storage strategy as needed)
        localStorage.setItem('fitmate_token', response.data.token);
      }
      navigate('/dashboard');
      // Show success overlay briefly
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // You can access user info with result.user
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      alert(error.message || "Google login failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Background>
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
          </div>

          {/* Google Login Button */}
          <button 
            onClick={handleGoogleLogin}
            className="google-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Log in with Google
          </button>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          {/* Login Inputs */}
          <div className="input-container">
            <div className="input-group">
              <div className="input-icon">✉</div>
              <input
                type="email"
                name="email"
                placeholder="Phone number / email address"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="login-input"
                required
              />
            </div>

            <div className="input-group">
              <div className="password-container">
                <div className="input-icon">🔒</div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="login-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="login-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !formData.email || !formData.password}
              className={`login-button ${isLoading ? 'loading' : ''} ${(!formData.email || !formData.password) ? 'disabled' : ''}`}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Log In</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              By signing up or logging in, you consent to Fitmate's{' '}
              <a href="#" className="signup-link">Terms of Use</a> and{' '}
              <a href="#" className="signup-link">Privacy Policy</a>
            </p>
            <p className="footer-text" style={{marginTop: '15px'}}>
              Don't have an account?{' '}
              <a href="#" className="signup-link" onClick={() => navigate('/signup')}>Sign up</a>
            </p>
          </div>

          {/* Success Animation Overlay */}
          <div className={`success-overlay ${showSuccess ? 'show' : ''}`}>
            ✓
          </div>
        </div>

        {/* Floating animation elements */}
        <div className="floating-element-1"></div>
        <div className="floating-element-2"></div>
        <div className="floating-element-3"></div>
        <div className="floating-element-4"></div>
      </div>
    </Background>
  );
}

export default Login;