import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaHome, FaPlus, FaEdit, FaTrash, FaEye, FaCheckCircle, FaClock, FaTimesCircle, FaChartLine } from 'react-icons/fa';


const BrokerDashboard = () => {
  const navigate = useNavigate();
  const [broker, setBroker] = useState(null);
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalViews: 0,
    inquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrokerData();
  }, []);

  const fetchBrokerData = async () => {
    try {
      const { data: brokerData } = await api.get('/brokers/me');
      setBroker(brokerData);

      const { data: propertiesData } = await api.get('/brokers/my-properties');
      setProperties(propertiesData);

      // Calculate stats
      setStats({
        totalProperties: propertiesData.length,
        activeListings: propertiesData.filter(p => p.status === 'active').length,
        totalViews: propertiesData.reduce((sum, p) => sum + (p.views || 0), 0),
        inquiries: propertiesData.reduce((sum, p) => sum + (p.inquiries || 0), 0)
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching broker data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
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

  const getVerificationStatusBadge = () => {
    if (!broker) return null;

    switch (broker.verificationStatus) {
      case 'verified':
        return (
          <div className="verification-badge verified">
            <FaCheckCircle /> Verified Broker
          </div>
        );
      case 'pending':
        return (
          <div className="verification-badge pending">
            <FaClock /> Verification Pending
          </div>
        );
      case 'rejected':
        return (
          <div className="verification-badge rejected">
            <FaTimesCircle /> Verification Rejected
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!broker) {
    return (
      <div className="broker-dashboard-page">
        <div className="container">
          <div className="no-broker-profile">
            <h2>No Broker Profile Found</h2>
            <p>You need to register as a broker first.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              Register as Broker
            </button>
          </div>
        </div>
      </div>
    );
  }
  {isSubmitting && (
       <LoadingSpinner 
         text="Processing Registration"
         subtext="Please wait..."
         overlay={true}
       />
     )}
  return (
    <div className="broker-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Broker Dashboard</h1>
            <p>Welcome back, {broker.userId?.name}!</p>
          </div>
          {getVerificationStatusBadge()}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)' }}>
              <FaHome />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProperties}</h3>
              <p>Total Properties</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.activeListings}</h3>
              <p>Active Listings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
              <FaEye />
            </div>
            <div className="stat-info">
              <h3>{stats.totalViews}</h3>
              <p>Total Views</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9b59b6, #8e44ad)' }}>
              <FaChartLine />
            </div>
            <div className="stat-info">
              <h3>{stats.inquiries}</h3>
              <p>Inquiries</p>
            </div>
          </div>
        </div>

        {/* Broker Profile Summary */}
        <div className="profile-summary">
          <h2>Your Profile</h2>
          <div className="profile-details">
            <div className="profile-item">
              <strong>Company:</strong> {broker.company}
            </div>
            <div className="profile-item">
              <strong>License Number:</strong> {broker.licenseNumber}
            </div>
            <div className="profile-item">
              <strong>Experience:</strong> {broker.yearsOfExperience}
            </div>
            <div className="profile-item">
              <strong>Specialization:</strong> {broker.specialization?.join(', ')}
            </div>
            <div className="profile-item">
              <strong>Serving Areas:</strong> {broker.servingCities}
            </div>
            <div className="profile-item">
              <strong>Property Types:</strong> {broker.propertyTypes?.join(', ')}
            </div>
          </div>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/broker/edit-profile')}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        {/* Properties Section */}
        <div className="properties-section">
          <div className="section-header">
            <h2>Your Properties</h2>
            <button 
              className="btn-primary"
              onClick={() => navigate('/broker/add-property')}
            >
              <FaPlus /> Add New Property
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="no-properties">
              <p>You haven't added any properties yet.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/broker/add-property')}
              >
                Add Your First Property
              </button>
            </div>
          ) : (
            <div className="properties-table-container">
              <table className="properties-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(property => (
                    <tr key={property._id}>
                      <td>
                        <div className="property-cell">
                          <img 
                            src={property.images?.[0] || '/placeholder.jpg'} 
                            alt={property.title}
                            className="property-thumb"
                          />
                          <div>
                            <div className="property-title">{property.title}</div>
                            <div className="property-location">
                              {property.location?.city}, {property.location?.state}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${property.listingType}`}>
                          {property.listingType}
                        </span>
                      </td>
                      <td>₹{property.price?.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${property.status || 'active'}`}>
                          {property.status || 'active'}
                        </span>
                      </td>
                      <td>{property.views || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => navigate(`/properties/${property._id}`)}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="action-btn edit"
                            onClick={() => navigate(`/broker/edit-property/${property._id}`)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteProperty(property._id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokerRegistration;