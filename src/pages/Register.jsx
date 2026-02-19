import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTimes, FaUser, FaEnvelope, FaPhone, FaLock,
  FaUserTag, FaInfoCircle, FaCheckCircle
} from "react-icons/fa";
import "./Auth.css";

// ✅ Accepts optional props when used as modal overlay
// When used as standalone page, all props are undefined and it works as before
const Register = ({ onClose, onSuccess, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBrokerInfo, setShowBrokerInfo] = useState(false);

  // Are we running inside a modal or as a standalone page?
  const isModal = !!onClose;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "role") {
      setShowBrokerInfo(value === "broker");
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const phoneWithCode = countryCode + formData.phone;
      await register({ ...formData, phone: phoneWithCode });

      if (formData.role === "broker") {
        alert("Registration successful! Please complete your broker profile for verification.");
        if (isModal) { onClose(); }
        navigate("/broker/complete-profile");
      } else if (formData.role === "admin") {
        alert("Admin registration successful!");
        if (isModal) { onClose(); }
        navigate("/admin/dashboard");
      } else {
        // Customer success
        if (isModal) {
          onSuccess?.(); // close modal
        } else {
          alert("Registration successful! Welcome to our platform.");
          navigate("/properties");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close handler: modal -> call onClose, standalone page -> navigate("/")
  const handleClose = () => {
    if (isModal) {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className={isModal ? "" : "auth-modal-overlay"}>
      <div className={isModal ? "" : "auth-modal-container"}>
        <button className="auth-close-btn" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="auth-modal-card register-card">
          <h1 className="auth-modal-title">USER REGISTRATION</h1>

          {error && (
            <div className="auth-modal-error">
              <FaInfoCircle /> {error}
            </div>
          )}

          {showBrokerInfo && (
            <div className="broker-info-alert">
              <FaInfoCircle className="info-icon" />
              <div className="info-content">
                <h4>Broker Registration Process</h4>
                <ul>
                  <li><FaCheckCircle /> Complete basic registration</li>
                  <li><FaCheckCircle /> Fill broker profile details</li>
                  <li><FaCheckCircle /> Upload verification documents</li>
                  <li><FaCheckCircle /> Wait for admin approval</li>
                </ul>
                <p className="info-note">Note: You'll need to complete your broker profile after registration.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="auth-form-group">
              <div className="auth-input-container">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  disabled={loading}
                />
                <div className="auth-input-icon"><FaUser /></div>
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-input-container">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  disabled={loading}
                />
                <div className="auth-input-icon"><FaEnvelope /></div>
              </div>
            </div>

            <div className="auth-form-group">
              <div className="phone-input-wrapper">
                <select
                  className="country-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={loading}
                >
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+61">AU +61</option>
                  <option value="+86">CN +86</option>
                  <option value="+81">JP +81</option>
                </select>
                <div className="auth-input-container" style={{ flex: 1 }}>
                  <input
                    type="tel"
                    name="phone"
                    className="phone-number-input"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-input-container">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (min 6 characters)"
                  minLength="6"
                  required
                  disabled={loading}
                />
                <div className="auth-input-icon"><FaLock /></div>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="role-select-label">Select Account Type</label>
              <div className="role-selection-cards">
                <div
                  className={`role-card ${formData.role === 'customer' ? 'active' : ''}`}
                  onClick={() => !loading && handleChange({ target: { name: 'role', value: 'customer' } })}
                >
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === 'customer'}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div className="role-card-content">
                    <FaUser className="role-icon" />
                    <h4>Customer</h4>
                    <p>Browse and inquire properties</p>
                  </div>
                </div>

                <div
                  className={`role-card ${formData.role === 'broker' ? 'active' : ''}`}
                  onClick={() => !loading && handleChange({ target: { name: 'role', value: 'broker' } })}
                >
                  <input
                    type="radio"
                    name="role"
                    value="broker"
                    checked={formData.role === 'broker'}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div className="role-card-content">
                    <FaUserTag className="role-icon" />
                    <h4>Broker</h4>
                    <p>List and manage properties</p>
                    <span className="verification-badge-small">Requires Verification</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-modal-submit"
              disabled={loading}
            >
              {loading ? <><span className="spinner"></span>CREATING ACCOUNT...</> : "REGISTER"}
            </button>
          </form>

          <p className="auth-modal-footer">
            Already have an account?{" "}
            {/* ✅ In modal mode: switch to login modal. In page mode: navigate */}
            {isModal ? (
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin?.(); }}>
                Login here
              </a>
            ) : (
              <Link to="/login">Login here</Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;