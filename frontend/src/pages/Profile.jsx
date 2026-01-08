// src/pages/Profile.jsx - E-Commerce Profile with Hero Banner
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';
import { useTheme } from '../context/ThemeContext';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import { 
  FaSearch,
  FaCog,
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaBox,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaEdit
} from 'react-icons/fa';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { theme } = useTheme();
  const [showFullBio, setShowFullBio] = useState(false);
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    username: user?.username || 'lucky.jesse',
    email: user?.email || '',
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ')[1] || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    postalCode: user?.postalCode || '',
    bio: user?.bio || 'A beautiful Dashboard for E-commerce. Passionate online shopper and product enthusiast.'
  });

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);

  // E-commerce stats (mock data - replace with real API calls)
  const [stats, setStats] = useState({
    orders: 22,
    wishlist: 10,
    reviews: 89
  });

  const [recentOrders] = useState([
    { id: 'ORD-001', name: 'Wireless Headphones', date: 'Jan 5, 2026', status: 'delivered' },
    { id: 'ORD-002', name: 'Smart Watch', date: 'Jan 3, 2026', status: 'processing' },
    { id: 'ORD-003', name: 'Running Shoes', date: 'Dec 28, 2025', status: 'delivered' }
  ]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark-mode');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    }
  }, [theme]);

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

  const handleCancel = () => {
    setPersonalInfo({
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      postalCode: user?.postalCode || '',
      bio: user?.bio || ''
    });
    setMessage({ type: '', text: '' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle />;
      case 'processing':
        return <FaClock />;
      case 'pending':
        return <FaTruck />;
      default:
        return <FaBox />;
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="profile-page">
          {/* Hero Section */}
          <div className="profile-hero">
            <div className="hero-content">
              <div className="hero-top">
                <h1 className="hero-title">User Profile</h1>
                <div className="hero-user-info">
                  <div className="hero-search">
                    <FaSearch className="hero-search-icon" />
                    <input type="text" placeholder="Search" />
                  </div>
                  <div className="hero-avatar">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #036666, #c4d600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'white'
                      }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <span className="hero-username">{user?.name || 'Jessica Jones'}</span>
                </div>
              </div>

              <div className="hero-main">
                <h2 className="hero-greeting">Hello {user?.firstName || user?.name?.split(' ')[0] || 'Jesse'}</h2>
                <p className="hero-description">
                  This is your profile page. You can see the progress you've made with your work and manage your projects or assigned tasks
                </p>
                <button className="btn-edit-profile">
                  <FaEdit style={{ marginRight: '0.5rem' }} />
                  Edit profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main-content">
            <div className="profile-grid">
              {/* Left Column - Account Information */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <h2 className="profile-card-title">My account</h2>
                  <button className="btn-settings">
                    <FaCog />
                    Settings
                  </button>
                </div>

                {message.text && (
                  <div className={`profile-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                {/* E-Commerce Statistics */}
                <div className="ecommerce-stats">
                  <div className="stat-box">
                    <div className="stat-box-icon">
                      <FaShoppingBag />
                    </div>
                    <div className="stat-box-value">{stats.orders}</div>
                    <div className="stat-box-label">Total Orders</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-icon">
                      <FaHeart />
                    </div>
                    <div className="stat-box-value">{stats.wishlist}</div>
                    <div className="stat-box-label">Wishlist Items</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-icon">
                      <FaStar />
                    </div>
                    <div className="stat-box-value">{stats.reviews}</div>
                    <div className="stat-box-label">Reviews Written</div>
                  </div>
                </div>

                <form onSubmit={handlePersonalInfoSubmit}>
                  {/* User Information Section */}
                  <div className="form-section">
                    <div className="section-label">User Information</div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          value={personalInfo.username}
                          onChange={handlePersonalInfoChange}
                          placeholder="lucky.jesse"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email address</label>
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          placeholder="jesse@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>First name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalInfoChange}
                          placeholder="Lucky"
                        />
                      </div>
                      <div className="form-group">
                        <label>Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalInfoChange}
                          placeholder="Jesse"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="form-section">
                    <div className="section-label">Contact Information</div>
                    <div className="form-row full">
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          name="address"
                          value={personalInfo.address}
                          onChange={handlePersonalInfoChange}
                          placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={personalInfo.city}
                          onChange={handlePersonalInfoChange}
                          placeholder="New York"
                        />
                      </div>
                      <div className="form-group">
                        <label>Country</label>
                        <input
                          type="text"
                          name="country"
                          value={personalInfo.country}
                          onChange={handlePersonalInfoChange}
                          placeholder="United States"
                        />
                      </div>
                      <div className="form-group">
                        <label>Postal code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={personalInfo.postalCode}
                          onChange={handlePersonalInfoChange}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Me Section */}
                  <div className="form-section">
                    <div className="section-label">About Me</div>
                    <div className="form-row full">
                      <div className="form-group">
                        <label>About Me</label>
                        <textarea
                          name="bio"
                          value={personalInfo.bio}
                          onChange={handlePersonalInfoChange}
                          placeholder="Tell us about yourself..."
                          rows="5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Section */}
                  <div className="orders-section">
                    <div className="orders-header">
                      <h3 className="orders-title">Recent Orders</h3>
                      <button type="button" className="btn-view-all">
                        View All
                      </button>
                    </div>
                    <div className="recent-orders">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="order-item">
                          <div className="order-info">
                            <div className="order-icon">
                              {getStatusIcon(order.status)}
                            </div>
                            <div className="order-details">
                              <h4>{order.name}</h4>
                              <p>{order.id} • {order.date}</p>
                            </div>
                          </div>
                          <span className={`order-status ${getStatusClass(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
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

              {/* Right Column - User Profile Card */}
              <div className="user-profile-card">
                <div className="profile-image-section">
                  <div className="profile-image-wrapper">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="profile-image" />
                    ) : (
                      <div className="profile-placeholder">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-number">{stats.orders}</span>
                    <span className="stat-label">Orders</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{stats.wishlist}</span>
                    <span className="stat-label">Wishlist</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{stats.reviews}</span>
                    <span className="stat-label">Reviews</span>
                  </div>
                </div>

                <div className="user-details">
                  <h3 className="user-name">
                    {personalInfo.firstName} {personalInfo.lastName}, 27
                  </h3>
                  <div className="user-location">
                    <FaMapMarkerAlt />
                    {personalInfo.city || 'Bucharest'}, {personalInfo.country || 'Romania'}
                  </div>
                  <div className="user-role">Solution Manager - Creative Tim Officer</div>
                  <div className="user-company">University of Computer Science</div>
                  
                  <p className="user-bio">
                    {showFullBio 
                      ? personalInfo.bio 
                      : `${personalInfo.bio?.substring(0, 100)}${personalInfo.bio?.length > 100 ? '...' : ''}`
                    }
                  </p>
                  {personalInfo.bio?.length > 100 && (
                    <button 
                      className="btn-show-more" 
                      onClick={() => setShowFullBio(!showFullBio)}
                    >
                      {showFullBio ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>

                <div className="profile-actions">
                  <button className="btn-connect">Connect</button>
                  <button className="btn-message">Message</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Profile;