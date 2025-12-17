import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <FaHome /> RealEstate Pro
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/properties">Properties</Link></li>
          <li><Link to="/brokers">Brokers</Link></li>
          
          {user ? (
            <>
              <li><Link to="/dashboard"><FaUser /> {user.name}</Link></li>
              <li><button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt /> Logout
              </button></li>
            </>
          ) : (
            <>
              <li><Link to="/login"><FaSignInAlt /> Login</Link></li>
              <li><Link to="/register" className="btn-register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;