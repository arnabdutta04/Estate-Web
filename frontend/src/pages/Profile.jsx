// src/pages/Profile.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar.jsx';
import PageTransition from '../components/PageTransition';
import { 
  FaUser, 
  FaCamera, 
  FaLock, 
  FaCog, 
  FaSun, 
  FaMoon, 
  FaDesktop,
  FaImage 
} from 'react-icons/fa';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { theme, changeTheme } = useTheme();
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark-mode');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    }
  }, [theme]);

  // Handle Personal Info Update
  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.put('/auth/update-profile', personalInfo);
      login(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
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
    }
  };

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicture) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);

      const { data } = await api.post('/auth/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      login(data.user);
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

  // Handle Password Change
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Please enter current password' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/send-password-otp', {
        currentPassword: passwordData.currentPassword
      });
      setOtpSent(true);
      setMessage({ type: 'success', text: 'OTP sent to your email!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send OTP' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        otp: passwordData.otp
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        otp: ''
      });
      setOtpSent(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="profile-page">
          <div className="container">
            <div className="profile-header">
              <h1>My Profile</h1>
              <p>Manage your account settings and preferences</p>
            </div>

            <div className="profile-layout">
              {/* Sidebar */}
              <div className="profile-sidebar">
                <div className="profile-avatar-section">
                  <div className="profile-avatar">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <h3>{user?.name || 'User'}</h3>
                  <p>{user?.email}</p>
                </div>

                <nav className="profile-nav">
                  <button
                    className={`profile-nav-item ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    <FaUser className="nav-icon" />
                    Personal Information
                  </button>
                  <button
                    className={`profile-nav-item ${activeTab === 'picture' ? 'active' : ''}`}
                    onClick={() => setActiveTab('picture')}
                  >
                    <FaCamera className="nav-icon" />
                    Profile Picture
                  </button>
                  <button
                    className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <FaLock className="nav-icon" />
                    Security & Password
                  </button>
                  <button
                    className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <FaCog className="nav-icon" />
                    Settings
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="profile-content">
                {message.text && (
                  <div className={`profile-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="profile-section">
                    <h2>Personal Information</h2>
                    <p className="section-description">
                      Update your personal details and contact information
                    </p>

                    <form onSubmit={handlePersonalInfoSubmit} className="profile-form">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={personalInfo.name}
                          onChange={handlePersonalInfoChange}
                          placeholder="Enter your full name"
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
                          placeholder="Enter your email"
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
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          name="address"
                          value={personalInfo.address}
                          onChange={handlePersonalInfoChange}
                          placeholder="Enter your address"
                          rows="3"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn-save" 
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Profile Picture Tab */}
                {activeTab === 'picture' && (
                  <div className="profile-section">
                    <h2>Profile Picture</h2>
                    <p className="section-description">
                      Upload a profile picture to personalize your account
                    </p>

                    <div className="picture-upload-section">
                      <div className="picture-preview">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" />
                        ) : (
                          <div className="preview-placeholder">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleProfilePictureSubmit} className="picture-form">
                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                          />
                          <label htmlFor="profilePicture" className="file-input-label">
                            <FaImage /> Choose Image
                          </label>
                        </div>

                        <button 
                          type="submit" 
                          className="btn-save" 
                          disabled={!profilePicture || loading}
                        >
                          {loading ? 'Uploading...' : 'Upload Picture'}
                        </button>
                      </form>

                      <div className="picture-guidelines">
                        <h4>Image Guidelines:</h4>
                        <ul>
                          <li>Recommended size: 400x400 pixels</li>
                          <li>Maximum file size: 5MB</li>
                          <li>Supported formats: JPG, PNG, GIF</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security & Password Tab */}
                {activeTab === 'security' && (
                  <div className="profile-section">
                    <h2>Security & Password</h2>
                    <p className="section-description">
                      Change your password using OTP verification
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="profile-form">
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter current password"
                          required
                        />
                      </div>

                      {!otpSent && (
                        <button 
                          type="button" 
                          className="btn-send-otp" 
                          onClick={handleSendOTP}
                          disabled={loading || !passwordData.currentPassword}
                        >
                          {loading ? 'Sending...' : 'Send OTP to Email'}
                        </button>
                      )}

                      {otpSent && (
                        <>
                          <div className="form-group">
                            <label>OTP Code</label>
                            <input
                              type="text"
                              name="otp"
                              value={passwordData.otp}
                              onChange={handlePasswordChange}
                              placeholder="Enter 6-digit OTP"
                              maxLength="6"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label>New Password</label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter new password"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm new password"
                              required
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="btn-save" 
                            disabled={loading}
                          >
                            {loading ? 'Changing...' : 'Change Password'}
                          </button>
                        </>
                      )}
                    </form>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="profile-section">
                    <h2>Appearance Settings</h2>
                    <p className="section-description">
                      Customize your viewing experience
                    </p>

                    <div className="theme-selector">
                      <h3>Theme Preference</h3>
                      
                      <div className="theme-options">
                        <div 
                          className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                          onClick={() => handleThemeChange('light')}
                        >
                          <div className="theme-preview light-preview">
                            <div className="preview-header"></div>
                            <div className="preview-content"></div>
                          </div>
                          <FaSun className="theme-icon" />
                          <span className="theme-label">Light</span>
                        </div>

                        <div 
                          className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                          onClick={() => handleThemeChange('dark')}
                        >
                          <div className="theme-preview dark-preview">
                            <div className="preview-header"></div>
                            <div className="preview-content"></div>
                          </div>
                          <FaMoon className="theme-icon" />
                          <span className="theme-label">Dark</span>
                        </div>

                        <div 
                          className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                          onClick={() => handleThemeChange('system')}
                        >
                          <div className="theme-preview system-preview">
                            <div className="preview-header"></div>
                            <div className="preview-content"></div>
                          </div>
                          <FaDesktop className="theme-icon" />
                          <span className="theme-label">System</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Profile;