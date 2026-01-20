import React from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/property/${property._id}`);
  };

  // Helper function to safely get nested values
  const getPropertyValue = (primaryPath, fallbackPath, defaultValue) => {
    return primaryPath || fallbackPath || defaultValue;
  };

  return (
    <div className='property-card-modern'>
      <div className='property-image-container'>
        <img 
          src={
            property.image || 
            property.images?.[0] || 
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
          } 
          alt={property.title || 'Property'}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';
          }}
        />
        <h3 className='property-title-overlay'>
          {property.title || 'Property Listing'}
        </h3>
        
        <div className='property-info-card'>
          <h4 className='property-info-title'>
            {property.type || property.propertyType || 'Luminous Urban Abode'}
          </h4>
          <p className='property-info-description'>
            {property.description 
              ? property.description.substring(0, 120) + (property.description.length > 120 ? '...' : '')
              : 'A peaceful escape with sweeping views of the bustling city'}
          </p>
          
          <div className='property-stats'>
            <div className='property-stat-item'>
              <span className='property-stat-value'>
                {property.area || property.specifications?.area || '645'}
                <span className='property-stat-unit'>sq.m.</span>
              </span>
              <span className='property-stat-label'>Total area</span>
            </div>
            <div className='property-stat-item'>
              <span className='property-stat-value'>
                {property.bedrooms || property.specifications?.bedrooms || '2'}-
                {property.bathrooms || property.specifications?.bathrooms || '2'}
              </span>
              <span className='property-stat-label'>Room</span>
            </div>
            <div className='property-stat-item'>
              <span className='property-stat-value'>
                {property.yearBuilt || new Date().getFullYear()}
              </span>
              <span className='property-stat-label'>Year</span>
            </div>
          </div>
          
          <button className='learn-more-btn' onClick={handleLearnMore}>
            <span>Learn more</span>
            <div className='learn-more-icon'>↗</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;