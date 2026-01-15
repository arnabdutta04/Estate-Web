import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import {  FaHome, FaBed, FaBath, FaRulerCombined, FaDollarSign, FaPlus, FaMinus,  FaParking, FaCheck } from 'react-icons/fa';
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
 const [selectedBathrooms, setSelectedBathrooms] = useState('');
const [searchKeyword, setSearchKeyword] = useState('');
const [selectedLocation, setSelectedLocation] = useState('');
const [selectedPropertyType, setSelectedPropertyType] = useState('');
const [selectedStyle, setSelectedStyle] = useState('');

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
  const toggleFacility = (facility) => {
  setSelectedFacilities(prev => ({
    ...prev,
    [facility]: !prev[facility]
  }));
};
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

                  {/* Quick Top-up Amounts */}
                   <div className='search-form-group'>
                     <label className='search-label'>Quick Top-up</label>
                      <div className='quick-amounts-grid'>
                           <button className='quick-amount-btn'>
                          <span className='amount'>$5,000</span>
                      </button>
                      <button className='quick-amount-btn'>
                        <span className='amount'>$10,000</span>
                         </button>
                               <button className='quick-amount-btn'>
                            <span className='amount'>$25,000</span>
                           </button>
                           <button className='quick-amount-btn'>
                           <span className='amount'>$50,000</span>
                           </button>
                        </div>
                           </div>

                         {/* Custom Amount Input */}
                        <div className='search-form-group'>
                           <label className='search-label'>Custom Amount</label>
                             <div className='search-input-wrapper'>
                             <FaDollarSign className='input-icon' />
                            <input
                                type='text'
                                 placeholder="Enter amount"
                                className='search-white-input'
                                 />
                             </div>
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
                                  <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <select 
            className='filter-dropdown'
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Location</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>

          <select 
            className='filter-dropdown'
            value={selectedPropertyType}
            onChange={(e) => setSelectedPropertyType(e.target.value)}
          >
            <option value="">Type of Place</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
          </select>

          <select 
            className='filter-dropdown'
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
          >
            <option value="">Style</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="contemporary">Contemporary</option>
          </select>

          <button className='search-btn-blue' onClick={handleFilterSearch}>
            Search
          </button>
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

  <div className='price-labels'>
    <span className='price-label'>Min Price</span>
    <span className='price-label'>Max Price</span>
  </div>

  <div className='price-inputs'>
    <input 
      type='text' 
      value={`$${priceRange[0].toLocaleString()}`} 
      className='price-input'
      readOnly
    />
    <input 
      type='text' 
      value={`$${priceRange[1].toLocaleString()}`} 
      className='price-input'
      readOnly
    />
  </div>
</div>
<div 
  className='range-track'
  style={{
    background: `linear-gradient(to right, 
      #e8ecf4 0%, 
      #e8ecf4 ${(priceRange[0] / 10000) * 100}%, 
      #5B7FFF ${(priceRange[0] / 10000) * 100}%, 
      #5B7FFF ${(priceRange[1] / 10000) * 100}%, 
      #e8ecf4 ${(priceRange[1] / 10000) * 100}%, 
      #e8ecf4 100%)`
  }}
></div>
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

        {/* Bathrooms Filter - NEW */}
        <div className='filter-section'>
          <h4>Bathrooms</h4>
          <div className='bedroom-buttons'>
            <button 
              className={`bedroom-btn ${selectedBathrooms === '1' ? 'active' : ''}`}
              onClick={() => setSelectedBathrooms('1')}
            >
              1
            </button>
            <button 
              className={`bedroom-btn ${selectedBathrooms === '2' ? 'active' : ''}`}
              onClick={() => setSelectedBathrooms('2')}
            >
              2
            </button>
            <button 
              className={`bedroom-btn ${selectedBathrooms === '3' ? 'active' : ''}`}
              onClick={() => setSelectedBathrooms('3')}
            >
              3
            </button>
            <button 
              className={`bedroom-btn ${selectedBathrooms === '4' ? 'active' : ''}`}
              onClick={() => setSelectedBathrooms('4')}
            >
              4
            </button>
            <button 
              className={`bedroom-btn ${selectedBathrooms === '5+' ? 'active' : ''}`}
              onClick={() => setSelectedBathrooms('5+')}
            >
              5+
            </button>
          </div>
        </div>

        {/* Facilities Filter - UPDATED WITH MORE OPTIONS */}
        <div className='filter-section'>
          <h4>Facilities</h4>
          <div className='amenities-list'>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.furnished}
                onChange={() => toggleFacility('furnished')}
              />
              <span className='checkbox-custom'></span>
              <FaHome className='facility-icon' />
              Furnished
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.petAllowed}
                onChange={() => toggleFacility('petAllowed')}
              />
              <span className='checkbox-custom'></span>
              <svg className='facility-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 4C4.9 4 4 4.9 4 6s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm2 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Pet Allowed
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.parkingSlot}
                onChange={() => toggleFacility('parkingSlot')}
              />
              <span className='checkbox-custom'></span>
              <FaParking className='facility-icon' />
              Parking Slot
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.kitchen}
                onChange={() => toggleFacility('kitchen')}
              />
              <span className='checkbox-custom'></span>
              <svg className='facility-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2.01L14 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h4c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM18 20h-4v-1h4v1zm0-3h-4V6h4v11zM8 2H4c-1.11 0-2 .89-2 2v7c0 1.11.89 2 2 2h4v9h2V2H8zm-2 9H4V4h2v7z"/>
              </svg>
              Kitchen
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.wifi}
                onChange={() => toggleFacility('wifi')}
              />
              <span className='checkbox-custom'></span>
              <svg className='facility-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
              WiFi
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.ac}
                onChange={() => toggleFacility('ac')}
              />
              <span className='checkbox-custom'></span>
              <svg className='facility-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>
              </svg>
              Air Conditioning
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.swimmingPool}
                onChange={() => toggleFacility('swimmingPool')}
              />
              <span className='checkbox-custom'></span>
              <svg className='facility-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.08.64-2.19.64-1.11 0-1.73-.37-2.18-.64-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zm0-4.5c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36s-.78.13-1.15.36c-.47.27-1.09.64-2.2.64v-2c.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2zM8.67 12c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.12-.07.26-.15.41-.23L10.48 5C8.93 3.45 7.5 2.99 5 3v2.5c1.82-.01 2.89.39 4 1.5l1 1-3.25 3.25c.31.12.56.27.77.39.37.23.59.36 1.15.36z"/>
              </svg>
              Swimming Pool
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.gym}
                onChange={() => toggleFacility('gym')}
              />
              <span className='checkbox-custom'></span>
              <svg className='facility-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
              Gym
            </label>
            <label className='amenity-checkbox'>
              <input 
                type='checkbox' 
                checked={selectedFacilities.security}
                onChange={() => toggleFacility('security')}
              />
              <span className='checkbox-custom'></span>
              <svg className='facility-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              24/7 Security
            </label>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className='property-listings'>
        {(properties.length > 0 ? properties : mockProperties).map((property) => (
          <div key={property._id} className='property-list-card'>
            <img src={property.image} alt={property.title} className='property-list-image' />
            <div className='property-list-content'>
              <h3 className='property-list-title'>{property.title}</h3>
              <p className='property-list-price'>${property.price}<span>/month</span></p>
              <div className='property-list-details'>
                <span><FaBed /> {property.bedrooms} Bed</span>
                <span><FaBath /> {property.bathrooms} Bath</span>
                <span><FaRulerCombined /> {property.area}m²</span>
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
            )}
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