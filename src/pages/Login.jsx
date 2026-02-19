import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTimes, FaUser, FaLock, FaExclamationTriangle, FaClock, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import "./Auth.css";

const Login = ({ onClose, onSuccess, onSwitchToRegister }) => {  // ← ONLY CHANGE: added props
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setWarning("");
    setVerificationStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWarning("");
    setVerificationStatus(null);
    setLoading(true);

    try {
      const response = await login(formData);
      const userData = response?.data?.user || response?.user;
      const role = userData?.role;
      
      if (role === "admin") {
        if (onClose) onClose();  // ← ONLY CHANGE: close modal before navigating
        navigate("/admin/dashboard");
        return;
      }

      if (role === "broker") {
        const brokerStatus = userData?.brokerProfile?.verificationStatus || userData?.verificationStatus;
        switch (brokerStatus) {
          case "verified":
            if (onClose) onClose();  // ← ONLY CHANGE
            navigate("/broker/dashboard");
            break;
          case "pending":
            setVerificationStatus({
              type: "pending",
              message: "Your broker account is under verification. Please wait for admin approval.",
              icon: <FaClock />
            });
            setLoading(false);
            setTimeout(() => {
              if (onClose) onClose();  // ← ONLY CHANGE
              navigate("/broker/verification-pending");
            }, 3000);
            return;
          case "rejected":
            const rejectionReason = userData?.brokerProfile?.rejectionReason || "Your verification was rejected.";
            setVerificationStatus({
              type: "rejected",
              message: `Verification Rejected: ${rejectionReason}`,
              icon: <FaExclamationTriangle />
            });
            setLoading(false);
            return;
          default:
            setWarning("Please complete your broker registration first.");
            setTimeout(() => {
              if (onClose) onClose();  // ← ONLY CHANGE
              navigate("/broker/register");
            }, 2000);
            return;
        }
      }

      if (role === "customer") {
        if (onSuccess) { onSuccess(); } else { navigate("/properties"); }  // ← ONLY CHANGE
      } else {
        if (onSuccess) { onSuccess(); } else { navigate("/properties"); }  // ← ONLY CHANGE
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) { onClose(); } else { navigate("/"); }  // ← ONLY CHANGE
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <button className="auth-close-btn" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="auth-modal-card">
          <h1 className="auth-modal-title">USER LOGIN</h1>
          
          <div className="login-type-badges">
            <span className="login-badge customer"><FaUser /> Customer</span>
            <span className="login-badge broker"><FaCheckCircle /> Broker</span>
            <span className="login-badge admin"><FaShieldAlt /> Admin</span>
          </div>

          {error && (
            <div className="auth-modal-error">
              <FaExclamationTriangle /> {error}
            </div>
          )}

          {warning && (
            <div className="auth-modal-warning">
              <FaClock /> {warning}
            </div>
          )}

          {verificationStatus && (
            <div className={`verification-alert ${verificationStatus.type}`}>
              <div className="verification-alert-icon">{verificationStatus.icon}</div>
              <div className="verification-alert-content">
                <h3>
                  {verificationStatus.type === "pending" ? "Verification Pending" : "Verification Rejected"}
                </h3>
                <p>{verificationStatus.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="auth-form-group">
              <div className="auth-input-container">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  disabled={loading}
                />
                <div className="auth-input-icon"><FaUser /></div>
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-input-container">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  disabled={loading}
                />
                <div className="auth-input-icon"><FaLock /></div>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-modal-submit" 
              disabled={loading || verificationStatus?.type === "rejected"}
            >
              {loading ? (<><span className="spinner"></span>LOGGING IN...</>) : ("LOGIN")}
            </button>
          </form>

          <div className="auth-modal-links">
            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
          </div>

          <p className="auth-modal-footer">
            Don't have an account?{" "}
            {/* ← ONLY CHANGE: switch to register modal if prop exists */}
            {onSwitchToRegister
              ? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>Register here</a>
              : <Link to="/register">Register here</Link>
            }
          </p>

          <div className="auth-info-box">
            <p><strong>Note:</strong> Brokers must be verified by admin before accessing the dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;