import React, { useState, useEffect, useRef } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";
import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
    <section ref={sectionRef} className="contact-section slide-in" id="contact">
      <div className="container">
        <div className="contact-layout">
          
          {/* LEFT SIDE */}
          <div className="contact-info">
            <h1 className="contact-heading">Get in Touch</h1>
            <p className="contact-subtitle">I'd like to hear from you!</p>
            
            <p className="contact-description">
              If you have any inquiries or just want to say hi, please use the contact form!
            </p>

            <div className="contact-details">
              <div className="contact-item-minimal">
                <FaEnvelope className="contact-icon-minimal" />
                <a href="mailto:arnabdutta453@gmail.com" className="contact-link">
                  arnabdutta453@gmail.com
                </a>
              </div>
            </div>

            <div className="social-links-minimal">
              <a href="#" className="social-icon-minimal" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon-minimal" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon-minimal" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon-minimal" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
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
                  required
                />
              </div>

              {status === "success" && (
                <div className="form-message success">
                  ✓ Message sent successfully!
                </div>
              )}

              <button
                type="submit"
                className="submit-btn-minimal"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;