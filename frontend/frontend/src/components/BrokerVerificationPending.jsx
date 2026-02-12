import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaEnvelope, FaPhone, FaSignOutAlt } from 'react-icons/fa';
import api from '../utils/api';
import './BrokerVerificationPending.css';

const BrokerVerificationPending = () => {
  const navigate = useNavigate();
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkVerificationStatus();
    // Poll every 30 seconds to check for status updates
    const interval = setInterval(checkVerificationStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const { data } = await api.get('/brokers/me');
      setBroker(data);
      
      // If verified, redirect to dashboard
      if (data.verificationStatus === 'verified') {
        navigate('/broker/dashboard');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking verification status:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getStatusIcon = () => {
    if (!broker) return null;
    
    switch (broker.verificationStatus) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'verified':
        return <FaCheckCircle className="status-icon verified" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (!broker) return '';
    
    switch (broker.verificationStatus) {
      case 'pending':
        return 'Your broker account is currently under verification';
      case 'rejected':
        return 'Your verification request has been rejected';
      default:
        return 'Verification status unknown';
    }
  };

  if (loading) {
    return (
      <div className="verification-pending-page">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Checking verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-pending-page">
      <div className="verification-container">
        <div className="verification-card">
          {getStatusIcon()}
          
          <h1>{getStatusMessage()}</h1>
          
          {broker?.verificationStatus === 'pending' && (
            <>
              <p className="verification-description">
                Our admin team is currently reviewing your broker profile and verification documents. 
                This process typically takes 24-48 hours.
              </p>
              
              <div className="verification-steps">
                <div className="step completed">
                  <FaCheckCircle className="step-icon" />
                  <div className="step-content">
                    <h3>Registration Complete</h3>
                    <p>You've successfully registered as a broker</p>
                  </div>
                </div>
                
                <div className="step active">
                  <FaClock className="step-icon" />
                  <div className="step-content">
                    <h3>Under Review</h3>
                    <p>Admin is verifying your documents</p>
                  </div>
                </div>
                
                <div className="step">
                  <FaCheckCircle className="step-icon" />
                  <div className="step-content">
                    <h3>Verification Complete</h3>
                    <p>You'll get access to your dashboard</p>
                  </div>
                </div>
              </div>
              
              <div className="info-box">
                <h4>What happens next?</h4>
                <ul>
                  <li>Admin will review your submitted documents</li>
                  <li>You'll receive an email notification once verified</li>
                  <li>After approval, you can access your broker dashboard</li>
                  <li>Start listing properties and manage your business</li>
                </ul>
              </div>
            </>
          )}
          
          {broker?.verificationStatus === 'rejected' && (
            <>
              <div className="rejection-info">
                <h3>Rejection Reason:</h3>
                <p>{broker.rejectionReason || 'No specific reason provided'}</p>
              </div>
              
              <div className="rejection-actions">
                <button 
                  className="btn-resubmit"
                  onClick={() => navigate('/broker/edit-profile')}
                >
                  Update Profile & Resubmit
                </button>
              </div>
            </>
          )}
          
          <div className="contact-support">
            <h4>Need Help?</h4>
            <div className="contact-options">
              <a href="mailto:support@realestate.com" className="contact-link">
                <FaEnvelope /> support@realestate.com
              </a>
              <a href="tel:+911234567890" className="contact-link">
                <FaPhone /> +91 123 456 7890
              </a>
            </div>
          </div>
          
          <button className="btn-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrokerVerificationPending;