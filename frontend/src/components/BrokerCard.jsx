import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPhone, FaEnvelope, FaBriefcase } from 'react-icons/fa';

const BrokerCard = ({ broker }) => {
  return (
    <div className="broker-card">
      <div className="broker-header">
        <h3>{broker.userId?.name}</h3>
        <div className="rating">
          <FaStar color="#ffc107" /> {broker.rating.toFixed(1)} ({broker.totalReviews} reviews)
        </div>
      </div>
      
      <div className="broker-info">
        <p><FaBriefcase /> {broker.company}</p>
        <p>Experience: {broker.experience} years</p>
        <p>License: {broker.licenseNumber}</p>
        
        <div className="specialization">
          {broker.specialization.map((spec, index) => (
            <span key={index} className="tag">{spec}</span>
          ))}
        </div>
        
        <div className="serving-areas">
          <strong>Serving:</strong> {broker.servingAreas.join(', ')}
        </div>
      </div>
      
      <div className="broker-contact">
        <a href={`tel:${broker.userId?.phone}`} className="contact-btn">
          <FaPhone /> Call
        </a>
        <a href={`mailto:${broker.userId?.email}`} className="contact-btn">
          <FaEnvelope /> Email
        </a>
      </div>
      
      <Link to={`/brokers/${broker._id}`} className="btn-view-profile">
        View Profile & Properties
      </Link>
    </div>
  );
};

export default BrokerCard;