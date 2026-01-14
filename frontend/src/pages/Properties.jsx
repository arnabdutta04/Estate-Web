import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaHome } from 'react-icons/fa';
import './Properties.css';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyFor: ''
  });

  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const cityDropdownRef = useRef(null);

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 
    'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
    'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 
    'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur',
    'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh',
    'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem',
    'Warangal', 'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi',
    'Saharanpur', 'Guntur', 'Amravati', 'Bikaner', 'Noida', 
    'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi',
    'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
    'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola',
    'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri',
    'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Mangalore', 
    'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon'
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProperties = async (customFilters = {}, page = 1) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams({ ...customFilters, page }).toString();
      const { data } = await api.get(`/properties?${queryString}`);
      setProperties(data.properties);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);

    if (value.length > 0) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleCityInputFocus = () => {
    if (cityInput.length === 0) {
      setCitySuggestions(cities);
      setShowCitySuggestions(true);
    }
  };

  const handleCitySelect = (city) => {
    setCityInput(city);
    setFilters({ ...filters, city });
    setShowCitySuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      propertyType: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyFor: ''
    };
    setFilters(resetFilters);
    setCityInput('');
    fetchProperties({});
  };

  const handlePageChange = (page) => {
    fetchProperties(filters, page);
  };
  
  return (
    <>
      <Navbar />
      <PageTransition>
        <div className='properties-page-modern'>
          {/* Hero Section */}
          <div className='properties-hero-modern'>
            <div className='hero-overlay'></div>
            <div className='hero-content-modern'>
              <span className='welcome-text'>Choice Around The World</span>
              <h1 className='hero-title'>
                Find Your Best Investment
              </h1>
              <p className='hero-description'>
                Explore a selection of high-value real estate opportunities designed for financial growth and stability
              </p>
            </div>

            {/* Simple Search Bar - Single Row */}
            <div className='search-bar-container'>
              <div className='search-bar-modern'>
                <div className='search-input-group' ref={cityDropdownRef}>
                  <FaHome className='home-icon' />
                  <input
                    type='text'
                    value={cityInput}
                    onChange={handleCityInputChange}
                    onFocus={handleCityInputFocus}
                    placeholder="Enter city"
                    className='city-search-input'
                  />
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <ul className='city-dropdown-modern'>
                      {citySuggestions.slice(0, 8).map((city, index) => (
                        <li key={index} onClick={() => handleCitySelect(city)}>
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <select 
                  name='propertyType'
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className='search-property-select'
                >
                  <option value=''>Property type</option>
                  <option value='apartment'>Apartment</option>
                  <option value='villa'>Villa</option>
                  <option value='house'>House</option>
                  <option value='flat'>Flat</option>
                  <option value='commercial'>Commercial</option>
                </select>

                <select 
                  name='bedrooms'
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className='search-property-select'
                >
                  <option value=''>Bedrooms</option>
                  <option value='1'>1 BHK</option>
                  <option value='2'>2 BHK</option>
                  <option value='3'>3 BHK</option>
                  <option value='4'>4+ BHK</option>
                </select>
                
                <button className='search-btn-modern' onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className='properties-container-modern'>
            {loading ? (
              <div className='loading-state'>
                <div className='loader'></div>
                <h2>Loading properties...</h2>
                <p>Please wait while we fetch the best options for you</p>
              </div>
            ) : properties.length === 0 ? (
              <div className='no-results-modern'>
                <h2>No Properties Found</h2>
                <p>Try adjusting your filters to discover more amazing properties</p>
                <button className='reset-btn-large' onClick={handleReset}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Properties Header */}
                <div className='properties-header'>
                  <h2 className='properties-header-title'>
                    More Than Properties<br />We Deliver Prestige
                  </h2>
                  <button className='view-all-properties-btn' onClick={() => navigate('/properties')}>
                    View all Property
                    <span className='arrow-icon'>→</span>
                  </button>
                </div>

                <div className='properties-grid-modern'>
                  {properties.map((property, index) => (
                    <PropertyCard 
                      key={property._id} 
                      property={property} 
                      index={index} 
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className='pagination-modern'>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      style={{ opacity: pagination.currentPage === 1 ? 0.5 : 1 }}
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(pagination.totalPages, 8) }, (_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 4 && pagination.totalPages > 8) {
                        return <span key="ellipsis">...</span>;
                      }
                      if (pageNum > 3 && pageNum < pagination.totalPages - 2 && pagination.totalPages > 8) {
                        return null;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={pagination.currentPage === pageNum ? 'active' : ''}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {pagination.totalPages > 8 && (
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className={pagination.currentPage === pagination.totalPages ? 'active' : ''}
                      >
                        {pagination.totalPages}
                      </button>
                    )}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      style={{ opacity: pagination.currentPage === pagination.totalPages ? 0.5 : 1 }}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Tailored Solutions Section */}
          <section className="tailored-solutions-section">
            <div className="tailored-solutions-container">
              <h1 className="tailored-solutions-title">
                Tailored Solutions For<br />Every Move
              </h1>

              <div className="solutions-grid">
                <div className="solution-card">
                  <div className="solution-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" 
                      alt="Modern luxury house at sunset" 
                      className="solution-image" 
                    />
                    <div className="solution-overlay"></div>
                    <h3 className="solution-title">Start Buying</h3>
                  </div>
                </div>

                <div className="solution-card">
                  <div className="solution-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" 
                      alt="Contemporary house for sale" 
                      className="solution-image" 
                    />
                    <div className="solution-overlay"></div>
                    <h3 className="solution-title">Start Selling</h3>
                  </div>
                </div>

                <div className="solution-card">
                  <div className="solution-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
                      alt="Keys for renting" 
                      className="solution-image" 
                    />
                    <div className="solution-overlay"></div>
                    <h3 className="solution-title">Start Renting</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section - Orange */}
          <div className='cta-section-orange'>
            <div className='cta-content-wrapper'>
              <svg className='cta-icon' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 8L8 24v24h16V32h16v16h16V24L32 8z" fill="currentColor"/>
              </svg>
              <div className='cta-text'>
                Find Your Home 
                <span className='cta-arrow'>→</span>
                <span className='cta-button-text'>Get Started</span>
              </div>
            </div>
          </div>

          {/* Footer Section - Dark */}
          <div className='footer-section-dark'>
            <div className='footer-container'>
              <div className='footer-top'>
                <div className='footer-brand'>
                  <div className='footer-logo'>
                    <svg className='footer-logo-icon' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 8L8 24v24h16V32h16v16h16V24L32 8z" fill="currentColor"/>
                    </svg>
                    <span className='footer-logo-text'>PROPIFY</span>
                  </div>
                  <p className='footer-description'>
                    Helping you discover and secure your dream property with ease, expertise, and unmatched service in Dubai.
                  </p>
                </div>

                <div className='footer-column'>
                  <h3>Navigation</h3>
                  <ul className='footer-links'>
                    <li onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</li>
                    <li onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</li>
                    <li>Property</li>
                    <li>Event</li>
                    <li onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact Us</li>
                  </ul>
                </div>

                <div className='footer-column'>
                  <h3>Resource</h3>
                  <ul className='footer-links'>
                    <li>Blog</li>
                    <li>Blog Details</li>
                    <li>Property Details</li>
                    <li>FAQs</li>
                    <li>Reviews</li>
                  </ul>
                </div>

                <div className='footer-column'>
                  <div className='footer-newsletter'>
                    <p>Enter your email</p>
                    <input 
                      type='email' 
                      className='newsletter-input' 
                      placeholder='Enter the email'
                    />
                    <button className='newsletter-button'>Subscribe</button>
                  </div>
                </div>
              </div>

              <div className='footer-bottom'>
                <ul className='footer-links-bottom'>
                  <li>Privacy Policy</li>
                  <li>Help Center</li>
                </ul>
                <div className='footer-social'>
                  <span className='footer-social-icon'>f</span>
                  <span className='footer-social-icon'>𝕏</span>
                  <span className='footer-social-icon'>in</span>
                </div>
              </div>

              <div className='footer-copyright'>
                ©2026 PROPIFY, Designed by Arnab
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Properties;