import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCalendar, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div className="loading">Loading property details...</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <div className="property-detail-page">
      <div className="container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <img src={property.images[0] || '/placeholder.jpg'} alt={property.title} className="main-image" />
        </div>

        <div className="property-details-layout">
          {/* Main Details */}
          <div className="main-details">
            <div className="header">
              <h1>{property.title}</h1>
              <span className={`badge ${property.listingType}`}>
                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
            </div>

            <p className="location">
              <FaMapMarkerAlt /> {property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}
            </p>

            <div className="price-section">
              <h2 className="price">
                ₹{property.price.toLocaleString()}
                {property.listingType === 'rent' && <span>/month</span>}
              </h2>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <FaBed />
                <span>{property.specifications.bedrooms} Bedrooms</span>
              </div>
              <div className="spec-item">
                <FaBath />
                <span>{property.specifications.bathrooms} Bathrooms</span>
              </div>
              <div className="spec-item">
                <FaRuler />
                <span>{property.specifications.area} sqft</span>
              </div>
              <div className="spec-item">
                <FaCalendar />
                <span>Built {property.yearBuilt}</span>
              </div>
            </div>

            <div className="description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>

            <div className="property-info">
              <h3>Property Information</h3>
              <div className="info-grid">
                <div><strong>Type:</strong> {property.propertyType}</div>
                <div><strong>Age:</strong> {property.age} years</div>
                <div><strong>Condition:</strong> {property.condition}</div>
                <div><strong>Furnished:</strong> {property.specifications.furnished}</div>
                <div><strong>Floors:</strong> {property.specifications.floors || 'N/A'}</div>
              </div>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="features">
                <h3>Features & Amenities</h3>
                <ul>
                  {property.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Broker Contact Card */}
          <div className="broker-contact-card">
            <h3>Contact Broker</h3>
            {property.broker && (
              <div className="broker-info">
                <h4>{property.broker.userId?.name}</h4>
                <p className="company">{property.broker.company}</p>
                
                <div className="rating">
                  <FaStar color="#ffc107" /> 
                  <span>{property.broker.rating.toFixed(1)}</span>
                </div>

                <div className="contact-details">
                  <a href={`tel:${property.broker.userId?.phone}`} className="contact-btn">
                    <FaPhone /> {property.broker.userId?.phone}
                  </a>
                  <a href={`mailto:${property.broker.userId?.email}`} className="contact-btn">
                    <FaEnvelope /> {property.broker.userId?.email}
                  </a>
                </div>

                <button className="btn-primary">Schedule Visit</button>
                <button className="btn-secondary">Send Message</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;