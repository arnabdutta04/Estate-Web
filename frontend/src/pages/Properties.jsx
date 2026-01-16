import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaHome, FaBed, FaBath, FaRulerCombined, FaDollarSign, FaPlus, FaMinus, FaPaw } from 'react-icons/fa';
import './Properties.css';
import { Sofa, Dog, Car, UtensilsCrossed, Wifi, Snowflake, Waves, Lock ,Dumbbell, Key, Smartphone, ShowerHead, } from 'lucide-react';
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
    parkingSlot: false,
    kitchen: false
  });
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [showFilter, setShowFilter] = useState(false);

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
  const cityDropdownRef = useRef(null);

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
  ];

  const mockProperties = [
    {
      _id: '1',
      title: 'Duplex in La Plata',
      price: 1209,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      bedrooms: 1.2,
      bathrooms: 2,
      area: 75,
      parking: true,
      lat: 40.7128,
      lng: -74.0060
    },
    {
      _id: '2',
      title: 'Sudirman Park Apartment',
      price: 1209,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
      bedrooms: 1.2,
      bathrooms: 1,
      area: 75,
      parking: true,
      lat: 40.7228,
      lng: -74.0160
    },
    {
      _id: '3',
      title: 'PIK Apart Complex',
      price: 1209,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      bedrooms: 1.2,
      bathrooms: 2,
      area: 75,
      parking: true,
      lat: 40.7328,
      lng: -74.0260
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
      if (filterParams.city && property.city !== filterParams.city) {
        matches = false;
      }
      if (filterParams.propertyType && property.propertyType !== filterParams.propertyType) {
        matches = false;
      }
      if (property.price < filterParams.minPrice || property.price > filterParams.maxPrice) {
        matches = false;
      }
      if (filterParams.bedrooms && property.bedrooms && property.bedrooms.toString() !== filterParams.bedrooms) {
        matches = false;
      }
      if (filterParams.bathrooms && property.bathrooms && property.bathrooms.toString() !== filterParams.bathrooms) {
        matches = false;
      }

      return matches;
    });

    setProperties(filtered);
    setShowFilter(false);
    console.log('Applied Filters:', filterParams);
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

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className='properties-page-modern'>
          {/* Hero Section with Search Card */}
          <div className='properties-hero-modern'>
            <div className='hero-overlay'></div>

            {/* Left Side - Hero Content */}
            <div className='hero-left-content'>
              <h1 className='hero-title-serif'>
                Buy & Rent<br />Property
              </h1>
              <button className='explore-btn' onClick={() => navigate('/properties')}>
                Explore All Property
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Right Side - Top-up Card */}
            <div className='search-card-container'>
              <div className='search-card-white'>
                <h2 className='search-card-title'>
                  Your Wallet Balance
                </h2>

                {/* Current Balance Display */}
                <div className='balance-display'>
                  <label className='search-label'>Available Balance</label>
                  <div className='balance-amount'>
                    <FaDollarSign className='balance-icon' />
                    <span className='amount-text'>25,000</span>
                  </div>
                  <p className='balance-subtitle'>Ready to invest in your dream property</p>
                </div>

                {/* Custom Amount Input */}
                <div className='search-form-group'>
                  <label className='search-label'>Custom Amount</label>
                </div>

                {/* Top-up Button */}
                <button className='search-btn-orange' onClick={() => navigate('/profile')}>
                  Top-up Now
                </button>

                {/* Quick Stats */}
                <div className='wallet-stats'>
                  <div className='stat-item'>
                    <div className='stat-icon-wrapper'>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className='stat-info'>
                      <span className='stat-label'>Total Invested</span>
                      <span className='stat-value'>$125,000</span>
                    </div>
                  </div>
                  <div className='stat-item'>
                    <div className='stat-icon-wrapper'>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className='stat-info'>
                      <span className='stat-label'>Properties Owned</span>
                      <span className='stat-value'>3</span>
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
        <button className="close-btn" onClick={closeFilter}>×</button>
      </div>

      <div className="filter-content">
        {/* Type of Place */}
        <section className="filter-section">
          <h3>Type of Place</h3>
          <p className="section-subtitle">Search rooms, entire homes, or any type of place.</p>
          <div className="place-types">
            <div className="place-card">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" alt="Type Of Place" />
              <div className="place-info">
                <h4>Type Of Place</h4>
                <p>A place all to yourself</p>
              </div>
            </div>
            <div className="place-card">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" alt="Room" />
              <div className="place-info">
                <h4>Room</h4>
                <p>Your own room, plus access to shared spaces</p>
              </div>
            </div>
            <div className="place-card">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80" alt="Shared Room" />
              <div className="place-info">
                <h4>Shared Room</h4>
                <p>Your own room, plus access to shared spaces</p>
              </div>
            </div>
          </div>
        </section>

        <div className="filter-row">
          {/* Rooms And Beds */}
          <section className="filter-section half-width">
            <h3>Rooms And Beds</h3>

            <div className="counter-group">
              <div className="counter-item">
                <div className="counter-label">
                  <Sofa className="facility-icon" size={24} />
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
                  <UtensilsCrossed className="icon" size={24} />
                  <div>
                    <h4>Dining</h4>
                    <p>Select your room for your family</p>
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
                  <ShowerHead className="icon" size={24} />
                  <div>
                    <h4>Bathrooms</h4>
                    <p>Select your room for your family</p>
                  </div>
                </div>
                <div className="counter-controls">
                  <button onClick={() => decrement('bathrooms')}>−</button>
                  <span>{counters.bathrooms}</span>
                  <button onClick={() => increment('bathrooms')}>+</button>
                </div>
              </div>
            </div>
          </section>

          {/* Price Range */}
          <section className="filter-section half-width">
            <h3>Price Range</h3>
            <p className="section-subtitle">The average nightly price is ₹200000</p>

            <div className="price-slider">
              <input
                type="range"
                min="300000"
                max="67000000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="slider"
              />
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
          </section>
        </div>

        {/* Amenities */}
        <section className="filter-section">
          <h3>Amenities</h3>

          <div className="amenities-grid">
            <div className="amenity-item">
              <Smartphone className="amenity-icon" size={24} />
              <div>
                <h4>Instant Book</h4>
                <p>Listings you can book without waiting for Host approval</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="amenity-item">
              <Key className="amenity-icon" size={24} />
              <div>
                <h4>Self Check-In</h4>
                <p>Easy access to the property once you arrive</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="amenity-item">
              <FaPaw className="amenity-icon" size={24} />
              <div>
                <h4>Allows Pets</h4>
                <p>Will Bringing a service animal?</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="filter-section">
          <h3>Facilities</h3>

          <div className="facilities-grid">
            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.furnished}
                onChange={() => toggleFacility('furnished')}
              />
              <span className="checkmark">✓</span>
              <Sofa className="facility-icon" size={24} />
              <span>Furnished</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.petAllowed}
                onChange={() => toggleFacility('petAllowed')}
              />
              <span className="checkmark">✓</span>
              <Dog className="facility-icon" size={24} />
              <span>Pet Allowed</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.parkingSlot}
                onChange={() => toggleFacility('parkingSlot')}
              />
              <span className="checkmark">✓</span>
              <Car className="facility-icon" size={24} />
              <span>Parking Slot</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.kitchen}
                onChange={() => toggleFacility('kitchen')}
              />
              <span className="checkmark">✓</span>
              <UtensilsCrossed className="facility-icon" size={24} />
              <span>Kitchen</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.wifi}
                onChange={() => toggleFacility('wifi')}
              />
              <span className="checkmark">✓</span>
              <Wifi className="facility-icon" size={24} />
              <span>WiFi</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.ac}
                onChange={() => toggleFacility('ac')}
              />
              <span className="checkmark">✓</span>
              <Snowflake className="facility-icon" size={24} />
              <span>Air Conditioning</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.swimmingPool}
                onChange={() => toggleFacility('swimmingPool')}
              />
              <span className="checkmark">✓</span>
              <Waves className="facility-icon" size={24} />
              <span>Swimming Pool</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.gym}
                onChange={() => toggleFacility('gym')}
              />
              <span className="checkmark">✓</span>
              <Dumbbell className="facility-icon" size={24} />
              <span>Gym</span>
            </label>

            <label className="facility-checkbox">
              <input
                type="checkbox"
                checked={selectedFacilities.security}
                onChange={() => toggleFacility('security')}
              />
              <span className="checkmark">✓</span>
              <Lock className="facility-icon" size={24} />
              <span>24/7 Security</span>
            </label>
          </div>
        </section>

        {/* Property Type Tags */}
        <section className="filter-section">
          <h3>Property Type</h3>
          <div className="tag-group">
            <span className="tag active">City <button>×</button></span>
            <span className="tag">House <button>×</button></span>
            <span className="tag">Residential <button>×</button></span>
            <span className="tag">Apartment</span>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button className="btn-clear" onClick={handleReset}>Clear All</button>
          <button className="btn-apply" onClick={handleFilterSearch}>Apply Filters</button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Property Listings Section - NO MAP */}
