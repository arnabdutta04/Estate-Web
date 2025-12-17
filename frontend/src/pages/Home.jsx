import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CityAutocomplete from '../components/CityAutocomplete';
import { FaSearch, FaHome, FaHandshake, FaChartLine } from 'react-icons/fa';

const Home = () => {
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    propertyType: '',
    listingType: '',
    priceRange: ''
  });

  const navigate = useNavigate();

  const handleFilterChange = (name, value) => {
    setSearchFilters({ ...searchFilters, [name]: value });
  };

  const handleCityChange = (city) => {
    setSearchFilters({ ...searchFilters, city });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryString = new URLSearchParams(searchFilters).toString();
    navigate(`/properties?${queryString}`);
  };

  const handleSuggestionClick = (filter) => {
    navigate(`/properties?${new URLSearchParams(filter).toString()}`);
  };

  return (
    <div className="home-page">

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Let us find a place <br />
              you can <span className="highlight">call home</span>
            </h1>

            <p>
              Discover your perfect property from our extensive collection of homes,
              apartments, and commercial spaces.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-bar">
              <div className="search-group">
                <label>Location</label>
                <CityAutocomplete
                  value={searchFilters.city}
                  onChange={handleCityChange}
                  placeholder="Search city..."
                />
              </div>

              <div className="search-group">
                <label>Property Type</label>
                <select
                  value={searchFilters.propertyType}
                  onChange={(e) =>
                    handleFilterChange('propertyType', e.target.value)
                  }
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="search-group">
                <label>Price Range</label>
                <select
                  value={searchFilters.priceRange}
                  onChange={(e) =>
                    handleFilterChange('priceRange', e.target.value)
                  }
                >
                  <option value="">Max Price</option>
                  <option value="500000">Under ₹5 Lakh</option>
                  <option value="1000000">Under ₹10 Lakh</option>
                  <option value="2000000">Under ₹20 Lakh</option>
                  <option value="5000000">Under ₹50 Lakh</option>
                  <option value="10000000">Under ₹1 Crore</option>
                </select>
              </div>

              <button type="submit">
                <FaSearch /> Search
              </button>
            </form>

            {/* Suggestions */}
            <div className="suggestions">
              <span>Popular Searches:</span>
              <button onClick={() => handleSuggestionClick({ city: 'Mumbai' })}>
                Mumbai
              </button>
              <button onClick={() => handleSuggestionClick({ city: 'Delhi' })}>
                Delhi
              </button>
              <button onClick={() => handleSuggestionClick({ city: 'Bangalore' })}>
                Bangalore
              </button>
              <button
                onClick={() =>
                  handleSuggestionClick({ propertyType: 'villa' })
                }
              >
                Villas
              </button>
              <button
                onClick={() =>
                  handleSuggestionClick({ listingType: 'rent' })
                }
              >
                For Rent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us</h2>
          <p className="subtitle">We provide full service at every step</p>

          <div className="features-grid">
            <div className="feature-item">
              <FaHome />
              <h3>Wide Selection</h3>
              <p>Thousands of verified properties across multiple cities</p>
            </div>

            <div className="feature-item">
              <FaHandshake />
              <h3>Trusted Brokers</h3>
              <p>Licensed professionals with proven track records</p>
            </div>

            <div className="feature-item">
              <FaChartLine />
              <h3>Transparent Pricing</h3>
              <p>No hidden costs, complete clarity</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
