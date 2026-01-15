import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { FaMapMarkerAlt, FaHome, FaBed, FaBath, FaRulerCombined, FaDollarSign, FaPlus, FaMinus, FaExpand, FaParking, FaCheck } from 'react-icons/fa';
import './Properties.css';

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

  // Mock property data for demonstration
  const mockProperties = [
    {
      _id: '1',
      title: 'Duplex in La Plata',
      price: 1209,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      bedrooms: 1.2,
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
      // Use mock data if API fails
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
    fetchProperties({});
  };

  const handlePageChange = (page) => {
    fetchProperties(filters, page);
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
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
                Buy, Rent, & Sell<br />Property
              </h1>
              <button className='explore-btn' onClick={() => navigate('/properties')}>
                Explore All Property 
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Right Side - Search Card */}
            <div className='search-card-container'>
              <div className='search-card-white'>
                <h2 className='search-card-title'>
                  Find your Best Property<br />what do you want!
                </h2>

                {/* Location Input */}
                <div className='search-form-group'>
                  <label className='search-label'>Location</label>
                  <div className='search-input-wrapper' ref={cityDropdownRef}>
                    <FaMapMarkerAlt className='input-icon' />
                    <input
                      type='text'
                      value={cityInput}
                      onChange={handleCityInputChange}
                      onFocus={handleCityInputFocus}
                      placeholder="Stockholm, Sweden"
                      className='search-white-input'
                    />
                    <svg className='dropdown-arrow' width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {showCitySuggestions && citySuggestions.length > 0 && (
                      <ul className='city-dropdown-white'>
                        {citySuggestions.slice(0, 8).map((city, index) => (
                          <li key={index} onClick={() => handleCitySelect(city)}>
                            <FaMapMarkerAlt className='dropdown-icon' />
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Property Type Select */}
                <div className='search-form-group'>
                  <label className='search-label'>Property Type</label>
                  <div className='search-input-wrapper'>
                    <FaHome className='input-icon' />
                    <select 
                      name='propertyType'
                      value={filters.propertyType}
                      onChange={handleFilterChange}
                      className='search-white-input'
                    >
                      <option value=''>Apartment Name</option>
                      <option value='apartment'>Apartment</option>
                      <option value='villa'>Villa</option>
                      <option value='house'>House</option>
                      <option value='flat'>Flat</option>
                      <option value='commercial'>Commercial</option>
                    </select>
                    <svg className='dropdown-arrow' width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Property Details - Inline */}
                <div className='property-details-inline'>
                  <div className='detail-item'>
                    <FaBed className='detail-icon' />
                    <select 
                      name='bedrooms'
                      value={filters.bedrooms}
                      onChange={handleFilterChange}
                      className='detail-select'
                    >
                      <option value=''>4 Bed</option>
                      <option value='1'>1 Bed</option>
                      <option value='2'>2 Bed</option>
                      <option value='3'>3 Bed</option>
                      <option value='4'>4 Bed</option>
                      <option value='5'>5+ Bed</option>
                    </select>
                  </div>

                  <div className='detail-item'>
                    <FaBath className='detail-icon' />
                    <select 
                      name='bathrooms'
                      value={filters.bathrooms}
                      onChange={handleFilterChange}
                      className='detail-select'
                    >
                      <option value=''>2 Bathroom</option>
                      <option value='1'>1 Bathroom</option>
                      <option value='2'>2 Bathroom</option>
                      <option value='3'>3 Bathroom</option>
                      <option value='4'>4+ Bathroom</option>
                    </select>
                  </div>

                  <div className='detail-item'>
                    <FaRulerCombined className='detail-icon' />
                    <span className='detail-text'>6x7.5 m²</span>
                  </div>
                </div>

                {/* Max Price Input */}
                <div className='search-form-group'>
                  <label className='search-label'>Max Price</label>
                  <div className='search-input-wrapper'>
                    <FaDollarSign className='input-icon' />
                    <input
                      type='text'
                      name='maxPrice'
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="$90.00 max"
                      className='search-white-input'
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button className='search-btn-orange' onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Filter & Map Section */}
          <div className='filter-map-section'>
            <div className='filter-map-container'>
              {/* Left Side - Filters & Property Listings */}
              <div className='filter-listings-panel'>
                {/* Top Search Bar */}
                <div className='top-search-bar'>
                  <div className='search-tabs'>
                    <button 
                      className={`tab-btn ${activeTab === 'rent' ? 'active' : ''}`}
                      onClick={() => setActiveTab('rent')}
                    >
                      Rent
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'buy' ? 'active' : ''}`}
                      onClick={() => setActiveTab('buy')}
                    >
                      Buy
                    </button>
                  </div>

                  <div className='search-filters-row'>
                    <div className='search-input-container'>
                      <svg className='search-icon' width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <input 
                        type="text" 
                        placeholder="Search here..." 
                        className='top-search-input'
                      />
                    </div>

                    <select className='filter-dropdown'>
                      <option>Location</option>
                      {cities.map((city, idx) => (
                        <option key={idx}>{city}</option>
                      ))}
                    </select>

                    <select className='filter-dropdown'>
                      <option>Type of Place</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>House</option>
                      <option>Commercial</option>
                    </select>

                    <select className='filter-dropdown'>
                      <option>Style</option>
                      <option>Modern</option>
                      <option>Classic</option>
                      <option>Contemporary</option>
                    </select>

                    <button className='search-btn-blue'>Search</button>
                  </div>
                </div>

                {/* Filters Sidebar */}
                <div className='filters-sidebar'>
                  {/* Create Alert Box */}
                  <div className='create-alert-box'>
                    <h3 className='alert-title'>Create Real Estate Alert</h3>
                    <p className='alert-description'>
                      Create a landing page alert and never miss an opportunity to live in your dream "home"
                    </p>
                    <input 
                      type='text' 
                      placeholder='Enter Keyword' 
                      className='alert-input'
                    />
                    <button className='create-btn'>Create</button>
                  </div>

                  {/* Price Filter */}
                  <div className='filter-section'>
                    <div className='filter-header'>
                      <h4>Price</h4>
                      <span className='monthly-toggle'>Monthly</span>
                    </div>
                    
                    <div className='price-range-slider'>
                      <input 
                        type='range' 
                        min='0' 
                        max='10000' 
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className='range-input'
                      />
                      <input 
                        type='range' 
                        min='0' 
                        max='10000' 
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className='range-input'
                      />
                      <div className='range-track'></div>
                    </div>

                    <div className='price-inputs'>
                      <input 
                        type='text' 
                        value={`$${priceRange[0]}`} 
                        className='price-input'
                        readOnly
                      />
                      <input 
                        type='text' 
                        value={`$${priceRange[1]}`} 
                        className='price-input'
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Bedrooms Filter */}
                  <div className='filter-section'>
                    <h4>Bedrooms</h4>
                    <div className='bedroom-buttons'>
                      <button 
                        className={`bedroom-btn ${selectedBedrooms === 'studio' ? 'active' : ''}`}
                        onClick={() => setSelectedBedrooms('studio')}
                      >
                        Studio
                      </button>
                      <button 
                        className={`bedroom-btn ${selectedBedrooms === '1' ? 'active' : ''}`}
                        onClick={() => setSelectedBedrooms('1')}
                      >
                        1
                      </button>
                      <button 
                        className={`bedroom-btn ${selectedBedrooms === '2' ? 'active' : ''}`}
                        onClick={() => setSelectedBedrooms('2')}
                      >
                        2
                      </button>
                      <button 
                        className={`bedroom-btn ${selectedBedrooms === '3' ? 'active' : ''}`}
                        onClick={() => setSelectedBedrooms('3')}
                      >
                        3
                      </button>
                      <button 
                        className={`bedroom-btn ${selectedBedrooms === '4+' ? 'active' : ''}`}
                        onClick={() => setSelectedBedrooms('4+')}
                      >
                        4+
                      </button>
                    </div>
                  </div>

                  {/* Amenities Filter */}
                  <div className='filter-section'>
                    <h4>Amenities</h4>
                    <div className='amenities-list'>
                      <label className='amenity-checkbox'>
                        <input 
                          type='checkbox' 
                          checked={selectedAmenities.furnished}
                          onChange={() => toggleAmenity('furnished')}
                        />
                        <span className='checkbox-custom'></span>
                        Furnished
                      </label>
                      <label className='amenity-checkbox'>
                        <input 
                          type='checkbox' 
                          checked={selectedAmenities.petAllowed}
                          onChange={() => toggleAmenity('petAllowed')}
                        />
                        <span className='checkbox-custom'></span>
                        Pet Allowed
                      </label>
                      <label className='amenity-checkbox'>
                        <input 
                          type='checkbox' 
                          checked={selectedAmenities.parkingSlot}
                          onChange={() => toggleAmenity('parkingSlot')}
                        />
                        <span className='checkbox-custom'></span>
                        Parking Slot
                      </label>
                      <label className='amenity-checkbox'>
                        <input 
                          type='checkbox' 
                          checked={selectedAmenities.kitchen}
                          onChange={() => toggleAmenity('kitchen')}
                        />
                        <span className='checkbox-custom'></span>
                        Kitchen
                      </label>
                    </div>
                  </div>
                </div>

                {/* Property Listings */}
                <div className='property-listings'>
                  {mockProperties.map((property) => (
                    <div key={property._id} className='property-list-card'>
                      <img src={property.image} alt={property.title} className='property-list-image' />
                      <div className='property-list-content'>
                        <h3 className='property-list-title'>{property.title}</h3>
                        <p className='property-list-price'>${property.price}<span>/month</span></p>
                        <div className='property-list-details'>
                          <span><FaBed /> {property.bedrooms}km</span>
                          <span><FaRulerCombined /> {property.area}m²</span>
                          <span><FaParking /> parking slot</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Map */}
              <div className='map-panel'>
                <div className='map-controls'>
                  <button className='map-control-btn'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="3" fill="white"/>
                      <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button className='map-control-btn'><FaMinus /></button>
                  <button className='map-control-btn'><FaPlus /></button>
                </div>

                <div className='map-container'>
                  {/* Map placeholder - integrate with Google Maps or Mapbox */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Property Map"
                  ></iframe>

                  {/* Property Markers on Map */}
                  {mockProperties.map((property, idx) => (
                    <div 
                      key={property._id}
                      className='map-property-marker'
                      style={{
                        top: `${30 + idx * 20}%`,
                        left: `${40 + idx * 15}%`
                      }}
                    >
                      <div className='map-property-card'>
                        <img src={property.image} alt={property.title} />
                        <div className='map-card-content'>
                          <h4>{property.title}</h4>
                          <p>${property.price}/month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the sections remain the same... */}
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
            ) : null}
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
            )
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