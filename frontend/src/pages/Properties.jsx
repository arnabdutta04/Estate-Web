import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaSearch, FaSliders } from 'react-icons/fa';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [showFilters, setShowFilters] = useState(false);
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

  // Price range state
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 10000000
  });

  // Indian cities list
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 
    'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore'
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
    setPriceRange({ min: 0, max: 10000000 });
    fetchProperties({});
  };

  const handlePageChange = (page) => {
    fetchProperties(filters, page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner 
          text="Loading Properties"
          subtext="Finding your dream home"
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className='properties-page-modern'>
          {/* Hero Search Section */}
          <div className='properties-hero'>
            <div className='hero-overlay'></div>
            <div className='hero-content-properties'>
              <h1>Top Real Estate Listings in India</h1>
              
              {/* Search Bar */}
              <div className='search-bar-hero'>
                <div className='search-input-group' ref={cityDropdownRef}>
                  <input
                    type='text'
                    value={cityInput}
                    onChange={handleCityInputChange}
                    onFocus={handleCityInputFocus}
                    placeholder='Enter an address, state, city, area or zip code'
                    className='search-input-main'
                  />
                  
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <ul className='city-suggestions-hero'>
                      {citySuggestions.slice(0, 8).map((city, index) => (
                        <li key={index} onClick={() => handleCitySelect(city)}>
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <select 
                  className='search-select-hero'
                  name='propertyType'
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                >
                  <option value=''>Categories</option>
                  <option value='apartment'>Apartment</option>
                  <option value='villa'>Villa</option>
                  <option value='house'>House</option>
                  <option value='flat'>Flat</option>
                  <option value='commercial'>Commercial</option>
                </select>

                <select 
                  className='search-select-hero'
                  name='bedrooms'
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                >
                  <option value=''>Beds | Baths</option>
                  <option value='1'>1+ Beds</option>
                  <option value='2'>2+ Beds</option>
                  <option value='3'>3+ Beds</option>
                  <option value='4'>4+ Beds</option>
                </select>

                <button className='btn-search-hero' onClick={handleFilter}>
                  <FaSearch /> Search Properties
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className='filter-bar-top'>
            <div className='filter-bar-container'>
              <div className='filter-buttons'>
                <button className='filter-dropdown-btn'>Types</button>
                <button className='filter-dropdown-btn'>Categories</button>
                <button className='filter-dropdown-btn'>States</button>
                <button className='filter-dropdown-btn'>Cities</button>
                <button className='filter-dropdown-btn'>Areas</button>
                <button className='filter-dropdown-btn'>Default</button>
              </div>
              
              <div className='filter-view-controls'>
                <button className='view-btn grid-view active'>
                  <span>⊞</span>
                </button>
                <button className='view-btn list-view'>
                  <span>☰</span>
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className='properties-container-modern'>
            {properties.length === 0 ? (
              <div className='no-results-modern'>
                <h2>No properties found</h2>
                <p>Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <>
                <div className='properties-grid-modern'>
                  {properties.map((property, index) => (
                    <PropertyCard key={property._id} property={property} index={index} />
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