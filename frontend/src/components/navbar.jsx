// src/components/navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-down animation on mount
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.username || user.email?.split('@')[0] || 'User';
  };

  return (
    <nav className={`navbar ${isVisible ? 'navbar-visible' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src="/logo-3d.png" alt="Propify Logo" className="navbar-logo-img" />
            <span className="logo-text">Propify</span>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className="navbar-link" 
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/properties" 
            className="navbar-link" 
            onClick={() => setIsMenuOpen(false)}
          >
            Properties
          </Link>
          <Link 
            to="/brokers" 
            className="navbar-link" 
            onClick={() => setIsMenuOpen(false)}
          >
            Brokers
          </Link>
          
          {/* User Profile */}
          {user && (
            <div className="navbar-user">
              <span className="user-icon">👤</span>
              <span className="user-name">{getUserDisplayName()}</span>
            </div>
          )}

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;