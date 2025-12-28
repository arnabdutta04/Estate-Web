import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CityAutocomplete from "../components/CityAutocomplete";
import {
  FaSearch,
  FaHome,
  FaHandshake,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    city: "",
    propertyType: "",
    listingType: "",
    priceRange: ""
  });

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/"); // 🔒 redirect to Welcome page
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  /* ================= SEARCH ================= */
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

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // back to Welcome
  };

  // Prevent render before auth check
  if (!user) return null;

  return (
    <div className="home-page">

      {/* ================= USER HEADER ================= */}
      <div className="user-header">
        <div
          className="user-info"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaUserCircle size={30} />
          <span>{user.name || "Account"}</span>
        </div>

        {showMenu && (
          <div className="user-dropdown">
            <p>{user.email}</p>
            <button onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Let us find a place <br />
              you can <span className="highlight">call home</span>
            </h1>

            <p>
              Discover your perfect property from our extensive collection.
            </p>

            {/* SEARCH BAR */}
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
                    handleFilterChange("propertyType", e.target.value)
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
                    handleFilterChange("priceRange", e.target.value)
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

            {/* SUGGESTIONS */}
            <div className="suggestions">
              <span>Popular Searches:</span>
              <button onClick={() => handleSuggestionClick({ city: "Mumbai" })}>
                Mumbai
              </button>
              <button onClick={() => handleSuggestionClick({ city: "Delhi" })}>
                Delhi
              </button>
              <button onClick={() => handleSuggestionClick({ city: "Bangalore" })}>
                Bangalore
              </button>
              <button
                onClick={() =>
                  handleSuggestionClick({ propertyType: "villa" })
                }
              >
                Villas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us</h2>
          <p className="subtitle">We provide full service at every step</p>

          <div className="features-grid">
            <div className="feature-item">
              <FaHome />
              <h3>Wide Selection</h3>
              <p>Thousands of verified properties</p>
            </div>

            <div className="feature-item">
              <FaHandshake />
              <h3>Trusted Brokers</h3>
              <p>Licensed professionals</p>
            </div>

            <div className="feature-item">
              <FaChartLine />
              <h3>Transparent Pricing</h3>
              <p>No hidden costs</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
