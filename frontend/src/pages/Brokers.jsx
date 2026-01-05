import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaBriefcase, FaCheckCircle, FaFilter, FaSearch} from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';

const Brokers = () => {
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const navigate = useNavigate();

  // Get unique cities and specializations for filters
  const cities = [...new Set(brokers.map(b => b.servingCities).filter(Boolean))];
  const specializations = [...new Set(brokers.flatMap(b => b.specialization || []))];

  useEffect(() => {
    filterBrokers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCity, selectedSpecialization, brokers]);

  useEffect(() => {
    fetchBrokers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBrokers = async () => {
    try {
      const { data } = await api.get('/brokers');
      // Filter only verified brokers
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(broker => 
        broker.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.servingCities?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter(broker => broker.servingCities === selectedCity);
    }

    // Specialization filter
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

  // Updated loading component to match Properties.js style
  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner 
          text="Finding Top Brokers"
          subtext="Connecting you with verified professionals"
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="brokers-page">
          <div className="container">
            {/* Header */}
            <div className="brokers-header">
              <h1>Find Your Perfect Real Estate Broker</h1>
              <p>Connect with verified professionals who understand your needs</p>
            </div>

            {/* Stats Banner */}
            <div className="brokers-stats-banner">
              <div className="stat-item">
                <h3>{brokers.length}+</h3>
                <p>Verified Brokers</p>
              </div>
              <div className="stat-item">
                <h3>{cities.length}+</h3>
                <p>Cities Covered</p>
              </div>
              <div className="stat-item">
                <h3>100%</h3>
                <p>Verified Profiles</p>
              </div>
            </div>

            {/* Filters Section */}
            <div className="brokers-filters">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by name, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>

                <select 
                  value={selectedSpecialization} 
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>

                <button className="btn-reset-filters" onClick={resetFilters}>
                  <FaFilter /> Reset Filters
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="results-info">
              <p>
                Showing <strong>{filteredBrokers.length}</strong> verified broker{filteredBrokers.length !== 1 ? 's' : ''}
                {(searchTerm || selectedCity || selectedSpecialization) && ' matching your criteria'}
              </p>
            </div>

            {/* Brokers Grid */}
            {filteredBrokers.length === 0 ? (
              <div className="no-results">
                <h2>No Brokers Found</h2>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn-primary" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="brokers-grid">
                {filteredBrokers.map((broker) => (
                  <div key={broker._id} className="broker-card">
                    <div className="broker-card-header">
                      <div className="broker-photo">
                        {broker.photo ? (
                          <img src={broker.photo} alt={broker.userId?.name} />
                        ) : (
                          <div className="broker-photo-placeholder">
                            {broker.userId?.name?.charAt(0)}
                          </div>
                        )}
                        <div className="verified-badge">
                          <FaCheckCircle /> Verified
                        </div>
                      </div>

                      <div className="broker-basic-info">
                        <h3>{broker.userId?.name}</h3>
                        <div className="broker-company">
                          <FaBuilding />
                          <span>{broker.company}</span>
                        </div>
                        <div className="broker-rating">
                          <FaStar />
                          <span>{broker.rating || '4.5'}</span>
                          <span className="reviews-count">({broker.reviewsCount || '25'} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="broker-card-body">
                      <div className="broker-info-item">
                        <FaMapMarkerAlt />
                        <div>
                          <strong>Serving:</strong>
                          <span>{broker.servingCities}</span>
                        </div>
                      </div>

                      <div className="broker-info-item">
                        <FaBriefcase />
                        <div>
                          <strong>Experience:</strong>
                          <span>{broker.yearsOfExperience} years</span>
                        </div>
                      </div>

                      <div className="broker-specializations">
                        <strong>Specializations:</strong>
                        <div className="tags">
                          {broker.specialization?.map((spec, index) => (
                            <span key={index} className="tag">{spec}</span>
                          ))}
                        </div>
                      </div>

                      {broker.propertyTypes && broker.propertyTypes.length > 0 && (
                        <div className="broker-property-types">
                          <strong>Property Types:</strong>
                          <div className="tags">
                            {broker.propertyTypes.map((type, index) => (
                              <span key={index} className="tag-secondary">{type}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="broker-card-footer">
                      <a href={`tel:${broker.userId?.phone}`} className="contact-btn">
                        <FaPhone /> Call
                      </a>
                      <a href={`mailto:${broker.userId?.email}`} className="contact-btn">
                        <FaEnvelope /> Email
                      </a>
                      <button 
                        className="btn-view-profile"
                        onClick={() => navigate(`/brokers/${broker._id}`)}
                      >
                        View Profile
                      </button>
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