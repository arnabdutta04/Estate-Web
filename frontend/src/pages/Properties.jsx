import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';

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

  // Close dropdown when clicking outside
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
    } else {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(cityInput.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowCitySuggestions(true);
    }
  };

  const handleCitySelect = (city) => {
    setCityInput(city);
    setFilters({ ...filters, city });
    setShowCitySuggestions(false);
  };

  // Price range handlers
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price === 0) {
      return '₹0';
    } else {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= priceRange.max) {
      setPriceRange({ ...priceRange, min: value });
      setFilters({ ...filters, minPrice: value });
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= priceRange.min) {
      setPriceRange({ ...priceRange, max: value });
      setFilters({ ...filters, maxPrice: value });
    }
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
        <div className='properties-page'>
          <div className='container'>
            <h1>Browse Properties</h1>
            
            <div className='properties-layout'>
              <div className='filter-sidebar'>
                <h3>Filter Properties</h3>
                <form onSubmit={handleFilter}>
                  <div className='form-group'>
                    <label>City</label>
                    <div style={{ position: 'relative' }} ref={cityDropdownRef}>
                      <input
                        type='text'
                        value={cityInput}
                        onChange={handleCityInputChange}
                        onFocus={handleCityInputFocus}
                        placeholder='Search city...'
                        autoComplete='off'
                      />
                      
                      {showCitySuggestions && citySuggestions.length > 0 && (
                        <ul className='city-suggestions'>
                          {citySuggestions.map((city, index) => (
                            <li
                              key={index}
                              onClick={() => handleCitySelect(city)}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className='form-group'>
                    <label>Property Type</label>
                    <select name='propertyType' value={filters.propertyType} onChange={handleFilterChange}>
                      <option value=''>All Types</option>
                      <option value='apartment'>Apartment</option>
                      <option value='villa'>Villa</option>
                      <option value='house'>House</option>
                      <option value='flat'>Flat</option>
                      <option value='commercial'>Commercial</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Listing Type</label>
                    <select name='listingType' value={filters.listingType} onChange={handleFilterChange}>
                      <option value=''>All</option>
                      <option value='sale'>For Sale</option>
                      <option value='rent'>For Rent</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Price Range</label>
                    
                    <div className="price-display">
                      <div className="price-value">
                        <span className="price-label">Min</span>
                        <span className="price-amount">{formatPrice(priceRange.min)}</span>
                      </div>
                      <div className="price-separator">-</div>
                      <div className="price-value">
                        <span className="price-label">Max</span>
                        <span className="price-amount">{formatPrice(priceRange.max)}</span>
                      </div>
                    </div>

                    <div className="slider-container">
                      <div className="slider-track">
                        <div 
                          className="slider-range"
                          style={{
                            left: `${(priceRange.min / 10000000) * 100}%`,
                            width: `${((priceRange.max - priceRange.min) / 10000000) * 100}%`
                          }}
                        ></div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={priceRange.min}
                        onChange={handleMinPriceChange}
                        className="slider slider-min"
                      />

                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={priceRange.max}
                        onChange={handleMaxPriceChange}
                        className="slider slider-max"
                      />
                    </div>

                    <div className="price-labels">
                      <span>₹0</span>
                      <span>₹2.5L</span>
                      <span>₹5L</span>
                      <span>₹7.5L</span>
                      <span>₹1Cr+</span>
                    </div>
                  </div>

                  <div className='form-group'>
                    <label>Bedrooms</label>
                    <select name='bedrooms' value={filters.bedrooms} onChange={handleFilterChange}>
                      <option value=''>Any</option>
                      <option value='1'>1+</option>
                      <option value='2'>2+</option>
                      <option value='3'>3+</option>
                      <option value='4'>4+</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Bathrooms</label>
                    <select name='bathrooms' value={filters.bathrooms} onChange={handleFilterChange}>
                      <option value=''>Any</option>
                      <option value='1'>1+</option>
                      <option value='2'>2+</option>
                      <option value='3'>3+</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Condition</label>
                    <select name='condition' value={filters.condition} onChange={handleFilterChange}>
                      <option value=''>All Conditions</option>
                      <option value='new'>New</option>
                      <option value='excellent'>Excellent</option>
                      <option value='good'>Good</option>
                      <option value='fair'>Fair</option>
                    </select>
                  </div>

                  <button type='submit' className='btn-filter'>Apply Filters</button>
                  <button type='button' onClick={handleReset} className='btn-reset'>Reset</button>
                </form>
              </div>
              
              <div className='properties-content'>
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-icon">🏠</div>
                    <p className="loading-text">Searching Properties<span className="loading-dots"></span></p>
                    <p className="loading-subtext">Finding the perfect match for you</p>
                  </div>
                ) : properties.length === 0 ? (
                  <div className='no-results'>
                    <h2>No properties found</h2>
                    <p>Try adjusting your filters to see more results</p>
                  </div>
                ) : (
                  <>
                    <div className='results-info'>
                      <p>Found <strong>{properties.length}</strong> properties</p>
                    </div>
                    <div className='properties-grid'>
                      {properties.map(property => (
                        <PropertyCard key={property._id} property={property} />
                      ))}
                    </div>

                    {pagination.totalPages > 1 && (
                      <div className='pagination'>
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
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Properties;