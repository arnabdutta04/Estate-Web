import React, { useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    setTimeout(() => {
      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-layout">
          
          {/* LEFT SIDE */}
          <div className="contact-info">
            <div className="hero-badge-contact">
              <div className="badge-pulse"></div>
              <span>Available 24/7</span>
            </div>
            
            <h1 className="contact-heading">Let's chat.</h1>
            
            <p className="contact-description">
              Tell us about your project, and we'll get back to you within 24 hours. Whether you're looking to buy, sell, or rent, we're here to help make your real estate journey seamless.
            </p>

            <div className="contact-details">
              <div className="contact-item-minimal">
                <FaEnvelope className="contact-icon-minimal" />
                <a href="mailto:arnabdutta453@gmail.com" className="contact-link">
                  arnabdutta453@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="contact-form-wrapper-minimal">
            <form className="contact-form-minimal" onSubmit={handleSubmit}>
              <div className="form-row-minimal">
                <div className="form-group-minimal">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="form-group-minimal">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group-minimal">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="form-group-minimal">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us about your property needs..."
                  required
                />
              </div>

              {status === "success" && (
                <div className="form-message success">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <button
                type="submit"
                className="submit-btn-minimal"
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;