<div className='property-listings-section'>
  {/* Filter Button - Centered */}
  <button className='open-filter-btn' onClick={openFilter}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    Open Filters
  </button>

  {/* Properties Container */}
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

        {/* Properties Grid */}
        <div className='properties-grid-modern'>
          {properties.map((property, index) => (
            <div key={property._id} className='property-card-modern'>
              <div className='property-image-container'>
                <img src={property.image} alt={property.title} />
                <h3 className='property-title-overlay'>{property.title}</h3>
                
                <div className='property-info-card'>
                  <h4 className='property-info-title'>{property.type || 'Luminous Urban Abode'}</h4>
                  <p className='property-info-description'>
                    {property.description || 'A peaceful escape with sweeping views of the bustling city'}
                  </p>
                  
                  <div className='property-stats'>
                    <div className='property-stat-item'>
                      <span className='property-stat-value'>
                        {property.area || '645'}
                        <span className='property-stat-unit'>sq.m.</span>
                      </span>
                      <span className='property-stat-label'>Total area</span>
                    </div>
                    <div className='property-stat-item'>
                      <span className='property-stat-value'>{property.bedrooms}-{property.bathrooms}</span>
                      <span className='property-stat-label'>Room</span>
                    </div>
                    <div className='property-stat-item'>
                      <span className='property-stat-value'>{new Date().getFullYear()}</span>
                      <span className='property-stat-label'>Year</span>
                    </div>
                  </div>
                  
                  <button className='learn-more-btn'>
                    <span>Learn more</span>
                    <div className='learn-more-icon'>↗</div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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

      {/* Ready to Find Section */}
      <section className="ready-to-find-section">
        <div className="ready-to-find-container">
          <div className="ready-to-find-content">
            <div className="ready-left">
              <p className="ready-subtitle">(06) Ready to Find Your Next Home?</p>
              <div className="ready-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                  alt="Modern luxury home"
                  className="ready-house-image"
                />
              </div>
            </div>
            <div className="ready-right">
              <h2 className="ready-title">
                Whether you're buying, browsing, or just getting started — Propify makes it easy to take the next step with confidence.
              </h2>
              <button className="book-tour-btn">
                <span className="arrow-circle">→</span>
                Book A Tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Orange */}
      <div className='cta-section-orange'>
        <div className='cta-content-wrapper'>
          <svg className='cta-icon' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8L8 24v24h16V32h16v16h16V24L32 8z" fill="currentColor" />
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
                  <path d="M32 8L8 24v24h16V32h16v16h16V24L32 8z" fill="currentColor" />
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