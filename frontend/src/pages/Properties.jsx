import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaChevronDown, FaPlay } from 'react-icons/fa';
import './App.css';

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

  // City autocomplete state
  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const cityDropdownRef = useRef(null);

  // Indian cities list
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
              <p className='welcome-text'>welcome to our home</p>
              <h1 className='hero-title'>
                Find Your <br />
                <span className='highlight-yellow'>Dream</span> <br />
                House
              </h1>

              <div className='hero-stats'>
                <div className='stat-item'>
                  <h3>140k</h3>
                  <p>People trust left to<br />our service</p>
                </div>
                <div className='stat-item'>
                  <h3>3400</h3>
                  <p>Property out brand<br />listing in available</p>
                </div>
                <div className='stat-item'>
                  <h3>140k</h3>
                  <p>Transaction we have<br />completed so far</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className='search-bar-modern'>
                <div className='search-input-group' ref={cityDropdownRef}>
                  <input
                    type='text'
                    value={cityInput}
                    onChange={handleCityInputChange}
                    onFocus={handleCityInputFocus}
                    placeholder='City (like Pune, College, Baner)'
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
                <button className='search-btn-modern' onClick={handleSearch}>
                  Search
                </button>
              </div>

              <button className='watch-video-btn'>
                <FaPlay /> Watch Video
              </button>
            </div>

            <div className='hero-sidebar'>
              <div className='ratings-card'>
                <p>Ratings</p>
                <div className='stars'>★ 5.0</div>
                <p className='rating-count'>Trusted on over 100+ reviews</p>
              </div>
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
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={pagination.currentPage === i + 1 ? 'active' : ''}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Properties;