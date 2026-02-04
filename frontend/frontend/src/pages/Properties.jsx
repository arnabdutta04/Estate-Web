import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaHome, FaBed, FaBath, FaRulerCombined, FaDollarSign, FaPlus, FaMinus, FaPaw } from 'react-icons/fa';
import './Properties.css';
import { Sofa, Dog, Car, UtensilsCrossed, Wifi, Snowflake, Waves, Lock, Dumbbell, Key, Smartphone, ShowerHead } from 'lucide-react';
import { indianCities, searchCities } from '../utils/cities';

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
      bedrooms: 1.2,
      bathrooms: 2,
      area: 75,
      parking: true,
      lat: 40.7128,
      lng: -74.0060,
      type: 'Luxury Duplex',
      description: 'Modern duplex with stunning views'
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
      lng: -74.0160,
      type: 'Urban Apartment',
      description: 'Cozy apartment in prime location'
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
      lng: -74.0260,
      type: 'Complex',
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

  // New functional handlers
  const handleTopUp = () => {
    if (walletAmount && parseFloat(walletAmount) > 0) {
      alert(`Top-up successful! Amount: ₹${walletAmount}`);
      // Add API call here to process top-up
      setWalletAmount('');
    } else {
      alert('Please enter a valid amount');
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with email: ${email}`);
      // Add API call here to subscribe
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
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    };
    window.open(socialLinks[platform], '_blank');
  };

  return (
    <>
      <PageTransition>
        <Navbar />
        
        {/* Hero Section with Search Card */}
        <div className="hero-section">
          {/* Left Side - Hero Content */}
          <div className="hero-content">
            <h1 className="hero-title">Buy & Rent Property</h1>
            <button 
              className="explore-btn" 
              onClick={() => navigate('/properties')}
            >
              Explore All Property
            </button>
          </div>

          {/* Right Side - Top-up Card */}
          <div className="wallet-card">
            <h3>Your Wallet Balance</h3>
            {/* Current Balance Display */}
            <div className="balance-display">
              <p className="balance-label">Available Balance</p>
              <h2 className="balance-amount">₹25,000</h2>
              <p className="balance-subtitle">Ready to invest in your dream property</p>
            </div>

            {/* Custom Amount Input */}
            <div className="custom-amount">
              <label>Custom Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
              />
            </div>

            {/* Top-up Button */}
            <button 
              className="topup-btn" 
              onClick={handleTopUp}
            >
              Top-up Now
            </button>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-item">
                <span>Total Invested</span>
                <strong>$125,000</strong>
              </div>
              <div className="stat-item">
                <span>Properties Owned</span>
                <strong>3</strong>
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

              {/* Type of Place */}
              <div className="filter-section">
                <h3>Type of Place</h3>
                <p>Search rooms, entire homes, or any type of place.</p>
                <div className="place-types">
                  <div className="place-type-card">
                    <FaHome />
                    <div>
                      <h4>Type Of Place</h4>
                      <p>A place all to yourself</p>
                    </div>
                  </div>
                  <div className="place-type-card">
                    <FaBed />
                    <div>
                      <h4>Room</h4>
                      <p>Your own room, plus access to shared spaces</p>
                    </div>
                  </div>
                  <div className="place-type-card">
                    <Sofa />
                    <div>
                      <h4>Shared Room</h4>
                      <p>Your own room, plus access to shared spaces</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rooms And Beds */}
              <div className="filter-section">
                <h3>Rooms And Beds</h3>
                
                <div className="counter-group">
                  <div className="counter-item">
                    <h4>Bedrooms</h4>
                    <p>Select your room for your family</p>
                    <div className="counter-controls">
                      <button onClick={() => decrement('bedrooms')}>−</button>
                      <span>{counters.bedrooms}</span>
                      <button onClick={() => increment('bedrooms')}>+</button>
                    </div>
                  </div>

                  <div className="counter-item">
                    <h4>Dining</h4>
                    <p>Select your room for your family</p>
                    <div className="counter-controls">
                      <button onClick={() => decrement('dining')}>−</button>
                      <span>{counters.dining}</span>
                      <button onClick={() => increment('dining')}>+</button>
                    </div>
                  </div>

                  <div className="counter-item">
                    <h4>Bathrooms</h4>
                    <p>Select your room for your family</p>
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
                <p>The average nightly price is ₹200000</p>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="slider"
                />
                <div className="price-labels">
                  <div>
                    <span>Minimum</span>
                    <strong>₹{priceRange[0]}</strong>
                  </div>
                  <div>
                    <span>Maximum</span>
                    <strong>₹{priceRange[1]}</strong>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="filter-section">
                <h3>Amenities</h3>
                <div className="amenity-item">
                  <div>
                    <h4>Instant Book</h4>
                    <p>Listings you can book without waiting for Host approval</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedAmenities.furnished}
                    onChange={() => toggleAmenity('furnished')}
                  />
                </div>
                <div className="amenity-item">
                  <div>
                    <h4>Self Check-In</h4>
                    <p>Easy access to the property once you arrive</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={selectedAmenities.petAllowed}
                    onChange={() => toggleAmenity('petAllowed')}
                  />
                </div>
                <div className="amenity-item">
                  <div>
                    <h4>Allows Pets</h4>
                    <p>Will Bringing a service animal?</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={selectedAmenities.parkingSlot}
                    onChange={() => toggleAmenity('parkingSlot')}
                  />
                </div>
              </div>

              {/* Facilities */}
              <div className="filter-section">
                <h3>Facilities</h3>
                <div className="facilities-grid">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.furnished}
                      onChange={() => toggleFacility('furnished')}
                    />
                    <Sofa size={20} />
                    <span>✓ Furnished</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.petAllowed}
                      onChange={() => toggleFacility('petAllowed')}
                    />
                    <Dog size={20} />
                    <span>✓ Pet Allowed</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.parkingSlot}
                      onChange={() => toggleFacility('parkingSlot')}
                    />
                    <Car size={20} />
                    <span>✓ Parking Slot</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.kitchen}
                      onChange={() => toggleFacility('kitchen')}
                    />
                    <UtensilsCrossed size={20} />
                    <span>✓ Kitchen</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.wifi}
                      onChange={() => toggleFacility('wifi')}
                    />
                    <Wifi size={20} />
                    <span>✓ WiFi</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.ac}
                      onChange={() => toggleFacility('ac')}
                    />
                    <Snowflake size={20} />
                    <span>✓ Air Conditioning</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.swimmingPool}
                      onChange={() => toggleFacility('swimmingPool')}
                    />
                    <Waves size={20} />
                    <span>✓ Swimming Pool</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.gym}
                      onChange={() => toggleFacility('gym')}
                    />
                    <Dumbbell size={20} />
                    <span>✓ Gym</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.security}
                      onChange={() => toggleFacility('security')}
                    />
                    <Lock size={20} />
                    <span>✓ 24/7 Security</span>
                  </label>
                </div>
              </div>

              {/* Property Type Tags */}
              <div className="filter-section">
                <h3>Property Type</h3>
                <div className="property-tags">
                  <span className="tag">City ×</span>
                  <span className="tag">House ×</span>
                  <span className="tag">Residential ×</span>
                  <span className="tag">Apartment</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="filter-actions">
                <button onClick={handleReset} className="clear-btn">Clear All</button>
                <button onClick={handleFilterSearch} className="apply-btn">Apply Filters</button>
              </div>
            </div>
          </div>
        )}

        {/* Property Listings Section - NO MAP */}
        <div className="properties-section">
          {/* Filter Button - Centered */}
          <div className="filter-button-container">
            <button className="open-filter-btn" onClick={openFilter}>
              Open Filters
            </button>
            {user && user.role === 'broker' && (
              <button
                className="list-property-btn"
                onClick={() => navigate('/broker/add-property')}
              >
                List Your Property
              </button>
            )}
          </div>

          {/* Properties Container */}
          <div className="properties-container">
            {loading ? (
              <div className="loading-state">
                <h3>Loading properties...</h3>
                <p>Please wait while we fetch the best options for you</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="empty-state">
                <h3>No Properties Found</h3>
                <p>Try adjusting your filters to discover more amazing properties</p>
                <button onClick={handleReset} className="reset-btn">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Properties Header */}
                <div className="properties-header">
                  <h2>More Than Properties We Deliver Prestige</h2>
                  <button onClick={() => navigate('/properties')} className="view-all-btn">
                    View all Property →
                  </button>
                </div>

                {/* Properties Grid */}
                <div className="properties-grid">
                  {properties.map((property, index) => (
                    <div
                      key={property._id}
                      className="property-card"
                      onClick={() => handlePropertyClick(property._id)}
                    >
                      <div className="property-image">
                        <img src={property.image} alt={property.title} />
                      </div>
                      <div className="property-details">
                        <h3>{property.type || 'Luminous Urban Abode'}</h3>
                        <p className="property-description">
                          {property.description || 'A peaceful escape with sweeping views of the bustling city'}
                        </p>
                        <div className="property-features">
                          <div className="feature">
                            <FaRulerCombined />
                            <span>{property.area || '645'} sq.m. Total area</span>
                          </div>
                          <div className="feature">
                            <FaBed />
                            <span>{property.bedrooms}-{property.bathrooms} Room</span>
                          </div>
                          <div className="feature">
                            <span>{new Date().getFullYear()} Year</span>
                          </div>
                        </div>
                        <button className="learn-more-btn">
                          Learn more
                          <span>↗</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
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
        <div className="solutions-section">
          <h2>Tailored Solutions For Every Move</h2>
          <div className="solutions-grid">
            <button onClick={() => navigate('/buying')} className="solution-card">
              Start Buying
            </button>
            <button onClick={() => navigate('/selling')} className="solution-card">
              Start Selling
            </button>
            <button onClick={() => navigate('/renting')} className="solution-card">
              Start Renting
            </button>
          </div>
        </div>

        {/* Ready to Find Section */}
        <div className="ready-section">
          <h2>(06) Ready to Find Your Next Home?</h2>
          <p>
            Whether you're buying, browsing, or just getting started — Propify makes it easy to take the next step with confidence.
          </p>
          <button onClick={handleBookTour} className="book-tour-btn">
            → Book A Tour
          </button>
        </div>

        {/* CTA Section - Orange */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Find Your Home</h2>
            <button onClick={() => navigate('/get-started')} className="get-started-btn">
              → Get Started
            </button>
          </div>
        </div>

        {/* Footer Section - Dark */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-column">
              <h3>PROPIFY</h3>
              <p>Helping you discover and secure your dream property with ease, expertise, and unmatched service in Dubai.</p>
            </div>

            <div className="footer-column">
              <h4>Navigation</h4>
              <ul>
                <li onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</li>
                <li onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</li>
                <li onClick={() => navigate('/properties')} style={{ cursor: 'pointer' }}>Property</li>
                <li onClick={() => navigate('/events')} style={{ cursor: 'pointer' }}>Event</li>
                <li onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact Us</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resource</h4>
              <ul>
                <li onClick={() => navigate('/blog')} style={{ cursor: 'pointer' }}>Blog</li>
                <li onClick={() => navigate('/blog/details')} style={{ cursor: 'pointer' }}>Blog Details</li>
                <li onClick={() => navigate('/property/details')} style={{ cursor: 'pointer' }}>Property Details</li>
                <li onClick={() => navigate('/faqs')} style={{ cursor: 'pointer' }}>FAQs</li>
                <li onClick={() => navigate('/reviews')} style={{ cursor: 'pointer' }}>Reviews</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Newsletter</h4>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
              <ul className="footer-links">
                <li onClick={() => navigate('/privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</li>
                <li onClick={() => navigate('/help')} style={{ cursor: 'pointer' }}>Help Center</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="social-icons">
              <button onClick={() => handleSocialClick('facebook')}>f</button>
              <button onClick={() => handleSocialClick('twitter')}>X</button>
              <button onClick={() => handleSocialClick('instagram')}>in</button>
            </div>
              <p>©2026 PROPIFY, Designed by Arnab</p>
          </div>
         </footer>
          </PageTransition>
        </>
   );
};
export default Properties;