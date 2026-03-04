// src/components/ProfilePanel.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './ProfilePanel.css';
import {
  FaUser, FaCamera, FaEdit, FaTimes, FaBriefcase, FaPlus,
  FaCrown, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone,
  FaBirthdayCake, FaWallet, FaGlobe, FaCity, FaMailBulk,
  FaSignOutAlt, FaHeart, FaSearch, FaChevronRight, FaShieldAlt,
  FaBars
} from 'react-icons/fa';

const ProfilePanel = ({ isOpen, onClose }) => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading]               = useState(false);
  const [message, setMessage]               = useState({ type: '', text: '' });
  const [activeNav, setActiveNav]           = useState('profile');
  const [showEditModal, setShowEditModal]   = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', dateOfBirth: '', userRole: 'customer'
  });
  const [addressInfo, setAddressInfo] = useState({ country: '', city: '', postalCode: '' });
  const [balance, setBalance]     = useState(0);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [previewUrl, setPreviewUrl]   = useState(null);

  // ✅ CORE FIX: sync from user context whenever it loads/changes
  // Old code used useState(user?.name) which runs once before user loads async
  // causing "User" name and "—" email to appear permanently
  useEffect(() => {
    if (!user) return;
    const parts = (user.name || '').trim().split(' ');
    setPersonalInfo({
      firstName:   parts[0] || '',
      lastName:    parts.slice(1).join(' ') || '',
      email:       user.email       || '',
      phone:       user.phone       || '',
      dateOfBirth: user.dateOfBirth || '',
      userRole:    user.role        || 'customer'
    });
    setAddressInfo({
      country:    user.country    || '',
      city:       user.city       || '',
      postalCode: user.postalCode || ''
    });
    setBalance(Number(user.balance) || 0);
    setPreviewUrl(user.profilePicture || null);
  }, [user]);

  useEffect(() => { if (!isOpen) setMobileSidebarOpen(false); }, [isOpen]);

  const handlePersonalInfoChange = e =>
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });

  const handlePersonalInfoSubmit = async e => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    try {
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
      const { data } = await api.put('/auth/update-profile', {
        name: fullName, email: personalInfo.email,
        phone: personalInfo.phone, dateOfBirth: personalInfo.dateOfBirth
      });
      updateUser(data.user);
      setMessage({ type: 'success', text: 'Profile updated!' });
      setShowEditModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally { setLoading(false); }
  };

  const handleAddressChange = e =>
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });

  const handleAddressSubmit = async e => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/auth/update-address', addressInfo);
      updateUser(data.user);
      setMessage({ type: 'success', text: 'Address updated!' });
      setShowAddressModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally { setLoading(false); }
  };

  const handleTopUpSubmit = async e => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount' });
      setLoading(false); return;
    }
    try {
      const { data } = await api.post('/auth/update-balance', { amount });
      updateUser(data.user);
      setBalance(Number(data.user.balance));
      setMessage({ type: 'success', text: `Added $${amount.toFixed(2)}!` });
      setShowBalanceModal(false); setTopUpAmount('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed' });
    } finally { setLoading(false); }
  };

  const handleProfilePictureChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
    uploadProfilePicture(file);
  };

  const uploadProfilePicture = async file => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('profilePicture', file);
      const { data } = await api.post('/auth/upload-profile-picture', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(data.user);
      setMessage({ type: 'success', text: 'Picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); onClose(); navigate('/'); };
  const go = path => { onClose(); navigate(path); };

  const fullName   = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || user?.name || 'User';
  const locStr     = [addressInfo.city, addressInfo.country].filter(Boolean).join(', ');
  const avatarChar = (personalInfo.firstName || user?.name || 'U').charAt(0).toUpperCase();

  if (!isOpen) return null;

  const navItems = [
    { key: 'profile',    icon: <FaUser />,      label: 'Profile' },
    { key: 'address',    icon: <FaGlobe />,     label: 'Address' },
    { key: 'balance',    icon: <FaWallet />,    label: 'Balance', badge: balance > 0 ? `$${Math.floor(balance)}` : null },
    { key: 'explore',    icon: <FaSearch />,    label: 'Explore' },
    { key: 'properties', icon: <FaHeart />,     label: 'Properties' },
    ...(personalInfo.userRole === 'broker' ? [
      { key: 'dashboard', icon: <FaBriefcase />, label: 'Dashboard' },
      { key: 'addprop',   icon: <FaPlus />,      label: 'Add Property' },
    ] : []),
    ...(personalInfo.userRole === 'admin' ? [
      { key: 'admin', icon: <FaShieldAlt />, label: 'Admin Panel' },
    ] : []),
  ];

  const onNavClick = key => {
    setActiveNav(key); setMobileSidebarOpen(false);
    if (key === 'address')    setShowAddressModal(true);
    if (key === 'balance')    setShowBalanceModal(true);
    if (key === 'explore')    go('/explore');
    if (key === 'properties') go('/properties');
    if (key === 'dashboard')  go('/broker/dashboard');
    if (key === 'addprop')    go('/broker/add-property');
    if (key === 'admin')      go('/admin');
  };

  return (
    <>
      <div className="pp-backdrop" onClick={onClose} />

      <div className="pp-panel">

        {/* mobile top bar */}
        <div className="pp-mobile-bar">
          <button className="pp-hamburger" onClick={() => setMobileSidebarOpen(v => !v)}>
            <FaBars />
          </button>
          <span className="pp-mobile-title">My Profile</span>
          <button className="pp-mobile-close" onClick={onClose}><FaTimes /></button>
        </div>

        {mobileSidebarOpen && (
          <div className="pp-mob-overlay" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* ══ SIDEBAR ══ */}
        <aside className={`pp-sidebar ${mobileSidebarOpen ? 'pp-sidebar--open' : ''}`}>
          <div className="pp-sidebar-brand">PROPIFY</div>
          <nav className="pp-sidebar-nav">
            {navItems.map(item => (
              <button key={item.key}
                className={`pp-sidebar-item ${activeNav === item.key ? 'pp-sidebar-active' : ''}`}
                onClick={() => onNavClick(item.key)}>
                <span className="pp-s-icon">{item.icon}</span>
                <span className="pp-s-label">{item.label}</span>
                {item.badge && <span className="pp-s-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <button className="pp-sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="pp-main">
          <div className="pp-main-topbar">
            <h1 className="pp-main-title">My Profile</h1>
            <button className="pp-close-btn" onClick={onClose}><FaTimes /></button>
          </div>

          {message.text && (
            <div className={`pp-toast pp-toast-${message.type}`}>
              <span>{message.text}</span>
              <button onClick={() => setMessage({ type: '', text: '' })}><FaTimes /></button>
            </div>
          )}

          {/* ── profile card ── */}
          <div className="pp-profile-card">
            <div className="pp-avatar-wrap">
              <div className="pp-avatar">
                {previewUrl ? <img src={previewUrl} alt="avatar" /> : <span>{avatarChar}</span>}
                <label htmlFor="pp-pic-input" className="pp-avatar-cam" title="Change photo">
                  <FaCamera />
                  <input id="pp-pic-input" type="file" accept="image/*"
                    onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <div className="pp-info-col">
              <div className="pp-name-row">
                <h2 className="pp-full-name">{fullName}</h2>
                <button className="pp-edit-icon-btn" onClick={() => setShowEditModal(true)} title="Edit">
                  <FaEdit />
                </button>
              </div>
              <div className="pp-detail-rows">
                <div className="pp-detail-row">
                  <span className="pp-d-label"><FaEnvelope /> Email</span>
                  <span className="pp-d-val">{personalInfo.email || user?.email || '—'}</span>
                </div>
                <div className="pp-detail-row">
                  <span className="pp-d-label"><FaPhone /> Phone</span>
                  <span className="pp-d-val">{personalInfo.phone || 'Not set'}</span>
                </div>
                <div className="pp-detail-row">
                  <span className="pp-d-label"><FaBirthdayCake /> Birthday</span>
                  <span className="pp-d-val">{personalInfo.dateOfBirth || 'Not set'}</span>
                </div>
                {locStr && (
                  <div className="pp-detail-row">
                    <span className="pp-d-label"><FaMapMarkerAlt /> Location</span>
                    <span className="pp-d-val">{locStr}</span>
                  </div>
                )}
                <div className="pp-detail-row">
                  <span className="pp-d-label"><FaUser /> Role</span>
                  <span className={`pp-role-chip pp-role-${personalInfo.userRole}`}>
                    {personalInfo.userRole === 'admin'  && <FaCrown />}
                    {personalInfo.userRole === 'broker' && <FaBuilding />}
                    {personalInfo.userRole}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── address ── */}
          <div className="pp-section-card">
            <div className="pp-section-head">
              <h3><FaGlobe /> Address</h3>
              <button className="pp-section-edit-btn" onClick={() => setShowAddressModal(true)}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="pp-addr-grid">
              {[
                { icon: <FaGlobe />,    label: 'Country',     val: addressInfo.country },
                { icon: <FaCity />,     label: 'City',        val: addressInfo.city },
                { icon: <FaMailBulk />, label: 'Postal Code', val: addressInfo.postalCode },
              ].map(({ icon, label, val }) => (
                <div className="pp-addr-item" key={label}>
                  <span className="pp-addr-icon">{icon}</span>
                  <div>
                    <label>{label}</label>
                    <p>{val || 'Not set'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── mobile balance (shown only on small screens) ── */}
          <div className="pp-mob-balance">
            <div>
              <p className="pp-mob-bal-label">Balance</p>
              <p className="pp-mob-bal-val">${(Number(balance) || 0).toFixed(2)}</p>
            </div>
            <button className="pp-topup-btn" onClick={() => setShowBalanceModal(true)}>
              <FaPlus /> Top Up
            </button>
          </div>

          {/* ── broker ── */}
          {personalInfo.userRole === 'broker' && (
            <div className="pp-section-card pp-broker-sect">
              <div className="pp-section-head"><h3><FaBriefcase /> Broker Dashboard</h3></div>
              <div className="pp-broker-row">
                <button className="pp-broker-btn" onClick={() => go('/broker/dashboard')}>
                  <FaBriefcase /> Dashboard <FaChevronRight />
                </button>
                <button className="pp-broker-btn" onClick={() => go('/broker/add-property')}>
                  <FaPlus /> Add Property <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* ── admin ── */}
          {personalInfo.userRole === 'admin' && (
            <div className="pp-section-card pp-admin-sect">
              <div className="pp-section-head"><h3><FaShieldAlt /> Admin Controls</h3></div>
              <div className="pp-broker-row">
                <button className="pp-broker-btn" onClick={() => go('/admin')}>
                  <FaShieldAlt /> Admin Dashboard <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ══ RIGHT PANEL (desktop only) ══ */}
        <aside className="pp-right">
          <div className="pp-right-card">
            <h3 className="pp-rc-title">Balance</h3>
            <div className="pp-bal-big">
              <span className="pp-bal-sym">$</span>
              <span className="pp-bal-num">{(Number(balance) || 0).toFixed(2)}</span>
            </div>
            <p className="pp-bal-sub">Available funds</p>
            <button className="pp-topup-btn" onClick={() => setShowBalanceModal(true)}>
              <FaPlus /> Top Up
            </button>
          </div>

          <div className="pp-right-card pp-rc-dark">
            <h3 className="pp-rc-title">Account</h3>
            <div className="pp-rc-rows">
              {[
                { icon: <FaUser />,     label: 'Role',  val: personalInfo.userRole },
                { icon: <FaEnvelope />, label: 'Email', val: personalInfo.email || user?.email || '—', trunc: true },
                { icon: <FaPhone />,    label: 'Phone', val: personalInfo.phone || '—' },
              ].map(({ icon, label, val, trunc }) => (
                <div className="pp-rc-row" key={label}>
                  <span className="pp-rc-icon">{icon}</span>
                  <div>
                    <label>{label}</label>
                    <p className={trunc ? 'pp-trunc' : ''}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {personalInfo.userRole === 'customer' && (
            <div className="pp-right-card pp-rc-promo">
              <h3 className="pp-rc-title">Go Pro</h3>
              <ul className="pp-promo-list">
                {['List your properties','Reach buyers faster','Full broker dashboard','Priority support']
                  .map(t => <li key={t}>{t}</li>)}
              </ul>
              <button className="pp-promo-btn" onClick={() => go('/contact')}>Learn More</button>
            </div>
          )}
        </aside>
      </div>

      {/* ══ EDIT MODAL ══ */}
      {showEditModal && (
        <div className="pp-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="pp-modal" onClick={e => e.stopPropagation()}>
            <div className="pp-modal-head">
              <h3>Edit Personal Info</h3>
              <button onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="pp-modal-grid">
                <div className="pp-fg"><label>First Name</label>
                  <input type="text" name="firstName" value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange} placeholder="First Name" required /></div>
                <div className="pp-fg"><label>Last Name</label>
                  <input type="text" name="lastName" value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange} placeholder="Last Name" /></div>
                <div className="pp-fg"><label>Email</label>
                  <input type="email" name="email" value={personalInfo.email}
                    onChange={handlePersonalInfoChange} placeholder="email@example.com" required /></div>
                <div className="pp-fg"><label>Phone</label>
                  <input type="tel" name="phone" value={personalInfo.phone}
                    onChange={handlePersonalInfoChange} placeholder="+91 99999 99999" /></div>
                <div className="pp-fg pp-fg-full"><label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={personalInfo.dateOfBirth}
                    onChange={handlePersonalInfoChange} /></div>
                <div className="pp-fg pp-fg-full"><label>Role</label>
                  <input value={personalInfo.userRole} disabled
                    style={{ opacity: .5, cursor: 'not-allowed' }} /></div>
              </div>
              <div className="pp-modal-foot">
                <button type="button" className="pp-btn-cancel"
                  onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="pp-btn-save" disabled={loading}>
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ ADDRESS MODAL ══ */}
      {showAddressModal && (
        <div className="pp-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="pp-modal pp-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="pp-modal-head">
              <h3>Edit Address</h3>
              <button onClick={() => setShowAddressModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleAddressSubmit}>
              <div className="pp-modal-grid pp-modal-1col">
                {[{name:'country',label:'Country',ph:'India'},
                  {name:'city',label:'City',ph:'Mumbai'},
                  {name:'postalCode',label:'Postal Code',ph:'400001'}].map(f => (
                  <div className="pp-fg" key={f.name}><label>{f.label}</label>
                    <input type="text" name={f.name} value={addressInfo[f.name]}
                      onChange={handleAddressChange} placeholder={f.ph} required /></div>
                ))}
              </div>
              <div className="pp-modal-foot">
                <button type="button" className="pp-btn-cancel"
                  onClick={() => setShowAddressModal(false)}>Cancel</button>
                <button type="submit" className="pp-btn-save" disabled={loading}>
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ BALANCE MODAL ══ */}
      {showBalanceModal && (
        <div className="pp-modal-overlay" onClick={() => setShowBalanceModal(false)}>
          <div className="pp-modal pp-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="pp-modal-head">
              <h3>Top Up Balance</h3>
              <button onClick={() => setShowBalanceModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleTopUpSubmit}>
              <div className="pp-bal-modal-body">
                <div className="pp-cur-bal">
                  <span>Current Balance</span>
                  <strong>${(Number(balance) || 0).toFixed(2)}</strong>
                </div>
                <div className="pp-fg"><label>Amount to Add</label>
                  <div className="pp-amount-wrap">
                    <span>$</span>
                    <input type="number" step="0.01" min="0.01" value={topUpAmount}
                      onChange={e => setTopUpAmount(e.target.value)}
                      placeholder="0.00" required autoFocus />
                  </div>
                </div>
                <div><label className="pp-quick-label">Quick Add</label>
                  <div className="pp-quick-btns">
                    {['10','50','100','500'].map(v => (
                      <button key={v} type="button"
                        className={`pp-quick-btn ${topUpAmount === v ? 'pp-quick-active' : ''}`}
                        onClick={() => setTopUpAmount(v)}>${v}</button>
                    ))}
                  </div>
                </div>
                {topUpAmount && !isNaN(parseFloat(topUpAmount)) && parseFloat(topUpAmount) > 0 && (
                  <div className="pp-new-bal">
                    <span>New Balance</span>
                    <strong>${(balance + parseFloat(topUpAmount)).toFixed(2)}</strong>
                  </div>
                )}
              </div>
              <div className="pp-modal-foot">
                <button type="button" className="pp-btn-cancel"
                  onClick={() => setShowBalanceModal(false)}>Cancel</button>
                <button type="submit" className="pp-btn-save pp-btn-green"
                  disabled={loading || !topUpAmount}>
                  {loading ? 'Processing…' : 'Add Funds'}
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