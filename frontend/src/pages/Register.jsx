import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Country codes with validation patterns
  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', pattern: /^[6-9]\d{9}$/, placeholder: '9876543210' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', pattern: /^\d{10}$/, placeholder: '2025551234' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', pattern: /^\d{10}$/, placeholder: '7400123456' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971', pattern: /^\d{9}$/, placeholder: '501234567' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', pattern: /^\d{9}$/, placeholder: '501234567' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', pattern: /^\d{9}$/, placeholder: '412345678' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', pattern: /^\d{10}$/, placeholder: '4165551234' },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', pattern: /^\d{10}$/, placeholder: '1712345678' },
  ];

  const currentCountry = countries.find(c => c.code === selectedCountry);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhoneNumber(input);
    
    // Auto-detect country based on pattern
    if (input.length >= 6) {
      for (const country of countries) {
        if (country.pattern.test(input)) {
          setSelectedCountry(country.code);
          break;
        }
      }
    }
    
    // Update formData with full number (country code + phone)
    setFormData({ 
      ...formData, 
      phone: currentCountry.dialCode + input 
    });
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    // Update phone with new country code
    const country = countries.find(c => c.code === e.target.value);
    setFormData({ 
      ...formData, 
      phone: country.dialCode + phoneNumber 
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  
  try {
    await register(formData);
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
      <div className="auth-container">
        <h2>Create Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Country Selector - SMALL */}
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                style={{
                  width: '140px',
                  flexShrink: 0,
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.dialCode}
                  </option>
                ))}
              </select>

              {/* Phone Input - BIG */}
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={currentCountry.placeholder}
                style={{ 
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required 
              />
            </div>
            {phoneNumber && (
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                Full Number: {currentCountry.dialCode}{phoneNumber}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required 
            />
          </div>

          <div className="form-group">
            <label>Register as</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="broker">Broker</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
<p className="auth-link">
        Already have an account?{" "}
        <span
          onClick={switchToLogin}
          style={{ color: "#0f3d2e", fontWeight: 600, cursor: "pointer" }}
        >
          Login here
        </span>
      </p>

      </div>
    );
};

export default Register;