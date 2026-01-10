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
            </div>

            <div className='hero-sidebar'>
              <div className='ratings-card'>
                <p>Ratings ★ <span className='stars'>5.0</span></p>
                <p className='rating-count'>Trusted on over 100+ reviews</p>
              </div>

              <button className='watch-video-btn'>
                <FaPlay /> Watch Video
              </button>

              <div className='search-bar-modern'>
                <div className='search-input-group' ref={cityDropdownRef}>
                  <input
                    type='text'
                    value={cityInput}
                    onChange={handleCityInputChange}
                    onFocus={handleCityInputFocus}
                    placeholder="Let's find Home, Cottage, Appart"
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
            </div>
          </div>

          {/* Popular Cities Section */}
          <div className='popular-cities-section'>
            <h2 className='popular-cities-title'>
              Popular <span className='highlight-yellow'>Cities</span>
            </h2>
            
            <div className='cities-grid'>
              <div className='city-card'>
                <img 
                  src='https://images.unsplash.com/photo-1558098329-a38eedc74e37?w=800&q=80' 
                  alt='Bruges' 
                  className='city-card-image'
                />
                <div className='city-card-overlay'>
                  <div className='city-info'>
                    <h3>Bruges</h3>
                    <p>28,759 Listing Available</p>
                  </div>
                  <button className='view-listing-btn'>View Listing</button>
                </div>
              </div>

              <div className='city-card'>
                <img 
                  src='https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80' 
                  alt='Rome' 
                  className='city-card-image'
                />
                <div className='city-card-overlay'>
                  <div className='city-info'>
                    <h3>Rome</h3>
                    <p>16,759 Listing Available</p>
                  </div>
                  <button className='view-listing-btn'>View Listing</button>
                </div>
              </div>

              <div className='city-card'>
                <img 
                  src='https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80' 
                  alt='Paris' 
                  className='city-card-image'
                />
                <div className='city-card-overlay'>
                  <div className='city-info'>
                    <h3>Paris</h3>
                    <p>25,759 Listing Available</p>
                  </div>
                  <button className='view-listing-btn'>View Listing</button>
                </div>
              </div>
            </div>

            <div className='view-all-cities'>
              <button className='view-all-btn'>
                View All
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Featured Properties Section */}
          <div className='featured-properties-section'>
            <h2 className='featured-properties-title'>
              <span className='highlight-yellow'>Featured</span>
              <span className='white-text'>Properties</span>
            </h2>
            
            <div className='featured-grid'>
              <div className='featured-property-card'>
                <img 
                  src='https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80' 
                  alt='A-Frame House' 
                  className='featured-property-image'
                />
              </div>

              <div className='featured-property-card'>
                <img 
                  src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' 
                  alt='Modern Villa' 
                  className='featured-property-image'
                />
              </div>

              <div className='featured-property-card'>
                <img 
                  src='https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' 
                  alt='Luxury Villa' 
                  className='featured-property-image'
                />
              </div>

              <div className='featured-property-card'>
                <img 
                  src='https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' 
                  alt='Contemporary House' 
                  className='featured-property-image'
                />
                <div className='featured-property-overlay'>
                  <div className='featured-property-label'>
                    Luxury House
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className='view-all-featured'>
              <button className='view-all-featured-btn'>
                View All
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Honored Customers Section */}
          <div className='honored-customers-section'>
            <h2 className='honored-customers-title'>
              <span className='white-text'>Our </span>
              <span className='highlight-yellow'>Honored</span>
              <span className='highlight-yellow'>Customers</span>
            </h2>
            
            <div className='customers-year-section'>
              <div className='year-header'>
                <h3 className='year-title'>2022</h3>
                <div className='year-count'>
                  3/64
                  <div className='year-count-arrow'>↗</div>
                </div>
              </div>
              
              <div className='customers-grid'>
                <div className='customer-card'>
                  <img 
                    src='https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80' 
                    alt='Villa with Pool' 
                    className='customer-card-image'
                  />
                  <div className='customer-card-overlay'>
                    <div className='customer-info'>
                      <img 
                        src='https://i.pravatar.cc/150?img=12' 
                        alt='Christopher Thomas' 
                        className='customer-avatar'
                      />
                      <div className='customer-details'>
                        <h4>Christopher Thomas</h4>
                        <p>CEO Family Planing</p>
                      </div>
                    </div>
                    <div className='customer-price'>$168k</div>
                  </div>
                </div>

                <div className='customer-card'>
                  <img 
                    src='https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80' 
                    alt='Classic Manor' 
                    className='customer-card-image'
                  />
                  <div className='customer-card-overlay'>
                    <div className='customer-info'>
                      <img 
                        src='https://i.pravatar.cc/150?img=33' 
                        alt='James Bond' 
                        className='customer-avatar'
                      />
                      <div className='customer-details'>
                        <h4>James Bond</h4>
                        <p>CEO Family Planing</p>
                      </div>
                    </div>
                    <div className='customer-price'>$146k</div>
                  </div>
                </div>

                <div className='customer-card'>
                  <img 
                    src='https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' 
                    alt='Modern Villa' 
                    className='customer-card-image'
                  />
                  <div className='customer-card-overlay'>
                    <div className='customer-info'>
                      <img 
                        src='https://i.pravatar.cc/150?img=15' 
                        alt='David Jhon' 
                        className='customer-avatar'
                      />
                      <div className='customer-details'>
                        <h4>David Jhon</h4>
                        <p>CEO Family Planing</p>
                      </div>
                    </div>
                    <div className='customer-price'>$185k</div>
                  </div>
                </div>
              </div>
            </div>

            <div className='year-divider'>
              <div className='year-divider-title'>
                2023
                <span className='year-divider-count'>38</span>
              </div>
            </div>

            <div className='year-divider'>
              <div className='year-divider-title'>
                2024
                <span className='year-divider-count'>42</span>
              </div>
            </div>

            <div className='view-all-customers'>
              <button className='view-all-customers-btn'>
                View All
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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