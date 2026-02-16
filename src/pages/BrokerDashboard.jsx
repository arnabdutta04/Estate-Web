import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { 
  FaEdit, 
  FaPlus, 
  FaTrash, 
  FaEye, 
  FaChevronRight,
  FaMapMarkerAlt,
  FaHome,
  FaInfoCircle,
  FaPoundSign,
  FaChartLine,
  FaCalendar,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';
import './BrokerDashboard.css';

const BrokerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [brokerProfile, setBrokerProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'company'

  // Calculate portfolio stats
  const portfolioStats = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'active').length,
    soldShares: properties.reduce((sum, p) => sum + (p.soldShares || 0), 0),
    totalShares: properties.reduce((sum, p) => sum + (p.totalShares || 0), 0),
    portfolioCosts: properties.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0),
    soldFor: properties.reduce((sum, p) => sum + (p.soldAmount || 0), 0),
    earnedAmount: 0, // Will calculate based on commission
    requestHistory: 7 // Mock data
  };

  useEffect(() => {
    if (user && user.role === 'broker') {
      fetchBrokerData();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchBrokerData = async () => {
    try {
      setLoading(true);
      
      // Fetch broker profile
      const profileRes = await api.get('/brokers/me');
      setBrokerProfile(profileRes.data.data);

      // Fetch broker's properties
      const propertiesRes = await api.get('/properties/broker/my-properties');
      setProperties(propertiesRes.data.data || []);

    } catch (error) {
      console.error('Error fetching broker data:', error);
      
      if (error.response?.status === 404) {
        // No broker profile, redirect to complete profile
        navigate('/broker/complete-profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${propertyId}`);
        setProperties(properties.filter(p => p._id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Active', class: 'status-active' },
      pending: { text: 'Pending', class: 'status-pending' },
      sold: { text: 'Sold', class: 'status-sold' },
      wpa: { text: 'WPA', class: 'status-wpa' }
    };
    return badges[status?.toLowerCase()] || badges.active;
  };

  const getVerificationBadge = (status) => {
    const badges = {
      verified: { icon: <FaCheckCircle />, text: 'Registered', class: 'verified' },
      pending: { icon: <FaClock />, text: 'Pending', class: 'pending' },
      rejected: { icon: <FaTimesCircle />, text: 'Rejected', class: 'rejected' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-loading">
          <div className="loader-enhanced"></div>
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }

  if (!brokerProfile) {
    return (
      <>
        <Navbar />
        <div className="no-profile-container">
          <h2>Complete Your Agent Profile</h2>
          <p>Set up your profile to start managing properties</p>
          <button 
            className="btn-complete-profile"
            onClick={() => navigate('/broker/complete-profile')}
          >
            Complete Profile
          </button>
        </div>
      </>
    );
  }

  const verificationBadge = getVerificationBadge(brokerProfile.verificationStatus);

  return (
    <>
      <Navbar />
      <div className="broker-dashboard-enhanced">
        <div className="dashboard-header-enhanced">
          <h1>Agent Profile</h1>
          <button className="btn-close" onClick={() => navigate('/properties')}>×</button>
        </div>

        <div className="dashboard-layout">
          {/* Left Section - Stats & Properties */}
          <div className="dashboard-left">
            {/* Portfolio Stats */}
            <div className="stats-row">
              <div className="stat-card-enhanced">
                <div className="stat-icon-circle">
                  <FaHome />
                </div>
                <div className="stat-content">
                  <h3>Active properties</h3>
                  <p className="stat-number">
                    {portfolioStats.activeProperties} properties 
                    <span className="stat-meta">({portfolioStats.soldShares}/{portfolioStats.totalShares} shares)</span>
                  </p>
                  <div className="stat-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(portfolioStats.soldShares / portfolioStats.totalShares * 100) || 0}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">Sold shares: {portfolioStats.soldShares}/{portfolioStats.totalShares}</span>
                  </div>
                </div>
                <FaInfoCircle className="info-icon" />
              </div>

              <div className="stat-card-enhanced">
                <div className="stat-icon-circle">
                  <FaPoundSign />
                </div>
                <div className="stat-content">
                  <h3>Portfolio costs</h3>
                  <p className="stat-number">
                    ₹{portfolioStats.portfolioCosts.toLocaleString()}
                  </p>
                  <div className="stat-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill green" 
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <span className="progress-text">Sold for: ₹{portfolioStats.soldFor.toLocaleString()}</span>
                  </div>
                </div>
                <FaInfoCircle className="info-icon" />
              </div>
            </div>

            {/* Properties List */}
            <div className="properties-section-enhanced">
              <h2 className="section-title-enhanced">
                Property added by agent ({portfolioStats.totalProperties})
              </h2>

              <div className="properties-list-enhanced">
                {properties.length === 0 ? (
                  <div className="empty-properties">
                    <FaHome className="empty-icon" />
                    <h3>No Properties Yet</h3>
                    <p>Start adding properties to your portfolio</p>
                    <button 
                      className="btn-add-first"
                      onClick={() => navigate('/properties/add')}
                    >
                      <FaPlus /> Add Property
                    </button>
                  </div>
                ) : (
                  properties.map((property) => {
                    const statusBadge = getStatusBadge(property.status);
                    return (
                      <div key={property._id} className="property-item-enhanced">
                        <div className="property-image-small">
                          {property.image || (property.images && property.images[0]) ? (
                            <img 
                              src={property.image || property.images[0]} 
                              alt={property.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="property-placeholder-small"
                            style={{ display: (property.image || (property.images && property.images[0])) ? 'none' : 'flex' }}
                          >
                            <FaHome />
                          </div>
                        </div>

                        <div className="property-info-compact">
                          <h4 className="property-price-compact">₹{property.price?.toLocaleString()}</h4>
                          <p className="property-location-compact">
                            <FaMapMarkerAlt /> {property.city || property.location?.city || 'Location'}
                          </p>
                        </div>

                        <span className={`status-badge-compact ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>

                        <button 
                          className="btn-view-arrow"
                          onClick={() => navigate(`/properties/${property._id}`)}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Agent Profile */}
          <div className="dashboard-right">
            {/* Tab Navigation */}
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </button>
              <button 
                className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
                onClick={() => setActiveTab('company')}
              >
                Company
              </button>
            </div>

            {/* Agent Profile Card */}
            <div className="agent-profile-card">
              {/* Profile Image */}
              <div className="agent-image-section">
                {brokerProfile.photo ? (
                  <img 
                    src={brokerProfile.photo} 
                    alt={brokerProfile.userId?.name} 
                    className="agent-avatar-large"
                  />
                ) : (
                  <div className="agent-avatar-placeholder">
                    {brokerProfile.userId?.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Agent Name & Status */}
              <h3 className="agent-name">{brokerProfile.userId?.name || 'Agent Name'}</h3>
              <span className={`verification-badge-inline ${verificationBadge.class}`}>
                {verificationBadge.icon}
                {verificationBadge.text}
              </span>

              {/* Contact Information */}
              <div className="agent-info-list">
                <div className="info-row">
                  <span className="info-label">Phone number:</span>
                  <span className="info-value">
                    <FaPhone /> {brokerProfile.userId?.phone || '+44 113 121 3345'}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">
                    <FaEnvelope /> {brokerProfile.userId?.email || 'agent@example.com'}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Account registered:</span>
                  <span className="info-value">
                    <FaCalendar /> {new Date(brokerProfile.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <div className="info-row clickable">
                  <span className="info-label">Request history:</span>
                  <span className="info-value link">
                    {portfolioStats.requestHistory} requests
                    <FaChevronRight />
                  </span>
                </div>
              </div>

              {/* Earnings Section */}
              <div className="earnings-section">
                <div className="earnings-item">
                  <span className="earnings-label">Percentage of agent:</span>
                  <div className="earnings-value-row">
                    <span className="earnings-value">3%</span>
                    <button className="btn-edit-small">
                      <FaEdit />
                    </button>
                  </div>
                </div>

                <div className="earnings-item">
                  <span className="earnings-label">Earned by agent:</span>
                  <span className="earnings-value-large">₹{portfolioStats.earnedAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Delete Agent Button */}
              <button className="btn-delete-agent">
                <FaTrash /> Delete agent
              </button>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
              <button 
                className="action-btn-full primary"
                onClick={() => navigate('/properties/add')}
              >
                <FaPlus /> Add New Property
              </button>
              <button 
                className="action-btn-full secondary"
                onClick={() => navigate('/broker/edit-profile')}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrokerDashboard;