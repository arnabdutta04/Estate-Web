import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = ({ switchToRegister }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const user = await login(formData);
     navigate("/"); 
    if (user.role === "CUSTOMER") {
      navigate("/home");
    } else if (user.role === "PENDING_BROKER") {
      navigate("/broker/onboarding");
    } else if (user.role === "BROKER") {
      navigate("/broker/dashboard");
    } else {
      navigate("/"); // fallback safety
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="auth-container">
      <h2>Login to Your Account</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* ✅ SWITCH TO REGISTER (NO ROUTE CHANGE) */}
      <p className="auth-link">
        Don’t have an account?{" "}
        <span
          onClick={switchToRegister}
          style={{ color: "#0f3d2e", fontWeight: 600, cursor: "pointer" }}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
