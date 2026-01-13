import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaSearch } from 'react-icons/fa';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import './Brokers.css';

const Brokers = () => {
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const cities = [...new Set(brokers.map(b => b.servingCities).filter(Boolean))];
  const specializations = [...new Set(brokers.flatMap(b => b.specialization || []))];

  useEffect(() => {
    filterBrokers();
  }, [searchTerm, selectedCity, selectedSpecialization, brokers]);

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const { data } = await api.get('/brokers');
      const verifiedBrokers = data.filter(broker => broker.verificationStatus === 'verified');
      setBrokers(verifiedBrokers);
      setFilteredBrokers(verifiedBrokers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      setLoading(false);
    }
  };

  const filterBrokers = () => {
    let filtered = [...brokers];

    if (searchTerm) {
      filtered = filtered.filter(broker => 
        broker.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.servingCities?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(broker => broker.servingCities === selectedCity);
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(broker => 
        broker.specialization?.includes(selectedSpecialization)
      );
    }

    setFilteredBrokers(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedSpecialization('');
  };

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      alert('Thank you! We will contact you soon.');
      setEmail('');
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="brokers-page-dark">
          {/* Hero Section */}
          <div className="brokers-hero-dark">
            <div className="hero-overlay-brokers"></div>
            <div className="hero-content-brokers">
              <h1>Want To Get The Most Return From Your Property?</h1>
              <div className="hero-subtitle-bar">
                <span>ROI Consultation, Design + Marketing Services</span>
              </div>
              
              {/* Liquid Glass Email Bar */}
              <form onSubmit={handleGetStarted} className="hero-email-bar">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="hero-email-input"
                  required
                />
                <button type="submit" className="hero-email-btn">
                  Get Started
                </button>
              </form>
            </div>
          </div>

          {/* Search Section */}
          <div className="brokers-search-section">
            <div className="search-container-brokers">
              <div className="search-input-wrapper-brokers">
                <FaSearch className="search-icon-brokers" />
                <input
                  type="text"
                  placeholder="Search by name, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-brokers"
                />
              </div>

              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select-brokers"
              >
                <option value="">All Cities</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>

              <select 
                value={selectedSpecialization} 
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="filter-select-brokers"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>

              <button className="btn-reset-brokers" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>

          {/* Brokers Grid */}
          <div className="brokers-container-dark">
            {filteredBrokers.length === 0 ? (
              <div className="no-results-brokers">
                <h2>No Brokers Found</h2>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn-clear-filters" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="brokers-grid-dark">
                {filteredBrokers.map((broker) => (
                  <div key={broker._id} className="broker-card-dark">
                    <div className="broker-image-container">
                      {broker.photo ? (
                        <img src={broker.photo} alt={broker.userId?.name} className="broker-photo-dark" />
                      ) : (
                        <div className="broker-photo-placeholder-dark">
                          {broker.userId?.name?.charAt(0)}
                        </div>
                      )}
                      <div className="broker-overlay-dark">
                        <div className="broker-name-overlay">
                          <h3>{broker.userId?.name}</h3>
                          <p>{broker.specialization?.[0] || 'Real Estate Agent'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Brokers;