// src/pages/Profile.jsx - FIXED VERSION
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { 
  FaUser, 
  FaCamera, 
  FaLock, 
  FaCog,
  FaEdit,
  FaTimes,
  FaBriefcase,
  FaPlus,
  FaCrown,
  FaBuilding
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext); // ✅ Use updateUser instead of login
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    userRole: user?.role || 'customer'
  });

  // Address State
  const [addressInfo, setAddressInfo] = useState({
    country: user?.country || '',
    city: user?.city || '',
    postalCode: user?.postalCode || ''
  });

  // Balance State
  const [balance, setBalance] = useState(Number(user?.balance) || 0);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);

  // Handle Personal Info Update
  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
      const { data } = await api.put('/auth/update-profile', {
        name: fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        dateOfBirth: personalInfo.dateOfBirth,
        role: personalInfo.userRole
      });
      
      // ✅ FIXED: Use updateUser instead of login
      updateUser(data.user);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setShowEditModal(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Address Update
  const handleAddressChange = (e) => {
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.put('/auth/update-address', addressInfo);
      
      // ✅ FIXED: Use updateUser instead of login
      updateUser(data.user);
      
      setMessage({ type: 'success', text: 'Address updated successfully!' });
      setShowAddressModal(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update address' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Balance Top Up
  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/auth/update-balance', {
        amount: amount
      });
      
      // ✅ FIXED: Use updateUser instead of login
      updateUser(data.user);
      setBalance(data.user.balance);
      
      setMessage({ type: 'success', text: `Successfully added $${amount.toFixed(2)} to your balance!` });
      setShowBalanceModal(false);
      setTopUpAmount('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update balance' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Profile Picture Upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Auto upload
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const { data } = await api.post('/auth/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // ✅ FIXED: Use updateUser instead of login
      updateUser(data.user);
      
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload picture' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="modern-profile-page">
          <div className="profile-container">
            {/* Header Section */}
            <div className="profile-page-header">
              <h1>My Profile</h1>
            </div>

            {/* Profile Card with Avatar */}
            <div className="profile-card">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-large">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {personalInfo.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <label htmlFor="avatar-upload" className="avatar-edit-btn">
                    <FaCamera />
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className="profile-card-info">
                <h2>{`${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'User'}</h2>
                <p className="profile-role">{personalInfo.userRole}</p>
                <p className="profile-location">{addressInfo.city ? `${addressInfo.city}, ${addressInfo.country}` : 'Location not set'}</p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="info-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                <button 
                  className="edit-btn"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit /> Edit
                </button>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>First Name</label>
                  <p>{personalInfo.firstName || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Last Name</label>
                  <p>{personalInfo.lastName || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{personalInfo.dateOfBirth || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{personalInfo.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <p>{personalInfo.phone || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>User Role</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <p>{personalInfo.userRole}</p>
                    {personalInfo.userRole === 'broker' && (
                      <span className="broker-badge">
                        <FaBuilding /> Broker Account
                      </span>
                    )}
                    {personalInfo.userRole === 'admin' && (
                      <span className="admin-badge">
                        <FaCrown /> Admin Access
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Broker Quick Actions - ONLY FOR BROKERS */}
            {personalInfo.userRole === 'broker' && (
              <div className="info-section broker-actions-section">
                <div className="section-header">
                  <h3>Broker Dashboard</h3>
                </div>
                
                <div className="broker-quick-actions">
                  <button 
                    className="broker-action-btn"
                    onClick={() => navigate('/broker/dashboard')}
                  >
                    <FaBriefcase /> View Dashboard
                  </button>
                  <button 
                    className="broker-action-btn"
                    onClick={() => navigate('/broker/add-property')}
                  >
                    <FaPlus /> Add Property
                  </button>
                </div>
              </div>
            )}

            {/* Address Section */}
            <div className="info-section">
              <div className="section-header">
                <h3>Address</h3>
                <button 
                  className="edit-btn"
                  onClick={() => setShowAddressModal(true)}
                >
                  <FaEdit /> Edit
                </button>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Country</label>
                  <p>{addressInfo.country || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>City</label>
                  <p>{addressInfo.city || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Postal Code</label>
                  <p>{addressInfo.postalCode || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="info-section balance-section">
              <div className="section-header">
                <h3>My Balance</h3>
                <button 
                  className="edit-btn topup-btn"
                  onClick={() => setShowBalanceModal(true)}
                >
                  <span>+</span> Top Up
                </button>
              </div>

              <div className="balance-display">
                <div className="balance-card">
                  <label>Current Balance</label>
                  <div className="balance-amount">
                    <span className="currency">$</span>
                    <span className="amount">{(Number(balance) || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Personal Information Modal */}
            {showEditModal && (
              <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Edit Personal Information</h3>
                    <button 
                      className="modal-close"
                      onClick={() => setShowEditModal(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <form onSubmit={handlePersonalInfoSubmit}>
                    <div className="modal-grid">
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalInfoChange}
                          placeholder="First Name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalInfoChange}
                          placeholder="Last Name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          placeholder="email@example.com"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={personalInfo.dateOfBirth}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>User Role</label>
                        <select
                          name="userRole"
                          value={personalInfo.userRole}
                          onChange={handlePersonalInfoChange}
                          disabled
                        >
                          <option value="customer">Customer</option>
                          <option value="broker">Broker</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button 
                        type="submit" 
                        className="btn-save"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Address Modal */}
            {showAddressModal && (
              <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Edit Address</h3>
                    <button 
                      className="modal-close"
                      onClick={() => setShowAddressModal(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <form onSubmit={handleAddressSubmit}>
                    <div className="modal-grid">
                      <div className="form-group">
                        <label>Country</label>
                        <input
                          type="text"
                          name="country"
                          value={addressInfo.country}
                          onChange={handleAddressChange}
                          placeholder="United States"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={addressInfo.city}
                          onChange={handleAddressChange}
                          placeholder="New York"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={addressInfo.postalCode}
                          onChange={handleAddressChange}
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button 
                        type="submit" 
                        className="btn-save"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Top Up Balance Modal */}
            {showBalanceModal && (
              <div className="modal-overlay" onClick={() => setShowBalanceModal(false)}>
                <div className="modal-content modal-balance" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Top Up Balance</h3>
                    <button 
                      className="modal-close"
                      onClick={() => setShowBalanceModal(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <form onSubmit={handleTopUpSubmit}>
                    <div className="balance-modal-content">
                      <div className="current-balance-info">
                        <label>Current Balance</label>
                        <div className="balance-value">$${(Number(balance) + parseFloat(topUpAmount)).toFixed(2)}</div>
                      </div>

                      <div className="form-group">
                        <label>Amount to Add</label>
                        <div className="amount-input-wrapper">
                          <span className="currency-symbol">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>

                      <div className="quick-amounts">
                        <label>Quick Add</label>
                        <div className="quick-amount-buttons">
                          <button 
                            type="button" 
                            className="quick-amount-btn"
                            onClick={() => setTopUpAmount('10')}
                          >
                            $10
                          </button>
                          <button 
                            type="button" 
                            className="quick-amount-btn"
                            onClick={() => setTopUpAmount('50')}
                          >
                            $50
                          </button>
                          <button 
                            type="button" 
                            className="quick-amount-btn"
                            onClick={() => setTopUpAmount('100')}
                          >
                            $100
                          </button>
                          <button 
                            type="button" 
                            className="quick-amount-btn"
                            onClick={() => setTopUpAmount('500')}
                          >
                            $500
                          </button>
                        </div>
                      </div>

                      {topUpAmount && !isNaN(parseFloat(topUpAmount)) && (
                        <div className="new-balance-preview">
                          <span>New Balance:</span>
                          <span className="preview-amount">
                            ${(balance + parseFloat(topUpAmount)).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="modal-footer">
                      <button 
                        type="submit" 
                        className="btn-save btn-topup"
                        disabled={loading || !topUpAmount}
                      >
                        {loading ? 'Processing...' : 'Add Funds'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Message Display */}
            {message.text && (
              <div className={`message-toast ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Profile;