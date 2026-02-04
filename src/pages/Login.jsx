import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTimes, FaUser, FaLock, FaExclamationTriangle, FaClock, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
      
      // Extract user data from response
      const userData = response?.data?.user || response?.user;
      const role = userData?.role;
      
      // Admin Login - Direct access
      if (role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      // Broker Login - Check verification status
      if (role === "broker") {
        const brokerStatus = userData?.brokerProfile?.verificationStatus || userData?.verificationStatus;
        
        switch (brokerStatus) {
          case "verified":
            // Verified broker - allow access
            navigate("/broker/dashboard");
            break;
            
          case "pending":
            // Pending verification - show warning
            setVerificationStatus({
              type: "pending",
              message: "Your broker account is under verification. Please wait for admin approval.",
              icon: <FaClock />
            });
            setLoading(false);
            // Optionally redirect to a waiting page
            setTimeout(() => {
              navigate("/broker/verification-pending");
            }, 3000);
            return;
            
          case "rejected":
            // Rejected - show error with reason
            const rejectionReason = userData?.brokerProfile?.rejectionReason || "Your verification was rejected.";
            setVerificationStatus({
              type: "rejected",
              message: `Verification Rejected: ${rejectionReason}`,
              icon: <FaExclamationTriangle />
            });
            setLoading(false);
            return;
            
          default:
            // No broker profile found
            setWarning("Please complete your broker registration first.");
            setTimeout(() => {
              navigate("/broker/register");
            }, 2000);
            return;
        }
      }

      // Customer Login - Normal flow
      if (role === "customer") {
        navigate("/properties");
      } else {
        // Fallback for any other role
        navigate("/properties");
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
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
          <h1 className="auth-modal-title">USER LOGIN</h1>
          
          <div className="login-type-badges">
            <span className="login-badge customer">
              <FaUser /> Customer
            </span>
            <span className="login-badge broker">
              <FaCheckCircle /> Broker
            </span>
            <span className="login-badge admin">
              <FaShieldAlt /> Admin
            </span>
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
              <div className="verification-alert-icon">
                {verificationStatus.icon}
              </div>
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
                <div className="auth-input-icon">
                  <FaUser />
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
                  placeholder="Password"
                  required
                  disabled={loading}
                />
                <div className="auth-input-icon">
                  <FaLock />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-modal-submit" 
              disabled={loading || verificationStatus?.type === "rejected"}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  LOGGING IN...
                </>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          <div className="auth-modal-links">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <p className="auth-modal-footer">
            Don't have an account? <Link to="/register">Register here</Link>
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