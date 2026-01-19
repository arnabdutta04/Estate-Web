import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCalendar, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data.property);
        setError(null);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.response?.data?.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <PageTransition>
          <div className="property-detail-page">
            <div className="loading-state">
              <div className="loader"></div>
              <h2>Loading property details...</h2>
            </div>
          </div>
        </PageTransition>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Navbar />
        <PageTransition>
          <div className="property-detail-page">
            <div className="error-state">
              <h2>Property not found</h2>
              <p>{error || 'The property you are looking for does not exist.'}</p>
              <button onClick={() => navigate('/properties')} className="btn-primary">
                Back to Properties
              </button>
            </div>
          </div>
        </PageTransition>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="property-detail-page">
          <div className="container">
            {/* Image Gallery */}
            <div className="image-gallery">
              <img 
                src={property.images?.[0] || '/placeholder.jpg'} 
                alt={property.title} 
                className="main-image" 
              />
              {property.images && property.images.length > 1 && (
                <div className="thumbnail-gallery">
                  {property.images.slice(1, 5).map((img, index) => (
                    <img key={index} src={img} alt={`${property.title} ${index + 2}`} />
                  ))}
                </div>
              )}
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
                  <FaMapMarkerAlt /> 
                  {property.location.address}, {property.location.city}, {property.location.state}
                  {property.location.zipCode && ` - ${property.location.zipCode}`}
                </p>

                <div className="price-section">
                  <h2 className="price">
                    ₹{parseFloat(property.price).toLocaleString()}
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
                  {property.yearBuilt && (
                    <div className="spec-item">
                      <FaCalendar />
                      <span>Built {property.yearBuilt}</span>
                    </div>
                  )}
                </div>

                <div className="description">
                  <h3>Description</h3>
                  <p>{property.description}</p>
                </div>

                <div className="property-info">
                  <h3>Property Information</h3>
                  <div className="info-grid">
                    <div><strong>Type:</strong> {property.propertyType}</div>
                    {property.age && <div><strong>Age:</strong> {property.age} years</div>}
                    <div><strong>Condition:</strong> {property.condition}</div>
                    <div><strong>Furnished:</strong> {property.specifications.furnished ? 'Yes' : 'No'}</div>
                    {property.style && <div><strong>Style:</strong> {property.style}</div>}
                  </div>
                </div>

                {/* Facilities */}
                {property.facilities && (
                  <div className="features">
                    <h3>Features & Amenities</h3>
                    <ul className="facilities-list">
                      {property.facilities.furnished && <li>✓ Furnished</li>}
                      {property.facilities.petAllowed && <li>✓ Pet Friendly</li>}
                      {property.facilities.parkingSlot && <li>✓ Parking Available</li>}
                      {property.facilities.kitchen && <li>✓ Modern Kitchen</li>}
                      {property.facilities.wifi && <li>✓ WiFi Included</li>}
                      {property.facilities.ac && <li>✓ Air Conditioning</li>}
                      {property.facilities.swimmingPool && <li>✓ Swimming Pool</li>}
                      {property.facilities.gym && <li>✓ Gym/Fitness Center</li>}
                      {property.facilities.security && <li>✓ 24/7 Security</li>}
                    </ul>
                  </div>
                )}
              </div>

              {/* Broker Contact Card */}
              <div className="broker-contact-card">
                <h3>Contact {property.ownerType === 'broker' ? 'Broker' : 'Owner'}</h3>
                
                {property.broker ? (
                  <div className="broker-info">
                    <h4>{property.broker.userId?.name || 'Property Owner'}</h4>
                    {property.broker.company && (
                      <p className="company">{property.broker.company}</p>
                    )}
                    
                    {property.broker.rating > 0 && (
                      <div className="rating">
                        <FaStar color="#ffc107" /> 
                        <span>{parseFloat(property.broker.rating).toFixed(1)}</span>
                        {property.broker.totalReviews > 0 && (
                          <span className="reviews-count">
                            ({property.broker.totalReviews} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {property.broker.experience > 0 && (
                      <p className="experience">
                        {property.broker.experience} years of experience
                      </p>
                    )}

                    <div className="contact-details">
                      {property.broker.userId?.phone && (
                        <a 
                          href={`tel:${property.broker.userId.phone}`} 
                          className="contact-btn"
                        >
                          <FaPhone /> {property.broker.userId.phone}
                        </a>
                      )}
                      {property.broker.userId?.email && (
                        <a 
                          href={`mailto:${property.broker.userId.email}`} 
                          className="contact-btn"
                        >
                          <FaEnvelope /> {property.broker.userId.email}
                        </a>
                      )}
                    </div>

                    <button className="btn-primary">Schedule Visit</button>
                    <button className="btn-secondary">Send Message</button>
                  </div>
                ) : property.owner ? (
                  <div className="broker-info">
                    <h4>{property.owner.name || 'Property Owner'}</h4>
                    
                    <div className="contact-details">
                      {property.owner.phone && (
                        <a 
                          href={`tel:${property.owner.phone}`} 
                          className="contact-btn"
                        >
                          <FaPhone /> {property.owner.phone}
                        </a>
                      )}
                      {property.owner.email && (
                        <a 
                          href={`mailto:${property.owner.email}`} 
                          className="contact-btn"
                        >
                          <FaEnvelope /> {property.owner.email}
                        </a>
                      )}
                    </div>

                    <button className="btn-primary">Schedule Visit</button>
                    <button className="btn-secondary">Send Message</button>
                  </div>
                ) : (
                  <div className="broker-info">
                    <p>Contact information not available</p>
                    <button 
                      className="btn-primary" 
                      onClick={() => navigate('/contact')}
                    >
                      Contact Us
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default PropertyDetail;