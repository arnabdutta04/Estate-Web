import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaStar, 
  FaPhone, 
  FaEnvelope,
  FaCheckCircle,
  FaBuilding,
  FaAward,
  FaHome,
  FaArrowLeft
} from 'react-icons/fa';
import './BrokerDetail.css';

const BrokerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrokerDetails();
  }, [id]);

  const fetchBrokerDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/brokers/${id}`);
      setBroker(data.data || data);
    } catch (error) {
      console.error('Error fetching broker details:', error);
      setError('Failed to load broker details');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="broker-detail-loading">
          <div className="loader"></div>
          <p>Loading broker details...</p>
        </div>
      </>
    );
  }

  if (error || !broker) {
    return (
      <>
        <Navbar />
        <div className="broker-detail-error">
          <h2>Broker Not Found</h2>
          <p>{error || 'This broker does not exist or has been removed.'}</p>
          <button onClick={() => navigate('/brokers')} className="btn-back">
            <FaArrowLeft /> Back to Brokers
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="broker-detail-container">
        {/* Back Button */}
        <button className="btn-back-detail" onClick={() => navigate('/brokers')}>
          <FaArrowLeft /> Back to Brokers
        </button>

        {/* Broker Header */}
        <div className="broker-header-card">
          <div className="broker-image-large">
            {broker.photo ? (
              <img src={broker.photo} alt={broker.userId?.name} />
            ) : (
              <div className="broker-placeholder-large">
                {broker.userId?.name?.charAt(0)}
              </div>
            )}
            {broker.verificationStatus === 'verified' && (
              <div className="verified-badge-large">
                <FaCheckCircle /> Verified
              </div>
            )}
          </div>

          <div className="broker-header-info">
            <h1>{broker.userId?.name}</h1>
            <p className="broker-title-large">
              {broker.specialization?.[0] || 'Real Estate Broker'}
            </p>
            
            <div className="broker-meta">
              {broker.company && (
                <div className="meta-item">
                  <FaBuilding />
                  <span>{broker.company}</span>
                </div>
              )}
              {broker.servingCities && (
                <div className="meta-item">
                  <FaMapMarkerAlt />
                  <span>{broker.servingCities}</span>
                </div>
              )}
              {broker.yearsOfExperience && (
                <div className="meta-item">
                  <FaBriefcase />
                  <span>{broker.yearsOfExperience} years experience</span>
                </div>
              )}
            </div>

            <div className="broker-actions-large">
              <button className="btn-contact-primary">
                <FaPhone /> Call Now
              </button>
              <button className="btn-contact-secondary" onClick={handleMessage}>
                <FaEnvelope /> Send Message
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        {broker.about && (
          <div className="broker-section-card">
            <h2>About</h2>
            <p className="broker-about-text">{broker.about}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="broker-details-grid">
          {/* Contact Information */}
          <div className="detail-card">
            <h3>Contact Information</h3>
            <div className="detail-items">
              {broker.userId?.email && (
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{broker.userId.email}</span>
                  </div>
                </div>
              )}
              {broker.userId?.phone && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div>
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{broker.userId.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Details */}
          <div className="detail-card">
            <h3>Professional Details</h3>
            <div className="detail-items">
              {broker.licenseNumber && (
                <div className="detail-item">
                  <FaAward className="detail-icon" />
                  <div>
                    <span className="detail-label">License Number</span>
                    <span className="detail-value">{broker.licenseNumber}</span>
                  </div>
                </div>
              )}
              {broker.specialization && broker.specialization.length > 0 && (
                <div className="detail-item">
                  <FaHome className="detail-icon" />
                  <div>
                    <span className="detail-label">Specialization</span>
                    <span className="detail-value">{broker.specialization.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Languages */}
        {broker.languages && broker.languages.length > 0 && (
          <div className="broker-section-card">
            <h2>Languages Spoken</h2>
            <div className="languages-grid">
              {broker.languages.map((lang, index) => (
                <span key={index} className="language-badge">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Property Types */}
        {broker.propertyTypes && broker.propertyTypes.length > 0 && (
          <div className="broker-section-card">
            <h2>Property Types Handled</h2>
            <div className="property-types-grid">
              {broker.propertyTypes.map((type, index) => (
                <span key={index} className="property-type-badge">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BrokerDetail;