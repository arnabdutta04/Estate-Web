import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaHome, FaBed, FaBath, FaRulerCombined, FaDollarSign, FaPlus, FaMinus } from 'react-icons/fa';
import './Properties.css';
import { Sofa, Dog, Car, UtensilsCrossed, Wifi, Snowflake, Waves, Lock, Dumbbell } from 'lucide-react';
import { indianCities } from '../utils/cities';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('rent');
  const [priceRange, setPriceRange] = useState([1000, 5000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState('1');
  const [selectedAmenities, setSelectedAmenities] = useState({
    furnished: true,
    petAllowed: true,
    parkingSlot: false
  });
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const { user } = useContext(AuthContext);
  const [selectedFacilities, setSelectedFacilities] = useState({
    furnished: false,
    petAllowed: false,
    parkingSlot: false,
    kitchen: false,
    wifi: false,
    ac: false,
    swimmingPool: false,
    gym: false,
    security: false
  });
  const [counters, setCounters] = useState({
    bedrooms: 4,
    dining: 4,
    bathrooms: 4
  });
  const [filters, setFilters] = useState({
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyFor: 'rent'
  });
  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [walletAmount, setWalletAmount] = useState('');
  const [email, setEmail] = useState('');
  const cityDropdownRef = useRef(null);
  const cities = indianCities;

  const mockProperties = [
    {
      _id: '1',
      title: 'Duplex in La Plata',
      price: 1209,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      bedrooms: 2,
      bathrooms: 2,
      area: 645,
      parking: true,
      type: 'Luxury Duplex',
      description: 'Modern duplex with stunning views'
    },
    {
      _id: '2',
      title: 'Sudirman Park Apartment',
      price: 1209,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
      bedrooms: 1,
      bathrooms: 1,
      area: 480,
      parking: true,
      type: 'Urban Apartment',
      description: 'Cozy apartment in prime location'
    },
    {
      _id: '3',
      title: 'PIK Apart Complex',
      price: 1209,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      bedrooms: 3,
      bathrooms: 2,
      area: 820,
      parking: true,
      type: 'Residential Complex',
      description: 'Spacious complex with amenities'
    }
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
      setProperties(mockProperties);
      setPagination({ currentPage: 1, totalPages: 1 });
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

  const handleFilterSearch = () => {
    const filterParams = {
      propertyFor: activeTab,
      keyword: searchKeyword,
      city: selectedLocation,
      propertyType: selectedPropertyType,
      style: selectedStyle,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
      facilities: Object.keys(selectedFacilities).filter(key => selectedFacilities[key])
    };

    const filtered = mockProperties.filter(property => {
      let matches = true;
      if (filterParams.keyword && !property.title.toLowerCase().includes(filterParams.keyword.toLowerCase())) {
        matches = false;
      }
      if (property.price < filterParams.minPrice || property.price > filterParams.maxPrice) {
        matches = false;
      }
      return matches;
    });

    setProperties(filtered);
    setShowFilter(false);
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
      propertyFor: 'rent'
    };
    setFilters(resetFilters);
    setCityInput('');
    setPriceRange([1000, 5000]);
    setSelectedBedrooms('1');
    setSelectedBathrooms('');
    setSearchKeyword('');
    setSelectedLocation('');
    setSelectedPropertyType('');
    setSelectedStyle('');
    setSelectedFacilities({
      furnished: false,
      petAllowed: false,
      parkingSlot: false,
      kitchen: false,
      wifi: false,
      ac: false,
      swimmingPool: false,
      gym: false,
      security: false
    });
    setCounters({
      bedrooms: 4,
      dining: 4,
      bathrooms: 4
    });
    fetchProperties({});
  };

  const handlePageChange = (page) => {
    fetchProperties(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };

  const toggleFacility = (facility) => {
    setSelectedFacilities(prev => ({
      ...prev,
      [facility]: !prev[facility]
    }));
  };

  const increment = (type) => {
    setCounters(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const decrement = (type) => {
    setCounters(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  };

  const closeFilter = () => {
    setShowFilter(false);
  };

  const openFilter = () => {
    setShowFilter(true);
  };

  const handleTopUp = () => {
    if (walletAmount && parseFloat(walletAmount) > 0) {
      alert(`Top-up successful! Amount: ₹${walletAmount}`);
      setWalletAmount('');
    } else {
      alert('Please enter a valid amount');
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with email: ${email}`);
      setEmail('');
    } else {
      alert('Please enter a valid email');
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleBookTour = () => {
    navigate('/book-tour');
  };

  const handleSocialClick = (platform) => {
    const socialLinks = {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com'
    };
    window.open(socialLinks[platform], '_blank');
  };

  return (
    <>
      <PageTransition>
        <Navbar />
        
        {/* Hero Section with Wallet Card */}
        <div className="properties-hero-modern">
          <div className="hero-overlay"></div>
          
          {/* Left Side - Hero Content */}
          <div className="hero-left-content">
            <h1 className="hero-title-serif">Buy & Rent Property</h1>
            <button 
              className="explore-btn" 
              onClick={() => navigate('/properties')}
            >
              Explore All Property
            </button>
          </div>

          {/* Right Side - Wallet Card */}
          <div className="search-card-container">
            <div className="search-card-white">
              <h3 className="search-card-title">Your Wallet Balance</h3>
              
              {/* Balance Display */}
              <div className="balance-display">
                <p className="search-label">Available Balance</p>
                <div className="balance-amount">
                  <span className="balance-icon">₹</span>
                  <span className="amount-text">25,000</span>
                </div>
                <p className="balance-subtitle">Ready to invest in your dream property</p>
              </div>

              {/* Custom Amount Input */}
              <div className="search-form-group">
                <label className="search-label">Custom Amount</label>
                <div className="search-input-wrapper">
                  <span className="input-icon">₹</span>
                  <input
                    type="number"
                    className="search-white-input"
                    placeholder="Enter amount"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Top-up Button */}
              <button 
                className="search-btn-orange" 
                onClick={handleTopUp}
              >
                Top-up Now
              </button>

              {/* Wallet Stats */}
              <div className="wallet-stats">
                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <FaDollarSign />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Invested</span>
                    <strong className="stat-value">$125,000</strong>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <FaHome />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Properties Owned</span>
                    <strong className="stat-value">3</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Overlay */}
        {showFilter && (
          <div className="filter-overlay">
            <div className="filter-container">
              {/* Header */}
              <div className="filter-header">
                <h2>Filter</h2>
                <button onClick={closeFilter} className="close-btn">×</button>
              </div>

              <div className="filter-content">
                {/* Type of Place */}
                <div className="filter-section">
                  <h3>Type of Place</h3>
                  <p className="section-subtitle">Search rooms, entire homes, or any type of place.</p>
                  <div className="place-types">
                    <div className="place-card">
                      <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" alt="Entire Place" />
                      <div className="place-info">
                        <h4>Entire Place</h4>
                        <p>A place all to yourself</p>
                      </div>
                    </div>
                    <div className="place-card">
                      <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" alt="Room" />
                      <div className="place-info">
                        <h4>Room</h4>
                        <p>Your own room, plus shared spaces</p>
                      </div>
                    </div>
                    <div className="place-card">
                      <img src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&q=80" alt="Shared Room" />
                      <div className="place-info">
                        <h4>Shared Room</h4>
                        <p>Shared sleeping space</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rooms And Beds */}
                <div className="filter-section">
                  <h3>Rooms And Beds</h3>
                  
                  <div className="counter-group">
                    <div className="counter-item">
                      <div className="counter-label">
                        <FaBed className="icon" />
                        <div>
                          <h4>Bedrooms</h4>
                          <p>Select your room for your family</p>
                        </div>
                      </div>
                      <div className="counter-controls">
                        <button onClick={() => decrement('bedrooms')}>−</button>
                        <span>{counters.bedrooms}</span>
                        <button onClick={() => increment('bedrooms')}>+</button>
                      </div>
                    </div>

                    <div className="counter-item">
                      <div className="counter-label">
                        <Sofa className="icon" />
                        <div>
                          <h4>Dining</h4>
                          <p>Select dining space</p>
                        </div>
                      </div>
                      <div className="counter-controls">
                        <button onClick={() => decrement('dining')}>−</button>
                        <span>{counters.dining}</span>
                        <button onClick={() => increment('dining')}>+</button>
                      </div>
                    </div>

                    <div className="counter-item">
                      <div className="counter-label">
                        <FaBath className="icon" />
                        <div>
                          <h4>Bathrooms</h4>
                          <p>Select number of bathrooms</p>
                        </div>
                      </div>
                      <div className="counter-controls">
                        <button onClick={() => decrement('bathrooms')}>−</button>
                        <span>{counters.bathrooms}</span>
                        <button onClick={() => increment('bathrooms')}>+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="filter-section">
                  <h3>Price Range</h3>
                  <p className="section-subtitle">The average nightly price is ₹200000</p>
                  <div className="price-slider">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="slider"
                    />
                  </div>
                  <div className="price-values">
                    <div>
                      <label>Minimum</label>
                      <p className="price">₹{priceRange[0]}</p>
                    </div>
                    <div>
                      <label>Maximum</label>
                      <p className="price">₹{priceRange[1]}</p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="filter-section">
                  <h3>Amenities</h3>
                  <div className="amenities-grid">
                    <div className="amenity-item">
                      <FaHome className="amenity-icon" />
                      <div>
                        <h4>Instant Book</h4>
                        <p>Listings you can book without waiting</p>
                      </div>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={selectedAmenities.furnished}
                          onChange={() => toggleAmenity('furnished')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="amenity-item">
                      <FaHome className="amenity-icon" />
                      <div>
                        <h4>Self Check-In</h4>
                        <p>Easy access to the property</p>
                      </div>
                      <label className="toggle">
                        <input 
                          type="checkbox"
                          checked={selectedAmenities.petAllowed}
                          onChange={() => toggleAmenity('petAllowed')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="amenity-item">
                      <Dog className="amenity-icon" />
                      <div>
                        <h4>Allows Pets</h4>
                        <p>Bringing a service animal?</p>
                      </div>
                      <label className="toggle">
                        <input 
                          type="checkbox"
                          checked={selectedAmenities.parkingSlot}
                          onChange={() => toggleAmenity('parkingSlot')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="filter-section">
                  <h3>Facilities</h3>
                  <div className="facilities-grid">
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.furnished}
                        onChange={() => toggleFacility('furnished')}
                      />
                      <span className="checkmark">✓</span>
                      <Sofa size={20} className="facility-icon" />
                      <span>Furnished</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.petAllowed}
                        onChange={() => toggleFacility('petAllowed')}
                      />
                      <span className="checkmark">✓</span>
                      <Dog size={20} className="facility-icon" />
                      <span>Pet Allowed</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.parkingSlot}
                        onChange={() => toggleFacility('parkingSlot')}
                      />
                      <span className="checkmark">✓</span>
                      <Car size={20} className="facility-icon" />
                      <span>Parking Slot</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.kitchen}
                        onChange={() => toggleFacility('kitchen')}
                      />
                      <span className="checkmark">✓</span>
                      <UtensilsCrossed size={20} className="facility-icon" />
                      <span>Kitchen</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.wifi}
                        onChange={() => toggleFacility('wifi')}
                      />
                      <span className="checkmark">✓</span>
                      <Wifi size={20} className="facility-icon" />
                      <span>WiFi</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.ac}
                        onChange={() => toggleFacility('ac')}
                      />
                      <span className="checkmark">✓</span>
                      <Snowflake size={20} className="facility-icon" />
                      <span>Air Conditioning</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.swimmingPool}
                        onChange={() => toggleFacility('swimmingPool')}
                      />
                      <span className="checkmark">✓</span>
                      <Waves size={20} className="facility-icon" />
                      <span>Swimming Pool</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.gym}
                        onChange={() => toggleFacility('gym')}
                      />
                      <span className="checkmark">✓</span>
                      <Dumbbell size={20} className="facility-icon" />
                      <span>Gym</span>
                    </label>
                    <label className="facility-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.security}
                        onChange={() => toggleFacility('security')}
                      />
                      <span className="checkmark">✓</span>
                      <Lock size={20} className="facility-icon" />
                      <span>24/7 Security</span>
                    </label>
                  </div>
                </div>

                {/* Property Type Tags */}
                <div className="filter-section">
                  <h3>Property Type</h3>
                  <div className="tag-group">
                    <span className="tag">City <button>×</button></span>
                    <span className="tag">House <button>×</button></span>
                    <span className="tag">Residential <button>×</button></span>
                    <span className="tag">Apartment</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                  <button onClick={handleReset} className="btn-clear">Clear All</button>
                  <button onClick={handleFilterSearch} className="btn-apply">Apply Filters</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Property Listings Section */}
        <div className="property-listings-section">
          {/* Filter Button */}
          <button className="open-filter-btn" onClick={openFilter}>
            <span>Open Filters</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 5h10M3 8h6M3 11h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {user && user.role === 'broker' && (
            <button
              className="add-property-btn-broker"
              onClick={() => navigate('/broker/add-property')}
            >
              <FaPlus />
              <span>List Your Property</span>
            </button>
          )}

          {/* Properties Container */}
          <div className="properties-container-modern">
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <h2>Loading properties...</h2>
                <p>Please wait while we fetch the best options for you</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="no-results-modern">
                <h2>No Properties Found</h2>
                <p>Try adjusting your filters to discover more amazing properties</p>
                <button onClick={handleReset} className="reset-btn-large">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Properties Header */}
                <div className="properties-header">
                  <h2 className="properties-header-title">More Than Properties<br />We Deliver Prestige</h2>
                  <button onClick={() => navigate('/properties')} className="view-all-properties-btn">
                    <span>View all Property</span>
                    <span className="arrow-icon">→</span>
                  </button>
                </div>

                {/* Properties Grid */}
                <div className="properties-grid-modern">
                  {properties.map((property) => (
                    <div
                      key={property._id}
                      className="property-card-modern"
                      onClick={() => handlePropertyClick(property._id)}
                    >
                      {/* Property Image */}
                      <div className="property-image-container">
                        <img src={property.image} alt={property.title} />
                        
                        {/* Title Overlay */}
                        <h3 className="property-title-overlay">
                          {property.type || 'Luminous Urban Abode'}
                        </h3>

                        {/* Info Card */}
                        <div className="property-info-card">
                          <h4 className="property-info-title">Property Details</h4>
                          <p className="property-info-description">
                            {property.description || 'A peaceful escape with sweeping views'}
                          </p>

                          {/* Stats Grid */}
                          <div className="property-stats">
                            <div className="property-stat-item">
                              <span className="property-stat-value">{property.area || '645'}</span>
                              <span className="property-stat-unit">sq.m</span>
                              <span className="property-stat-label">Total Area</span>
                            </div>
                            <div className="property-stat-item">
                              <span className="property-stat-value">{property.bedrooms}</span>
                              <span className="property-stat-unit">-</span>
                              <span className="property-stat-value">{property.bathrooms}</span>
                              <span className="property-stat-label">Bed-Bath</span>
                            </div>
                            <div className="property-stat-item">
                              <span className="property-stat-value">{new Date().getFullYear()}</span>
                              <span className="property-stat-label">Year Built</span>
                            </div>
                          </div>

                          {/* Learn More Button */}
                          <button className="learn-more-btn">
                            <span>Learn more</span>
                            <span className="learn-more-icon">↗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination-modern">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
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
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tailored Solutions Section */}
        <div className="tailored-solutions-section">
          <div className="tailored-solutions-container">
            <h2 className="tailored-solutions-title">Tailored Solutions For Every Move</h2>
            <div className="solutions-grid">
              <div className="solution-card" onClick={() => navigate('/buying')}>
                <div className="solution-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="Start Buying" className="solution-image" />
                  <div className="solution-overlay"></div>
                  <h3 className="solution-title">Start Buying</h3>
                </div>
              </div>
              <div className="solution-card" onClick={() => navigate('/selling')}>
                <div className="solution-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80" alt="Start Selling" className="solution-image" />
                  <div className="solution-overlay"></div>
                  <h3 className="solution-title">Start Selling</h3>
                </div>
              </div>
              <div className="solution-card" onClick={() => navigate('/renting')}>
                <div className="solution-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80" alt="Start Renting" className="solution-image" />
                  <div className="solution-overlay"></div>
                  <h3 className="solution-title">Start Renting</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Find Section */}
        <div className="ready-to-find-section">
          <div className="ready-to-find-container">
            <div className="ready-to-find-content">
              <div className="ready-left">
                <p className="ready-subtitle">(06) Ready to Find Your Next Home?</p>
                <div className="ready-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" 
                    alt="Modern House" 
                    className="ready-house-image" 
                  />
                </div>
              </div>
              <div className="ready-right">
                <h2 className="ready-title">
                  Whether you're buying, browsing, or just getting started — Propify makes it easy to take the next step with confidence.
                </h2>
                <button onClick={handleBookTour} className="book-tour-btn">
                  <span>Book A Tour</span>
                  <span className="arrow-circle">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section-orange">
          <div className="cta-content-wrapper">
            <div className="cta-text">
              <span>Find Your Home</span>
              <span className="cta-arrow">→</span>
              <span className="cta-button-text" onClick={() => navigate('/get-started')}>
                Get Started
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer-section-dark">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="footer-logo">
                  <span className="footer-logo-text">PROPIFY</span>
                </div>
                <p className="footer-description">
                  Helping you discover and secure your dream property with ease, expertise, and unmatched service.
                </p>
              </div>

              <div className="footer-column">
                <h3>Navigation</h3>
                <ul className="footer-links">
                  <li onClick={() => navigate('/')}>Home</li>
                  <li onClick={() => navigate('/about')}>About Us</li>
                  <li onClick={() => navigate('/properties')}>Property</li>
                  <li onClick={() => navigate('/events')}>Event</li>
                  <li onClick={() => navigate('/contact')}>Contact Us</li>
                </ul>
              </div>

              <div className="footer-column">
                <h3>Resource</h3>
                <ul className="footer-links">
                  <li onClick={() => navigate('/blog')}>Blog</li>
                  <li onClick={() => navigate('/blog/details')}>Blog Details</li>
                  <li onClick={() => navigate('/property/details')}>Property Details</li>
                  <li onClick={() => navigate('/faqs')}>FAQs</li>
                  <li onClick={() => navigate('/reviews')}>Reviews</li>
                </ul>
              </div>

              <div className="footer-column">
                <h3>Newsletter</h3>
                <div className="footer-newsletter">
                  <p>Subscribe to get latest updates</p>
                  <form onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      className="newsletter-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="newsletter-button">Subscribe</button>
                  </form>
                  <ul className="footer-links">
                    <li onClick={() => navigate('/privacy')}>Privacy Policy</li>
                    <li onClick={() => navigate('/help')}>Help Center</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <ul className="footer-links-bottom">
                <li onClick={() => navigate('/terms')}>Terms of Service</li>
                <li onClick={() => navigate('/privacy')}>Privacy Policy</li>
                <li onClick={() => navigate('/cookies')}>Cookies</li>
              </ul>
              
              <div className="footer-social">
                <span className="footer-social-icon" onClick={() => handleSocialClick('facebook')}>f</span>
                <span className="footer-social-icon" onClick={() => handleSocialClick('twitter')}>𝕏</span>
                <span className="footer-social-icon" onClick={() => handleSocialClick('instagram')}>in</span>
              </div>
            </div>

            <div className="footer-copyright">
              <p>©2026 PROPIFY, Designed by <a href="#">Arnab</a></p>
            </div>
          </div>
        </footer>
      </PageTransition>
    </>
  );
};

export default Properties;