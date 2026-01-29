import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaCheckCircle, FaTimesCircle, FaEye, FaClock, FaUser, FaBuilding, FaIdCard } from 'react-icons/fa';

const AdminVerification = () => {
  const [pendingBrokers, setPendingBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchBrokers();
  }, [filter]);

  const fetchBrokers = async () => {
    try {
      const { data } = await api.get(`/admin/brokers?status=${filter}`);
      setPendingBrokers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      setLoading(false);
    }
  };

  const handleVerification = async (brokerId, status, rejectionReason = '') => {
    try {
      await api.put(`/admin/brokers/${brokerId}/verify`, {
        verificationStatus: status,
        rejectionReason
      });
      
      alert(`Broker ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
      setSelectedBroker(null);
      fetchBrokers();
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Failed to update verification status');
    }
  };

  const viewBrokerDetails = (broker) => {
    setSelectedBroker(broker);
  };

  if (loading) {
    return <div className="loading">Loading brokers...</div>;
  }

  return (
    <div className="admin-verification-page">
      <div className="container">
        <h1>Broker Verification Management</h1>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            <FaClock /> Pending
          </button>
          <button 
            className={filter === 'verified' ? 'active' : ''}
            onClick={() => setFilter('verified')}
          >
            <FaCheckCircle /> Verified
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''}
            onClick={() => setFilter('rejected')}
          >
            <FaTimesCircle /> Rejected
          </button>
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Brokers
          </button>
        </div>

        {/* Brokers List */}
        <div className="brokers-verification-list">
          {pendingBrokers.length === 0 ? (
            <div className="no-results">
              <p>No brokers found with status: {filter}</p>
            </div>
          ) : (
            <table className="verification-table">
              <thead>
                <tr>
                  <th>Broker Name</th>
                  <th>Company</th>
                  <th>License Number</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBrokers.map(broker => (
                  <tr key={broker._id}>
                    <td>
                      <div className="broker-name-cell">
                        <FaUser />
                        <div>
                          <div>{broker.userId?.name}</div>
                          <small>{broker.userId?.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="company-cell">
                        <FaBuilding />
                        {broker.company}
                      </div>
                    </td>
                    <td>
                      <div className="license-cell">
                        <FaIdCard />
                        {broker.licenseNumber}
                      </div>
                    </td>
                    <td>{new Date(broker.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`verification-status ${broker.verificationStatus}`}>
                        {broker.verificationStatus}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-view-details"
                        onClick={() => viewBrokerDetails(broker)}
                      >
                        <FaEye /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Broker Details Modal */}
        {selectedBroker && (
          <div className="modal-overlay" onClick={() => setSelectedBroker(null)}>
            <div className="modal-content broker-details-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedBroker(null)}>×</button>
              
              <h2>Broker Verification Details</h2>

              <div className="broker-details-grid">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-item">
                    <strong>Name:</strong> {selectedBroker.userId?.name}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {selectedBroker.userId?.email}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {selectedBroker.userId?.phone}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Company Information</h3>
                  <div className="detail-item">
                    <strong>Company:</strong> {selectedBroker.company}
                  </div>
                  <div className="detail-item">
                    <strong>License Number:</strong> {selectedBroker.licenseNumber}
                  </div>
                  <div className="detail-item">
                    <strong>Experience:</strong> {selectedBroker.yearsOfExperience}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Service Details</h3>
                  <div className="detail-item">
                    <strong>Serving Cities:</strong> {selectedBroker.servingCities}
                  </div>
                  <div className="detail-item">
                    <strong>Specialization:</strong> {selectedBroker.specialization?.join(', ')}
                  </div>
                  <div className="detail-item">
                    <strong>Property Types:</strong> {selectedBroker.propertyTypes?.join(', ')}
                  </div>
                  <div className="detail-item">
                    <strong>Listing Types:</strong> {selectedBroker.listingType?.join(', ')}
                  </div>
                </div>

                <div className="detail-section documents-section">
                  <h3>Verification Documents</h3>
                  
                  <div className="document-preview">
                    <strong>License Document:</strong>
                    {selectedBroker.licenseDocument ? (
                      <img src={selectedBroker.licenseDocument} alt="License" />
                    ) : (
                      <p>No document uploaded</p>
                    )}
                  </div>

                  <div className="document-preview">
                    <strong>ID Proof:</strong>
                    {selectedBroker.idProof ? (
                      <img src={selectedBroker.idProof} alt="ID Proof" />
                    ) : (
                      <p>No document uploaded</p>
                    )}
                  </div>

                  <div className="document-preview">
                    <strong>Photo:</strong>
                    {selectedBroker.photo ? (
                      <img src={selectedBroker.photo} alt="Photo" />
                    ) : (
                      <p>No photo uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedBroker.verificationStatus === 'pending' && (
                <div className="verification-actions">
                  <button 
                    className="btn-verify"
                    onClick={() => handleVerification(selectedBroker._id, 'verified')}
                  >
                    <FaCheckCircle /> Verify Broker
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:');
                      if (reason) {
                        handleVerification(selectedBroker._id, 'rejected', reason);
                      }
                    }}
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              )}

              {selectedBroker.verificationStatus === 'rejected' && selectedBroker.rejectionReason && (
                <div className="rejection-reason">
                  <strong>Rejection Reason:</strong>
                  <p>{selectedBroker.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerification;