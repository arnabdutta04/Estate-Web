import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
      await login(formData);
      navigate("/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
          <h1 className="auth-modal-title">Login to Your Account</h1>

          {error && <div className="auth-modal-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-modal-form">
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
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="auth-modal-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-modal-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;