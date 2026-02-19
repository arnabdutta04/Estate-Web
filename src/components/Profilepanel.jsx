// src/components/ProfilePanel.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './ProfilePanel.css';
import {
  FaUser, FaCamera, FaEdit, FaTimes, FaBriefcase, FaPlus,
  FaCrown, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone,
  FaBirthdayCake, FaWallet, FaGlobe, FaCity, FaMailBulk,
  FaSignOutAlt, FaHeart, FaSearch, FaChevronRight, FaShieldAlt
} from 'react-icons/fa';

const ProfilePanel = ({ isOpen, onClose }) => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeNav, setActiveNav] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    userRole: user?.role || 'customer'
  });

  const [addressInfo, setAddressInfo] = useState({
    country: user?.country || '',
    city: user?.city || '',
    postalCode: user?.postalCode || ''
  });

  const [balance, setBalance] = useState(Number(user?.balance) || 0);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);

  /* ── handlers ── */
  const handlePersonalInfoChange = (e) =>
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    try {
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
      const { data } = await api.put('/auth/update-profile', {
        name: fullName, email: personalInfo.email,
        phone: personalInfo.phone, dateOfBirth: personalInfo.dateOfBirth,
        role: personalInfo.userRole
      });
      updateUser(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setShowEditModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally { setLoading(false); }
  };

  const handleAddressChange = (e) =>
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });

  const handleAddressSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/auth/update-address', addressInfo);
      updateUser(data.user);
      setMessage({ type: 'success', text: 'Address updated!' });
      setShowAddressModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update address' });
    } finally { setLoading(false); }
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      setLoading(false); return;
    }
    try {
      const { data } = await api.post('/auth/update-balance', { amount });
      updateUser(data.user);
      setBalance(data.user.balance);
      setMessage({ type: 'success', text: `Added $${amount.toFixed(2)} to balance!` });
      setShowBalanceModal(false); setTopUpAmount('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update balance' });
    } finally { setLoading(false); }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
    uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const { data } = await api.post('/auth/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(data.user);
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload picture' });
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); onClose(); navigate('/'); };
  const go = (path) => { onClose(); navigate(path); };

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'User';
  const locationStr = [addressInfo.city, addressInfo.country].filter(Boolean).join(', ');

  if (!isOpen) return null;

  return (
    <>
      {/* dim backdrop */}
      <div className="pp-backdrop" onClick={onClose} />

      {/* ═══════════════════ PANEL ═══════════════════ */}
      <div className="pp-panel">

        {/* ──────── COL 1  narrow purple sidebar ──────── */}
        <aside className="pp-sidebar">
          <div className="pp-sidebar-brand">PROPIFY</div>

          <nav className="pp-sidebar-nav">
            {[
              { key: 'profile',    icon: <FaUser />,     label: 'Profile' },
              { key: 'address',    icon: <FaGlobe />,    label: 'Address' },
              { key: 'balance',    icon: <FaWallet />,   label: 'Balance', badge: balance > 0 ? `$${Math.floor(balance)}` : null },
              { key: 'explore',    icon: <FaSearch />,   label: 'Explore' },
              { key: 'properties', icon: <FaHeart />,    label: 'Properties' },
              ...(personalInfo.userRole === 'broker' ? [
                { key: 'dashboard',  icon: <FaBriefcase />, label: 'Dashboard' },
                { key: 'addprop',    icon: <FaPlus />,      label: 'Add Property' },
              ] : []),
              ...(personalInfo.userRole === 'admin' ? [
                { key: 'admin',      icon: <FaShieldAlt />, label: 'Admin' },
              ] : []),
            ].map(item => (
              <button
                key={item.key}
                className={`pp-sidebar-item ${activeNav === item.key ? 'pp-sidebar-active' : ''}`}
                onClick={() => {
                  setActiveNav(item.key);
                  if (item.key === 'address')    setShowAddressModal(true);
                  if (item.key === 'balance')    setShowBalanceModal(true);
                  if (item.key === 'explore')    go('/explore');
                  if (item.key === 'properties') go('/properties');
                  if (item.key === 'dashboard')  go('/broker/dashboard');
                  if (item.key === 'addprop')    go('/broker/add-property');
                  if (item.key === 'admin')      go('/admin');
                }}
              >
                <span className="pp-sidebar-icon">{item.icon}</span>
                <span className="pp-sidebar-label">{item.label}</span>
                {item.badge && <span className="pp-sidebar-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <button className="pp-sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </aside>

        {/* ──────── COL 2  main content ──────── */}
        <main className="pp-main">
          {/* top bar */}
          <div className="pp-main-topbar">
            <h1 className="pp-main-title">Profile</h1>
            <button className="pp-close-btn" onClick={onClose} title="Close"><FaTimes /></button>
          </div>

          {/* toast */}
          {message.text && (
            <div className={`pp-toast pp-toast-${message.type}`}>
              {message.text}
              <button onClick={() => setMessage({ type: '', text: '' })}><FaTimes /></button>
            </div>
          )}

          {/* ── big profile card (like screenshot top-centre) ── */}
          <div className="pp-profile-card">
            {/* avatar column */}
            <div className="pp-avatar-col">
              <div className="pp-avatar">
                {previewUrl
                  ? <img src={previewUrl} alt="Profile" />
                  : <span>{personalInfo.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>
                }
                <label htmlFor="pp-avatar-input" className="pp-avatar-cam">
                  <FaCamera />
                  <input type="file" id="pp-avatar-input" accept="image/*"
                    onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* info column */}
            <div className="pp-info-col">
              <div className="pp-name-row">
                <h2 className="pp-full-name">{fullName}</h2>
                <button className="pp-edit-icon-btn" onClick={() => setShowEditModal(true)}>
                  <FaEdit />
                </button>
              </div>

              <div className="pp-detail-rows">
                <div className="pp-detail-row">
                  <span className="pp-detail-label"><FaEnvelope /> Email:</span>
                  <span className="pp-detail-val">{personalInfo.email || '—'}</span>
                </div>
                <div className="pp-detail-row">
                  <span className="pp-detail-label"><FaPhone /> Phone:</span>
                  <span className="pp-detail-val">{personalInfo.phone || 'Not set'}</span>
                </div>
                <div className="pp-detail-row">
                  <span className="pp-detail-label"><FaBirthdayCake /> Date of Birth:</span>
                  <span className="pp-detail-val">{personalInfo.dateOfBirth || 'Not set'}</span>
                </div>
                {locationStr && (
                  <div className="pp-detail-row">
                    <span className="pp-detail-label"><FaMapMarkerAlt /> Location:</span>
                    <span className="pp-detail-val">{locationStr}</span>
                  </div>
                )}
                <div className="pp-detail-row">
                  <span className="pp-detail-label"><FaUser /> Role:</span>
                  <span className={`pp-role-chip pp-role-${personalInfo.userRole}`}>
                    {personalInfo.userRole === 'admin'  && <FaCrown />}
                    {personalInfo.userRole === 'broker' && <FaBuilding />}
                    {personalInfo.userRole}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Address section ── */}
          <div className="pp-section-card">
            <div className="pp-section-head">
              <h3>Address</h3>
              <button className="pp-section-edit-btn" onClick={() => setShowAddressModal(true)}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="pp-addr-grid">
              <div className="pp-addr-item">
                <span className="pp-addr-icon"><FaGlobe /></span>
                <div><label>Country</label><p>{addressInfo.country || 'Not set'}</p></div>
              </div>
              <div className="pp-addr-item">
                <span className="pp-addr-icon"><FaCity /></span>
                <div><label>City</label><p>{addressInfo.city || 'Not set'}</p></div>
              </div>
              <div className="pp-addr-item">
                <span className="pp-addr-icon"><FaMailBulk /></span>
                <div><label>Postal Code</label><p>{addressInfo.postalCode || 'Not set'}</p></div>
              </div>
            </div>
          </div>

          {/* ── Broker section ── */}
          {personalInfo.userRole === 'broker' && (
            <div className="pp-section-card pp-broker-sect">
              <div className="pp-section-head">
                <h3><FaBriefcase /> Broker Dashboard</h3>
              </div>
              <div className="pp-broker-row">
                <button className="pp-broker-action-btn" onClick={() => go('/broker/dashboard')}>
                  <FaBriefcase /> View Dashboard <FaChevronRight />
                </button>
                <button className="pp-broker-action-btn" onClick={() => go('/broker/add-property')}>
                  <FaPlus /> Add Property <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ──────── COL 3  right panel ──────── */}
        <aside className="pp-right">
          {/* Balance card — like "Платёжные данные" */}
          <div className="pp-right-card">
            <h3 className="pp-right-card-title">Balance</h3>
            <div className="pp-balance-big">
              <span className="pp-balance-sym">$</span>
              <span className="pp-balance-num">{(Number(balance) || 0).toFixed(2)}</span>
            </div>
            <p className="pp-balance-sub">Available funds</p>
            <button className="pp-topup-btn" onClick={() => setShowBalanceModal(true)}>
              <FaPlus /> Top Up
            </button>
          </div>

          {/* Account quick-view */}
          <div className="pp-right-card pp-right-card-dark">
            <h3 className="pp-right-card-title">Account</h3>
            <div className="pp-right-rows">
              <div className="pp-right-row">
                <span className="pp-right-icon"><FaUser /></span>
                <div><label>Role</label><p>{personalInfo.userRole}</p></div>
              </div>
              <div className="pp-right-row">
                <span className="pp-right-icon"><FaEnvelope /></span>
                <div><label>Email</label><p className="pp-right-truncate">{personalInfo.email || '—'}</p></div>
              </div>
              <div className="pp-right-row">
                <span className="pp-right-icon"><FaPhone /></span>
                <div><label>Phone</label><p>{personalInfo.phone || '—'}</p></div>
              </div>
            </div>
          </div>

          {/* Broker upgrade promo (non-brokers) */}
          {personalInfo.userRole === 'customer' && (
            <div className="pp-right-card pp-right-promo">
              <h3 className="pp-right-card-title">Go Pro</h3>
              <ul className="pp-promo-list">
                <li>List your properties</li>
                <li>Reach buyers faster</li>
                <li>Full broker dashboard</li>
                <li>Priority support</li>
              </ul>
              <button className="pp-promo-btn" onClick={() => go('/contact')}>
                Learn More
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* ══════════════ MODALS ══════════════ */}

      {showEditModal && (
        <div className="pp-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="pp-modal" onClick={e => e.stopPropagation()}>
            <div className="pp-modal-head">
              <h3>Edit Personal Information</h3>
              <button onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="pp-modal-grid">
                <div className="pp-form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange} placeholder="First Name" required />
                </div>
                <div className="pp-form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange} placeholder="Last Name" required />
                </div>
                <div className="pp-form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={personalInfo.email}
                    onChange={handlePersonalInfoChange} placeholder="email@example.com" required />
                </div>
                <div className="pp-form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={personalInfo.phone}
                    onChange={handlePersonalInfoChange} placeholder="+1 234 567 8900" />
                </div>
                <div className="pp-form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={personalInfo.dateOfBirth}
                    onChange={handlePersonalInfoChange} />
                </div>
                <div className="pp-form-group">
                  <label>User Role</label>
                  <select name="userRole" value={personalInfo.userRole}
                    onChange={handlePersonalInfoChange} disabled>
                    <option value="customer">Customer</option>
                    <option value="broker">Broker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="pp-modal-foot">
                <button type="submit" className="pp-btn-save" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="pp-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="pp-modal" onClick={e => e.stopPropagation()}>
            <div className="pp-modal-head">
              <h3>Edit Address</h3>
              <button onClick={() => setShowAddressModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleAddressSubmit}>
              <div className="pp-modal-grid">
                <div className="pp-form-group">
                  <label>Country</label>
                  <input type="text" name="country" value={addressInfo.country}
                    onChange={handleAddressChange} placeholder="United States" required />
                </div>
                <div className="pp-form-group">
                  <label>City</label>
                  <input type="text" name="city" value={addressInfo.city}
                    onChange={handleAddressChange} placeholder="New York" required />
                </div>
                <div className="pp-form-group">
                  <label>Postal Code</label>
                  <input type="text" name="postalCode" value={addressInfo.postalCode}
                    onChange={handleAddressChange} placeholder="10001" required />
                </div>
              </div>
              <div className="pp-modal-foot">
                <button type="submit" className="pp-btn-save" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBalanceModal && (
        <div className="pp-modal-overlay" onClick={() => setShowBalanceModal(false)}>
          <div className="pp-modal" onClick={e => e.stopPropagation()}>
            <div className="pp-modal-head">
              <h3>Top Up Balance</h3>
              <button onClick={() => setShowBalanceModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleTopUpSubmit}>
              <div className="pp-balance-modal-body">
                <div className="pp-cur-bal-row">
                  <span>Current Balance</span>
                  <strong>${(Number(balance) || 0).toFixed(2)}</strong>
                </div>
                <div className="pp-form-group">
                  <label>Amount to Add</label>
                  <div className="pp-amount-wrap">
                    <span>$</span>
                    <input type="number" step="0.01" min="0.01" value={topUpAmount}
                      onChange={e => setTopUpAmount(e.target.value)} placeholder="0.00" required />
                  </div>
                </div>
                <div className="pp-quick-section">
                  <label>Quick Add</label>
                  <div className="pp-quick-btns">
                    {['10', '50', '100', '500'].map(v => (
                      <button key={v} type="button"
                        className={`pp-quick-btn ${topUpAmount === v ? 'pp-quick-active' : ''}`}
                        onClick={() => setTopUpAmount(v)}>${v}</button>
                    ))}
                  </div>
                </div>
                {topUpAmount && !isNaN(parseFloat(topUpAmount)) && (
                  <div className="pp-new-bal">
                    <span>New Balance:</span>
                    <strong>${(balance + parseFloat(topUpAmount)).toFixed(2)}</strong>
                  </div>
                )}
              </div>
              <div className="pp-modal-foot">
                <button type="submit" className="pp-btn-save pp-btn-topup"
                  disabled={loading || !topUpAmount}>
                  {loading ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePanel;