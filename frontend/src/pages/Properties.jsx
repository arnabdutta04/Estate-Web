import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaChevronDown, FaPlay } from 'react-icons/fa';
import './Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
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
      bathrooms: ''
    };
    setFilters(resetFilters);
    setCityInput('');
    fetchProperties({});
  };

  const handlePageChange = (page) => {
    fetchProperties(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <p className='welcome-text'>Home / Properties</p>
              <h1 className='hero-title'>
                Find your perfect<br />
                investment properties
              </h1>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '15px', maxWidth: '700px', margin: '15px auto 0' }}>
                Explore a selection of high-value real estate opportunities designed for financial growth and stability
              </p>
            </div>

            <div className='search-bar-modern'>
              <div className='search-input-group' ref={cityDropdownRef}>
                <input
                  type='text'
                  value={cityInput}
                  onChange={handleCityInputChange}
                  onFocus={handleCityInputFocus}
                  placeholder="Enter address"
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
              <input
                type='text'
                placeholder='Location'
                className='city-search-input'
                style={{ borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}
              />
              <select className='city-search-input' style={{ border: 'none' }}>
                <option>Property type</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>House</option>
              </select>
              <button className='search-btn-modern' onClick={handleSearch}>
                Search Property
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className='filter-section-modern'>
            <h2 className='filter-title'>Browse Properties</h2>
            <div className='filters-grid'>
              <div className='filter-item'>
                <label>Property Type</label>
                <select 
                  name='propertyType'
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                >
                  <option value=''>All Types</option>
                  <option value='apartment'>Apartment</option>
                  <option value='villa'>Villa</option>
                  <option value='house'>House</option>
                  <option value='flat'>Flat</option>
                  <option value='commercial'>Commercial</option>
                </select>
              </div>

              <div className='filter-item'>
                <label>Bedrooms</label>
                <select 
                  name='bedrooms'
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                >
                  <option value=''>Any</option>
                  <option value='1'>1 BHK</option>
                  <option value='2'>2 BHK</option>
                  <option value='3'>3 BHK</option>
                  <option value='4'>4+ BHK</option>
                </select>
              </div>

              <div className='filter-item'>
                <label>Min Price</label>
                <input
                  type='number'
                  name='minPrice'
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder='Min'
                />
              </div>

              <div className='filter-item'>
                <label>Max Price</label>
                <input
                  type='number'
                  name='maxPrice'
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder='Max'
                />
              </div>

              <button className='apply-filter-btn' onClick={handleSearch}>
                Apply Filters
              </button>
              <button className='reset-filter-btn' onClick={handleReset}>
                Reset
              </button>
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
                    <span className='footer-logo-text'>Keyly</span>
                  </div>
                  <p className='footer-description'>
                    Helping you discover and secure your dream property with ease, expertise, and unmatched service in Dubai.
                  </p>
                </div>

                <div className='footer-column'>
                  <h3>Navigation</h3>
                  <ul className='footer-links'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Property</li>
                    <li>Event</li>
                    <li>Contact Us</li>
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
                  <h3>Subscribe Our Newsletter</h3>
                  <div className='footer-newsletter'>
                    <p>Enter your email</p>
                    <input 
                      type='email' 
                      className='newsletter-input' 
                      placeholder='example123@gmail.com'
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
                  <span className='footer-social-icon'>📷</span>
                  <span className='footer-social-icon'>▶</span>
                </div>
              </div>

              <div className='footer-copyright'>
                ©2025 Keyly, Designed by Ogndoo
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Properties;