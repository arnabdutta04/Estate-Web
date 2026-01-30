import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaArrowRight,
  FaLock,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../utils/api';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user starts typing again
    if (submitStatus.type) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // REAL API CALL to backend
      const { data } = await api.post('/contact', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      
      // Show success message
      setSubmitStatus({
        type: 'success',
        message: data.message || 'Thank you for contacting us! We will get back to you soon.'
      });
      
      // Reset form after successful submission
      setFormData({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        message: '' 
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 5000);

    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Show error message
      const errorMessage = error.response?.data?.message || 
        'Sorry, there was an error sending your message. Please try again.';
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 5000);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section-modern">
      {/* Decorative Background Elements */}
      <div className="contact-bg-shape top-left"></div>
      <div className="contact-bg-shape bottom-right"></div>
      
      {/* Dotted Pattern */}
      <div className="dotted-pattern"></div>
      
      {/* Building Wireframe */}
      <div className="building-wireframe"></div>

      <div className="contact-container-modern">
        {/* Left Side - Contact Form */}
        <div className="contact-form-side">
          <div className="contact-form-header">
            <h2 className="contact-form-title">Get In Touch</h2>
            <p className="contact-form-subtitle">
              Have questions about our properties or services? We're here to help you find your perfect home.
            </p>
          </div>

          {/* Success/Error Message */}
          {submitStatus.type && (
            <div className={`status-message ${submitStatus.type}`}>
              {submitStatus.type === 'success' ? (
                <FaCheckCircle className="status-icon" />
              ) : (
                <span className="status-icon">⚠️</span>
              )}
              <p>{submitStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form-modern">
            <div className="form-row">
              <div className="form-group-modern">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input-modern"
                  placeholder="First Name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group-modern">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input-modern"
                  placeholder="Last Name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modern">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input-modern"
                  placeholder="Email Address"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group-modern">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input-modern"
                  placeholder="Phone Number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group-modern">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea-modern"
                placeholder="Leave Your Message"
                rows="5"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="form-submit-btn-modern"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  Send Message <FaArrowRight />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side - Contact Info */}
        <div className="contact-info-side">
          <div className="contact-info-card-container">
            <h2 className="contact-info-main-title">Contact Us</h2>
            
            <div className="contact-info-card">
              <div className="contact-info-icon phone">
                <FaPhone />
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-label">Call Us Now:</h3>
                <a href="tel:+1234567890" className="contact-info-text">
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon location">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-label">Our Address:</h3>
                <p className="contact-info-text">
                  75 SE. Dogwood St.<br />
                  Danbury, CT 06810
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon email">
                <FaEnvelope />
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-label">Mail Us:</h3>
                <a 
                  href="mailto:info@propify.com" 
                  className="contact-info-text"
                >
                  info@propify.com
                </a>
              </div>
            </div>

            <a href="/profile" className="portfolio-link">
              Go to Investment Portfolio Portal <FaLock />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;