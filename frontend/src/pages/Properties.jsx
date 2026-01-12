import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaChevronDown, FaPlay } from 'react-icons/fa';
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
    bathrooms: ''
  });

  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const cityDropdownRef = useRef(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
    <p className='hero-description'>
      Explore a selection of high-value real estate opportunities designed for financial growth and stability
    </p>
  </div>

  <div className='search-bar-wrapper'>
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
        Search Property
      </button>
    </div>

    <button 
      className='advanced-search-link'
      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
    >
      <FaChevronDown className={`advanced-search-icon ${showAdvancedFilters ? 'rotate' : ''}`} />
      {showAdvancedFilters ? 'Hide Filters' : 'Advanced Search'}
    </button>

    {/* Advanced Filters Dropdown */}
    {showAdvancedFilters && (
      <div className='advanced-filters-dropdown'>
        <div className='advanced-filters-grid'>
          {/* Property For */}
          <div className='filter-item'>
            <label>Property For</label>
            <select 
              name='propertyFor'
              value={filters.propertyFor}
              onChange={handleFilterChange}
            >
              <option value=''>Buy or Rent</option>
              <option value='buy'>Buy</option>
              <option value='rent'>Rent</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div className='filter-item'>
            <label>Bathrooms</label>
            <select 
              name='bathrooms'
              value={filters.bathrooms}
              onChange={handleFilterChange}
            >
              <option value=''>Any</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4+</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className='filter-item filter-item-full'>
            <label>
              Price Range {filters.propertyFor === 'rent' ? '(₹/month)' : '(₹)'}
            </label>
            <div className='price-range-display'>
              <span className='price-value'>
                {filters.propertyFor === 'rent' 
                  ? `₹${filters.minPrice ? (filters.minPrice / 1000).toFixed(0) : '0'}K`
                  : `₹${filters.minPrice ? (filters.minPrice / 100000).toFixed(0) : '0'}L`
                }
              </span>
              <span className='price-separator'>-</span>
              <span className='price-value'>
                {filters.propertyFor === 'rent'
                  ? `₹${filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) : '100'}K`
                  : filters.maxPrice >= 10000000
                    ? `₹${(filters.maxPrice / 10000000).toFixed(1)}Cr`
                    : `₹${filters.maxPrice ? (filters.maxPrice / 100000).toFixed(0) : '500'}L`
                }
              </span>
            </div>
            
            {/* Dual Range Slider */}
            <div className='range-slider-container'>
              <input
                type='range'
                className='range-slider range-slider-min'
                min={filters.propertyFor === 'rent' ? '5000' : '500000'}
                max={filters.propertyFor === 'rent' ? '100000' : '50000000'}
                step={filters.propertyFor === 'rent' ? '1000' : '100000'}
                value={filters.minPrice || (filters.propertyFor === 'rent' ? '5000' : '500000')}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value < (filters.maxPrice || (filters.propertyFor === 'rent' ? 100000 : 50000000))) {
                    setFilters({ ...filters, minPrice: value });
                  }
                }}
              />
              <input
                type='range'
                className='range-slider range-slider-max'
                min={filters.propertyFor === 'rent' ? '5000' : '500000'}
                max={filters.propertyFor === 'rent' ? '100000' : '50000000'}
                step={filters.propertyFor === 'rent' ? '1000' : '100000'}
                value={filters.maxPrice || (filters.propertyFor === 'rent' ? '100000' : '50000000')}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > (filters.minPrice || (filters.propertyFor === 'rent' ? 5000 : 500000))) {
                    setFilters({ ...filters, maxPrice: value });
                  }
                }}
              />
              <div className='range-slider-track'>
                <div 
                  className='range-slider-progress'
                  style={{
                    left: `${((filters.minPrice || (filters.propertyFor === 'rent' ? 5000 : 500000)) - (filters.propertyFor === 'rent' ? 5000 : 500000)) / ((filters.propertyFor === 'rent' ? 100000 : 50000000) - (filters.propertyFor === 'rent' ? 5000 : 500000)) * 100}%`,
                    right: `${100 - ((filters.maxPrice || (filters.propertyFor === 'rent' ? 100000 : 50000000)) - (filters.propertyFor === 'rent' ? 5000 : 500000)) / ((filters.propertyFor === 'rent' ? 100000 : 50000000) - (filters.propertyFor === 'rent' ? 5000 : 500000)) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Quick Price Options */}
            <div className='quick-price-options'>
              {filters.propertyFor === 'rent' ? (
                <>
                  <button 
                    className={`price-option ${filters.minPrice === 5000 && filters.maxPrice === 15000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 5000, maxPrice: 15000 })}
                  >
                    ₹5K - ₹15K
                  </button>
                  <button 
                    className={`price-option ${filters.minPrice === 15000 && filters.maxPrice === 30000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 15000, maxPrice: 30000 })}
                  >
                    ₹15K - ₹30K
                  </button>
                  <button 
                    className={`price-option ${filters.minPrice === 30000 && filters.maxPrice === 50000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 30000, maxPrice: 50000 })}
                  >
                    ₹30K - ₹50K
                  </button>
                  <button 
                    className={`price-option ${filters.minPrice === 50000 && filters.maxPrice === 100000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 50000, maxPrice: 100000 })}
                  >
                    ₹50K+
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`price-option ${filters.minPrice === 2500000 && filters.maxPrice === 5000000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 2500000, maxPrice: 5000000 })}
                  >
                    ₹25L - ₹50L
                  </button>
                  <button 
                    className={`price-option ${filters.minPrice === 5000000 && filters.maxPrice === 10000000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 5000000, maxPrice: 10000000 })}
                  >
                    ₹50L - ₹1Cr
                  </button>
                  <button 
                    className={`price-option ${filters.minPrice === 10000000 && filters.maxPrice === 25000000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 10000000, maxPrice: 25000000 })}
                  >
                    ₹1Cr - ₹2.5Cr
                  </button>
                  <button 
                    className={`price-option ${filters.minPrice === 25000000 && filters.maxPrice === 50000000 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, minPrice: 25000000, maxPrice: 50000000 })}
                  >
                    ₹2.5Cr+
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='filter-actions'>
            <button className='reset-filter-btn-hero' onClick={handleReset}>
              Reset All
            </button>
            <button className='apply-filter-btn-hero' onClick={handleSearch}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    )}
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