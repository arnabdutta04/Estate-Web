import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaHome, FaBed, FaBath, FaRulerCombined, FaDollarSign, FaPlus, FaMinus } from 'react-icons/fa';
import './Properties.css';
import { 
  Sofa, Dog, Car, UtensilsCrossed, Wifi, Snowflake, 
  Waves, Lock, Dumbbell, Building2, Home, TreePine, 
  Crown, ShoppingCart, Receipt 
} from 'lucide-react';
import { indianCities } from '../utils/cities';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('rent');
  
  // Updated price range state - manual input
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Property type state
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  
  // Purchase method
  const [purchaseMethod, setPurchaseMethod] = useState('rent'); // 'rent' or 'buy'
  
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
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
    bedrooms: 0,
    dining: 0,
    bathrooms: 0
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

  // Property types with icons
  const propertyTypes = [
    { value: 'residential', label: 'Residential', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: Building2 },
    { value: 'land', label: 'Land & Plot', icon: TreePine },
    { value: 'luxury', label: 'Luxury', icon: Crown }
  ];

  // Dynamic amenities based on property type
  const getAmenitiesForType = (type) => {
    const commonAmenities = [
      { key: 'parkingSlot', label: 'Parking', icon: Car },
      { key: 'wifi', label: 'WiFi', icon: Wifi },
      { key: 'security', label: '24/7 Security', icon: Lock }
    ];

    const typeSpecificAmenities = {
      residential: [
        { key: 'furnished', label: 'Furnished', icon: Sofa },
        { key: 'petAllowed', label: 'Pet Allowed', icon: Dog },
        { key: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
        { key: 'ac', label: 'AC', icon: Snowflake },
        { key: 'swimmingPool', label: 'Swimming Pool', icon: Waves },
        { key: 'gym', label: 'Gym', icon: Dumbbell }
      ],
      commercial: [
        { key: 'furnished', label: 'Furnished Office', icon: Sofa },
        { key: 'ac', label: 'Central AC', icon: Snowflake },
        { key: 'elevator', label: 'Elevator', icon: Building2 },
        { key: 'conference', label: 'Conference Room', icon: Building2 }
      ],
      land: [
        { key: 'gated', label: 'Gated Community', icon: Lock },
        { key: 'waterSupply', label: 'Water Supply', icon: Waves },
        { key: 'electricity', label: 'Electricity', icon: Building2 }
      ],
      luxury: [
        { key: 'furnished', label: 'Premium Furnished', icon: Sofa },
        { key: 'petAllowed', label: 'Pet Allowed', icon: Dog },
        { key: 'kitchen', label: 'Modular Kitchen', icon: UtensilsCrossed },
        { key: 'ac', label: 'Central AC', icon: Snowflake },
        { key: 'swimmingPool', label: 'Private Pool', icon: Waves },
        { key: 'gym', label: 'Private Gym', icon: Dumbbell },
        { key: 'homeTheater', label: 'Home Theater', icon: Crown },
        { key: 'spa', label: 'Spa', icon: Crown }
      ]
    };

    return [...commonAmenities, ...(typeSpecificAmenities[type] || [])];
  };

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
      propertyType: 'residential',
      listingType: 'rent',
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
      propertyType: 'residential',
      listingType: 'rent',
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
      propertyType: 'residential',
      listingType: 'sale',
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
      propertyFor: purchaseMethod,
      keyword: searchKeyword,
      city: selectedLocation,
      propertyType: selectedPropertyType,
      style: selectedStyle,
      minPrice: minPrice,
      maxPrice: maxPrice,
      bedrooms: counters.bedrooms > 0 ? counters.bedrooms : '',
      bathrooms: counters.bathrooms > 0 ? counters.bathrooms : '',
      facilities: Object.keys(selectedFacilities).filter(key => selectedFacilities[key])
    };

    // Filter mock properties for demo
    const filtered = mockProperties.filter(property => {
      let matches = true;
      
      // Purchase method filter
      if (purchaseMethod === 'rent' && property.listingType !== 'rent') {
        matches = false;
      }
      if (purchaseMethod === 'buy' && property.listingType !== 'sale') {
        matches = false;
      }
      
      // Property type filter
      if (selectedPropertyType && property.propertyType !== selectedPropertyType) {
        matches = false;
      }
      
      // Keyword filter
      if (filterParams.keyword && !property.title.toLowerCase().includes(filterParams.keyword.toLowerCase())) {
        matches = false;
      }
      
      // Price filter
      if (minPrice && property.price < parseFloat(minPrice)) {
        matches = false;
      }
      if (maxPrice && property.price > parseFloat(maxPrice)) {
        matches = false;
      }
      
      // Bedroom filter
      if (counters.bedrooms > 0 && property.bedrooms < counters.bedrooms) {
        matches = false;
      }
      
      // Bathroom filter
      if (counters.bathrooms > 0 && property.bathrooms < counters.bathrooms) {
        matches = false;
      }
      
      return matches;
    });

    setProperties(filtered);
    setShowFilter(false);
    
    // For real API call
    fetchProperties(filterParams);
  };

  const handleCityInputFocus = () => {
    if (cityInput.length === 0) {
      setCitySuggestions(cities);
      setShowCitySuggestions(true);
    }
  };

  const handleCitySelect = (city) => {
    setCityInput(city);
    setSelectedLocation(city);
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
    setMinPrice('');
    setMaxPrice('');
    setSelectedBedrooms('');
    setSelectedBathrooms('');
    setSearchKeyword('');
    setSelectedLocation('');
    setSelectedPropertyType('');
    setSelectedStyle('');
    setPurchaseMethod('rent');
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
      bedrooms: 0,
      dining: 0,
      bathrooms: 0
    });
    fetchProperties({});
  };

  const handlePageChange = (page) => {
    fetchProperties(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <h2>Filter Properties</h2>
                <button onClick={closeFilter} className="close-btn">×</button>
              </div>

              <div className="filter-content">
                {/* Purchase Method */}
                <div className="filter-section">
                  <h3>I Want To</h3>
                  <div className="purchase-method-tabs">
                    <button
                      className={`method-tab ${purchaseMethod === 'rent' ? 'active' : ''}`}
                      onClick={() => setPurchaseMethod('rent')}
                    >
                      <Receipt className="tab-icon" />
                      <span>Rent</span>
                    </button>
                    <button
                      className={`method-tab ${purchaseMethod === 'buy' ? 'active' : ''}`}
                      onClick={() => setPurchaseMethod('buy')}
                    >
                      <ShoppingCart className="tab-icon" />
                      <span>Buy</span>
                    </button>
                  </div>
                </div>

                {/* Property Type */}
                <div className="filter-section">
                  <h3>Property Type</h3>
                  <p className="section-subtitle">Select the type of property you're looking for</p>
                  <div className="property-type-grid">
                    {propertyTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          className={`property-type-card ${selectedPropertyType === type.value ? 'selected' : ''}`}
                          onClick={() => setSelectedPropertyType(selectedPropertyType === type.value ? '' : type.value)}
                        >
                          <IconComponent className="property-type-icon" size={32} />
                          <span className="property-type-label">{type.label}</span>
                          {selectedPropertyType === type.value && (
                            <span className="selected-check">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div className="filter-section">
                  <h3>Location</h3>
                  <div className="search-form-group" ref={cityDropdownRef}>
                    <label className="search-label">City</label>
                    <input
                      type="text"
                      className="search-white-input"
                      placeholder="Search city..."
                      value={cityInput}
                      onChange={handleCityInputChange}
                      onFocus={handleCityInputFocus}
                    />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                      <div className="city-suggestions-dropdown">
                        {citySuggestions.slice(0, 10).map((city, index) => (
                          <div
                            key={index}
                            className="city-suggestion-item"
                            onClick={() => handleCitySelect(city)}
                          >
                            {city}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Range - Manual Input */}
                <div className="filter-section">
                  <h3>Price Range</h3>
                  <p className="section-subtitle">
                    Enter your budget {purchaseMethod === 'rent' ? 'per month' : 'range'}
                  </p>
                  <div className="price-inputs-row">
                    <div className="price-input-group">
                      <label className="search-label">Minimum Price</label>
                      <div className="search-input-wrapper">
                        <span className="input-icon">₹</span>
                        <input
                          type="number"
                          className="search-white-input"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="price-separator">—</div>
                    <div className="price-input-group">
                      <label className="search-label">Maximum Price</label>
                      <div className="search-input-wrapper">
                        <span className="input-icon">₹</span>
                        <input
                          type="number"
                          className="search-white-input"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
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
                          <p>Minimum bedrooms required</p>
                        </div>
                      </div>
                      <div className="counter-controls">
                        <button onClick={() => decrement('bedrooms')} disabled={counters.bedrooms === 0}>
                          <FaMinus />
                        </button>
                        <span>{counters.bedrooms === 0 ? 'Any' : counters.bedrooms}</span>
                        <button onClick={() => increment('bedrooms')}>
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    <div className="counter-item">
                      <div className="counter-label">
                        <FaBath className="icon" />
                        <div>
                          <h4>Bathrooms</h4>
                          <p>Minimum bathrooms required</p>
                        </div>
                      </div>
                      <div className="counter-controls">
                        <button onClick={() => decrement('bathrooms')} disabled={counters.bathrooms === 0}>
                          <FaMinus />
                        </button>
                        <span>{counters.bathrooms === 0 ? 'Any' : counters.bathrooms}</span>
                        <button onClick={() => increment('bathrooms')}>
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    {selectedPropertyType === 'residential' && (
                      <div className="counter-item">
                        <div className="counter-label">
                          <Sofa className="icon" />
                          <div>
                            <h4>Dining</h4>
                            <p>Dining space required</p>
                          </div>
                        </div>
                        <div className="counter-controls">
                          <button onClick={() => decrement('dining')} disabled={counters.dining === 0}>
                            <FaMinus />
                          </button>
                          <span>{counters.dining === 0 ? 'Any' : counters.dining}</span>
                          <button onClick={() => increment('dining')}>
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Facilities - Dynamic based on property type */}
                {selectedPropertyType && (
                  <div className="filter-section">
                    <h3>Amenities & Facilities</h3>
                    <p className="section-subtitle">
                      Select facilities for {propertyTypes.find(t => t.value === selectedPropertyType)?.label}
                    </p>
                    <div className="facilities-grid">
                      {getAmenitiesForType(selectedPropertyType).map((amenity) => {
                        const IconComponent = amenity.icon;
                        return (
                          <label key={amenity.key} className="facility-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedFacilities[amenity.key] || false}
                              onChange={() => toggleFacility(amenity.key)}
                            />
                            <span className="checkmark">✓</span>
                            <IconComponent size={20} className="facility-icon" />
                            <span>{amenity.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                        <img src={property.image || property.images?.[0]} alt={property.title} />
                        
                        {/* Property Type Badge */}
                        <div className="property-type-badge">
                          {propertyTypes.find(t => t.value === property.propertyType)?.label || 'Property'}
                        </div>

                        {/* Listing Type Badge */}
                        <div className={`listing-type-badge ${property.listingType}`}>
                          {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                        </div>
                        
                        {/* Title Overlay */}
                        <h3 className="property-title-overlay">
                          {property.title || property.type || 'Luminous Urban Abode'}
                        </h3>

                        {/* Info Card */}
                        <div className="property-info-card">
                          <h4 className="property-info-title">Property Details</h4>
                          <p className="property-info-description">
                            {property.description || 'A peaceful escape with sweeping views'}
                          </p>

                          {/* Price */}
                          <div className="property-price">
                            <span className="price-amount">₹{parseFloat(property.price).toLocaleString()}</span>
                            {property.listingType === 'rent' && <span className="price-period">/month</span>}
                          </div>

                          {/* Stats Grid */}
                          <div className="property-stats">
                            <div className="property-stat-item">
                              <span className="property-stat-value">{property.area || property.specifications?.area || '645'}</span>
                              <span className="property-stat-unit">sq.ft</span>
                              <span className="property-stat-label">Total Area</span>
                            </div>
                            <div className="property-stat-item">
                              <span className="property-stat-value">{property.bedrooms || property.specifications?.bedrooms}</span>
                              <span className="property-stat-unit">-</span>
                              <span className="property-stat-value">{property.bathrooms || property.specifications?.bathrooms}</span>
                              <span className="property-stat-label">Bed-Bath</span>
                            </div>
                            <div className="property-stat-item">
                              <span className="property-stat-value">{property.yearBuilt || new Date().getFullYear()}</span>
                              <span className="property-stat-label">Year Built</span>
                            </div>
                          </div>

                          {/* Learn More Button */}
                          <button className="learn-more-btn" onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyClick(property._id);
                          }}>
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
                      className="pagination-arrow"
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(pagination.totalPages, 8) }, (_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 4 && pagination.totalPages > 8) {
                        return <span key="ellipsis" className="pagination-ellipsis">...</span>;
                      }
                      if (pageNum > 3 && pageNum < pagination.totalPages - 2 && pagination.totalPages > 8) {
                        return null;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`pagination-page ${pagination.currentPage === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {pagination.totalPages > 8 && (
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className={`pagination-page ${pagination.currentPage === pagination.totalPages ? 'active' : ''}`}
                      >
                        {pagination.totalPages}
                      </button>
                    )}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="pagination-arrow"
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