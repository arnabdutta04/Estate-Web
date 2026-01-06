import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import "./Auth.css";

const Register = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Combine country code with phone number
      const phoneWithCode = countryCode + formData.phone;
      await register({ ...formData, phone: phoneWithCode });
      navigate("/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <button className="auth-close-btn" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="auth-modal-card">
          <h1 className="auth-modal-title">Create Your Account</h1>

          {error && <div className="auth-modal-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="auth-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="auth-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-form-group">
              <label>Phone Number</label>
              <div className="phone-input-wrapper">
                <select 
                  className="country-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+61">AU +61</option>
                  <option value="+86">CN +86</option>
                  <option value="+81">JP +81</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  className="phone-number-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                minLength="6"
                required
              />
            </div>

            <div className="auth-form-group">
              <label>Register as</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="customer">Customer</option>
                <option value="broker">Broker</option>
              </select>
            </div>

            <button type="submit" className="auth-modal-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="auth-modal-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;