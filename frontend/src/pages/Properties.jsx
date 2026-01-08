import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaChevronDown } from 'react-icons/fa';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    condition: ''
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

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProperties(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      propertyType: '',
      listingType: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      condition: ''
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
        <div className='properties-page-dark'>
          {/* Hero Section */}
          <div className='properties-hero-dark'>
            <div className='hero-content-dark'>
              <h1>Find Your Dream Property</h1>
              <p className='hero-subtitle-dark'>
                Discover exceptional homes, apartments, and investments tailored to your lifestyle—<br />
                perfect spaces for living, working, or building your future.
              </p>

              {/* Search Filters */}
              <div className='search-filters-dark'>
                <div className='filter-group-dark' ref={cityDropdownRef}>
                  <label>Location</label>
                  <div className='filter-input-wrapper'>
                    <input
                      type='text'
                      value={cityInput}
                      onChange={handleCityInputChange}
                      onFocus={handleCityInputFocus}
                      placeholder='Search city...'
                      className='filter-input-dark'
                    />
                    <FaChevronDown className='dropdown-icon' />
                    
                    {showCitySuggestions && citySuggestions.length > 0 && (
                      <ul className='city-dropdown-dark'>
                        {citySuggestions.slice(0, 8).map((city, index) => (
                          <li key={index} onClick={() => handleCitySelect(city)}>
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className='filter-group-dark'>
                  <label>Category</label>
                  <select 
                    name='listingType'
                    value={filters.listingType}
                    onChange={handleFilterChange}
                    className='filter-select-dark'
                  >
                    <option value=''>All Properties</option>
                    <option value='sale'>For Sale</option>
                    <option value='rent'>For Rent</option>
                  </select>
                </div>

                <div className='filter-group-dark'>
                  <label>Property Type</label>
                  <select 
                    name='propertyType'
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className='filter-select-dark'
                  >
                    <option value=''>All Types</option>
                    <option value='apartment'>Apartment</option>
                    <option value='villa'>Villa</option>
                    <option value='house'>House</option>
                    <option value='flat'>Flat</option>
                    <option value='commercial'>Commercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className='properties-container-dark'>
            {loading ? (
              <div className='no-results-dark'>
                <h2>Loading properties...</h2>
                <p>Please wait while we fetch the best options for you</p>
              </div>
            ) : properties.length === 0 ? (
              <div className='no-results-dark'>
                <h2>No Properties Found</h2>
                <p>Try adjusting your filters to discover more amazing properties</p>
                <button 
                  onClick={handleReset}
                  style={{
                    marginTop: '20px',
                    padding: '12px 32px',
                    background: '#c4d600',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0a0a0a',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className='properties-grid-dark'>
                  {properties.map((property, index) => (
                    <PropertyCard 
                      key={property._id} 
                      property={property} 
                      index={index} 
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className='pagination-dark'>
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