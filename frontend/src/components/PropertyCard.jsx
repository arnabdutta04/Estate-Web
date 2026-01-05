import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';

const PropertyCard = ({ property, index }) => {
  // Format the number badge (01, 02, 03, etc.)
  const cardNumber = `AI ${String(index + 1).padStart(2, '0')}`;
  
  return (
    <div className="property-card" data-number={cardNumber}>
      <div className="property-image">
        <img src={property.images[0] || '/placeholder.jpg'} alt={property.title} />
        <span className={`badge ${property.listingType}`}>
          {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
        </span>
      </div>
      
      <div className="property-content">
        <h3>{property.title}</h3>
        <p className="location">
          <FaMapMarkerAlt /> {property.location.city}, {property.location.state}
        </p>
        
        <div className="property-specs">
          <span><FaBed /> {property.specifications.bedrooms} Beds</span>
          <span><FaBath /> {property.specifications.bathrooms} Baths</span>
          <span><FaRuler /> {property.specifications.area} sqft</span>
        </div>
        
        <div className="property-details">
          <p><FaCalendar /> Built: {property.yearBuilt} ({property.age} years old)</p>
          <p>Condition: <strong>{property.condition}</strong></p>
        </div>
        
        <div className="property-footer">
          <span className="price">
            ₹{property.price.toLocaleString()}
            {property.listingType === 'rent' && '/month'}
          </span>
          <Link to={`/properties/${property._id}`} className="btn-view">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;