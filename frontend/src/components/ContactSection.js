import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaPaperPlane } from 'react-icons/fa';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ fullName: '', email: '', message: '' });
  };

  return (
    <section className="contact-section-modern">
      {/* Decorative Background Elements */}
      <div className="contact-bg-shape top-left"></div>
      <div className="contact-bg-shape bottom-right"></div>

      <div className="contact-container-modern">
        {/* Left Side - Info Cards */}
        <div className="contact-info-side">
          <div className="contact-info-card">
            <div className="contact-info-icon location">
              <FaMapMarkerAlt />
            </div>
            <h3 className="contact-info-title">Location</h3>
            <p className="contact-info-text">
              123 Real Estate Plaza<br />
              Downtown District<br />
              New York, NY 10001
            </p>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon phone">
              <FaPhone />
            </div>
            <h3 className="contact-info-title">Phone</h3>
            <p className="contact-info-text">
              +1 (555) 123-4567<br />
              +1 (555) 765-4321<br />
              Mon - Fri, 9AM - 6PM
            </p>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon hours">
              <FaClock />
            </div>
            <h3 className="contact-info-title">Hours</h3>
            <p className="contact-info-text">
              Monday - Friday: 9AM - 6PM<br />
              Saturday: 10AM - 4PM<br />
              Sunday: Closed
            </p>
          </div>

          {/* Property Image */}
          <div className="contact-property-image">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600" 
              alt="Office Space"
            />
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-side">
          <div className="contact-form-card">
            <h2 className="contact-form-title">Contact Form</h2>
            
            <form onSubmit={handleSubmit} className="contact-form-modern">
              <div className="form-group-modern">
                <label htmlFor="fullName" className="form-label-modern">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input-modern"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="email" className="form-label-modern">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input-modern"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="message" className="form-label-modern">
                  Comment or message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea-modern"
                  placeholder="Tell us about your property needs..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="form-submit-btn-modern">
                <FaPaperPlane /> Submit
              </button>
            </form>
          </div>
          </div>
        </div>
    </section>
  );
};

export default ContactSection;