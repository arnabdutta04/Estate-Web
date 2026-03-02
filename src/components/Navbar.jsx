import React, { useContext, useState, useEffect, useTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBriefcase } from 'react-icons/fa';
import "./navbar.css";
import {
  FaUser, FaSignOutAlt, FaArrowRight, FaUserPlus, FaLock,
  FaCamera, FaEdit, FaTimes, FaPlus, FaCrown, FaBuilding,
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaBirthdayCake,
  FaWallet, FaGlobe, FaCity, FaMailBulk, FaHeart,
  FaSearch, FaChevronRight, FaShieldAlt, FaEye, FaEyeSlash
} from "react-icons/fa";
import api from "../utils/api";

/* ─────────────────────────────────────────
   Inline styles for the profile panel
───────────────────────────────────────── */
const S = {
  backdrop: {
    position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',
    backdropFilter:'blur(3px)',zIndex:900
  },
  panel: {
    position:'fixed',top:70,right:0,bottom:0,left:0,
    display:'flex',zIndex:901,overflow:'hidden',
    animation:'ppSlideUp .35s cubic-bezier(.22,1,.36,1)'
  },
  sidebar: {
    width:180,minWidth:180,
    background:'#3b3473',
    display:'flex',flexDirection:'column',
    padding:'28px 0 20px',overflowY:'auto'
  },
  brand: {
    fontSize:'1rem',fontWeight:800,color:'#fff',
    letterSpacing:'.12em',padding:'0 20px 28px',opacity:.9
  },
  sidenav: {flex:1,display:'flex',flexDirection:'column',gap:2,padding:'0 10px'},
  sideItem: (active) => ({
    display:'flex',alignItems:'center',gap:10,
    padding:'11px 14px',borderRadius:10,border:'none',
    background: active ? 'rgba(255,255,255,.18)' : 'transparent',
    color: active ? '#fff' : 'rgba(255,255,255,.6)',
    fontSize:'.84rem',fontWeight: active ? 700 : 500,
    cursor:'pointer',textAlign:'left',width:'100%',transition:'all .2s'
  }),
  sideLogout: {
    display:'flex',alignItems:'center',gap:10,
    margin:'12px 10px 0',padding:'10px 14px',borderRadius:10,
    border:'none',background:'rgba(255,255,255,.07)',
    color:'rgba(255,255,255,.55)',fontSize:'.84rem',cursor:'pointer'
  },
  sideBadge: {
    background:'rgba(255,255,255,.25)',color:'#fff',
    fontSize:'.65rem',fontWeight:700,padding:'2px 7px',borderRadius:10
  },
  main: {
    flex:1,background:'#f0f0f8',display:'flex',flexDirection:'column',
    gap:16,padding:'24px 28px',overflowY:'auto'
  },
  topbar: {display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4},
  mainTitle: {fontSize:'1.5rem',fontWeight:800,color:'#1a1a2e',margin:0},
  closeBtn: {
    width:36,height:36,borderRadius:'50%',border:'none',
    background:'rgba(0,0,0,.08)',color:'#666',display:'flex',
    alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'.85rem'
  },
  toast: (type) => ({
    display:'flex',alignItems:'center',justifyContent:'space-between',
    padding:'10px 16px',borderRadius:10,fontSize:'.84rem',fontWeight:500,
    background: type==='success'?'#d4f8ee':'#fde8e8',
    color: type==='success'?'#0a7c57':'#c0392b',
    border: `1px solid ${type==='success'?'#a0e8cf':'#f5b7b1'}`
  }),
  toastBtn: {background:'none',border:'none',color:'inherit',cursor:'pointer',display:'flex',padding:0},
  profileCard: {
    background:'#fff',borderRadius:16,padding:24,
    display:'flex',gap:24,boxShadow:'0 2px 16px rgba(60,40,120,.07)'
  },
  avatar: {
    position:'relative',width:100,height:100,borderRadius:'50%',
    background:'linear-gradient(135deg,#7c6fcd,#5a4fcf)',
    display:'flex',alignItems:'center',justifyContent:'center',
    fontSize:'2.4rem',fontWeight:800,color:'#fff',
    boxShadow:'0 4px 20px rgba(90,79,207,.3)',overflow:'visible'
  },
  avatarImg: {width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'},
  camBtn: {
    position:'absolute',bottom:2,right:2,width:28,height:28,
    borderRadius:'50%',background:'#5a4fcf',color:'#fff',
    display:'flex',alignItems:'center',justifyContent:'center',
    fontSize:'.65rem',cursor:'pointer',border:'2px solid #fff'
  },
  infoCol: {flex:1,minWidth:0},
  nameRow: {display:'flex',alignItems:'center',gap:10,marginBottom:14},
  fullName: {fontSize:'1.3rem',fontWeight:800,color:'#1a1a2e',margin:0},
  editIconBtn: {
    width:30,height:30,borderRadius:8,border:'none',
    background:'#f0eeff',color:'#5a4fcf',
    display:'flex',alignItems:'center',justifyContent:'center',
    cursor:'pointer',fontSize:'.85rem'
  },
  detailRows: {display:'flex',flexDirection:'column',gap:8},
  detailRow: {display:'flex',alignItems:'center',gap:10,fontSize:'.84rem'},
  detailLabel: {color:'#888',minWidth:130,display:'flex',alignItems:'center',gap:6},
  detailVal: {color:'#1a1a2e',fontWeight:600},
  roleChip: (role) => ({
    display:'inline-flex',alignItems:'center',gap:5,
    padding:'3px 12px',borderRadius:20,fontSize:'.72rem',fontWeight:700,
    textTransform:'uppercase',letterSpacing:'.06em',
    background: role==='admin'?'#fff8e0':role==='broker'?'#e0f8ff':'#eee8ff',
    color: role==='admin'?'#b07800':role==='broker'?'#0891b2':'#5a4fcf'
  }),
  sectionCard: (accent) => ({
    background: accent||'#fff',borderRadius:14,
    padding:'20px 22px',boxShadow:'0 2px 12px rgba(60,40,120,.06)'
  }),
  sectionHead: {display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16},
  sectionTitle: {fontSize:'.95rem',fontWeight:700,color:'#1a1a2e',margin:0,display:'flex',alignItems:'center',gap:7},
  sectionEditBtn: {
    display:'inline-flex',alignItems:'center',gap:5,
    padding:'6px 14px',borderRadius:8,border:'1px solid #ddd',
    background:'#f8f7ff',color:'#5a4fcf',fontSize:'.78rem',fontWeight:600,cursor:'pointer'
  },
  addrGrid: {display:'flex',gap:24,flexWrap:'wrap'},
  addrItem: {display:'flex',alignItems:'flex-start',gap:10,flex:1,minWidth:120},
  addrIcon: {marginTop:2,color:'#5a4fcf',fontSize:'.9rem'},
  addrLabel: {display:'block',fontSize:'.68rem',color:'#aaa',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:3},
  addrVal: {fontSize:'.87rem',color:'#1a1a2e',fontWeight:600,margin:0},
  brokerRow: {display:'flex',gap:12,flexWrap:'wrap'},
  brokerBtn: {
    display:'inline-flex',alignItems:'center',gap:8,
    padding:'10px 18px',borderRadius:10,border:'1px solid #c4b5fd',
    background:'#fff',color:'#5a4fcf',fontSize:'.84rem',fontWeight:600,cursor:'pointer'
  },
  rightCol: {
    width:230,minWidth:230,background:'#f0f0f8',
    borderLeft:'1px solid rgba(90,79,207,.1)',
    padding:'24px 16px',display:'flex',flexDirection:'column',
    gap:16,overflowY:'auto'
  },
  rightCard: (accent) => ({
    background: accent||'#fff',borderRadius:14,padding:18,
    boxShadow:'0 2px 12px rgba(60,40,120,.07)'
  }),
  rightTitle: {fontSize:'.85rem',fontWeight:700,color:'#1a1a2e',margin:'0 0 14px',textTransform:'uppercase',letterSpacing:'.07em'},
  balanceBig: {display:'flex',alignItems:'baseline',gap:4,marginBottom:4},
  balanceSym: {fontSize:'1.2rem',color:'#888',fontWeight:600},
  balanceNum: {fontSize:'2.2rem',fontWeight:900,color:'#1a1a2e',lineHeight:1},
  balanceSub: {fontSize:'.75rem',color:'#aaa',margin:'0 0 16px'},
  topupBtn: {
    width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
    padding:10,borderRadius:10,border:'none',background:'#5a4fcf',color:'#fff',
    fontSize:'.84rem',fontWeight:700,cursor:'pointer'
  },
  rightRows: {display:'flex',flexDirection:'column',gap:12},
  rightRow: {display:'flex',alignItems:'flex-start',gap:10},
  rightIcon: {
    width:28,height:28,borderRadius:8,background:'#eee8ff',color:'#5a4fcf',
    display:'flex',alignItems:'center',justifyContent:'center',
    fontSize:'.75rem',flexShrink:0,marginTop:1
  },
  rightLabel: {display:'block',fontSize:'.67rem',color:'#aaa',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2},
  rightVal: {fontSize:'.8rem',color:'#1a1a2e',fontWeight:600,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:130},
  promoCard: {
    background:'linear-gradient(135deg,#4338b8,#6d5ce7)',
    borderRadius:14,padding:18
  },
  promoTitle: {fontSize:'.85rem',fontWeight:700,color:'rgba(255,255,255,.85)',margin:'0 0 14px',textTransform:'uppercase'},
  promoList: {listStyle:'none',padding:0,margin:'0 0 16px',display:'flex',flexDirection:'column',gap:7},
  promoItem: {fontSize:'.8rem',color:'rgba(255,255,255,.85)',paddingLeft:14,position:'relative'},
  promoBtn: {
    width:'100%',padding:9,borderRadius:10,border:'none',
    background:'#fff',color:'#4338b8',fontSize:'.84rem',fontWeight:700,cursor:'pointer'
  },
  modalOverlay: {
    position:'fixed',inset:0,background:'rgba(0,0,0,.55)',
    backdropFilter:'blur(5px)',display:'flex',alignItems:'center',
    justifyContent:'center',zIndex:1000
  },
  modal: {
    background:'#fff',borderRadius:18,width:'90%',maxWidth:520,
    maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,.2)'
  },
  modalHead: {
    display:'flex',alignItems:'center',justifyContent:'space-between',
    padding:'20px 24px 16px',borderBottom:'1px solid #f0f0f0'
  },
  modalTitle: {fontSize:'.95rem',fontWeight:800,color:'#1a1a2e',margin:0},
  modalCloseBtn: {
    width:28,height:28,borderRadius:8,border:'none',background:'#f5f5f5',
    color:'#666',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'.8rem'
  },
  modalGrid: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,padding:'20px 24px'},
  formGroup: {display:'flex',flexDirection:'column',gap:6},
  formLabel: {fontSize:'.7rem',fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'.06em'},
  formInput: {
    background:'#f8f7ff',border:'1px solid #e0dcf8',borderRadius:9,
    padding:'10px 12px',color:'#1a1a2e',fontSize:'.84rem',outline:'none'
  },
  modalFoot: {padding:'16px 24px 20px',borderTop:'1px solid #f0f0f0',display:'flex',justifyContent:'flex-end'},
  saveBtn: (green) => ({
    padding:'11px 28px',borderRadius:10,border:'none',
    background: green?'#059669':'#5a4fcf',color:'#fff',
    fontSize:'.88rem',fontWeight:700,cursor:'pointer'
  }),
  balModalBody: {padding:'20px 24px',display:'flex',flexDirection:'column',gap:16},
  curBalRow: {
    display:'flex',alignItems:'center',justifyContent:'space-between',
    padding:'12px 16px',background:'#f8f7ff',borderRadius:10,
    fontSize:'.84rem',color:'#666'
  },
  amountWrap: {
    display:'flex',alignItems:'center',
    border:'1px solid #e0dcf8',borderRadius:10,overflow:'hidden'
  },
  amountSym: {padding:'10px 12px',color:'#888',fontWeight:700,borderRight:'1px solid #f0f0f0'},
  amountInput: {
    flex:1,background:'transparent',border:'none',
    padding:'10px 12px',color:'#1a1a2e',fontSize:'.88rem',outline:'none'
  },
  quickLabel: {fontSize:'.7rem',fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:8},
  quickBtns: {display:'flex',gap:8},
  quickBtn: (active) => ({
    flex:1,padding:8,borderRadius:8,
    border: active?'1px solid #5a4fcf':'1px solid #ddd',
    background: active?'#5a4fcf':'#f8f7ff',
    color: active?'#fff':'#5a4fcf',
    fontSize:'.82rem',fontWeight:700,cursor:'pointer'
  }),
  newBal: {
    display:'flex',alignItems:'center',justifyContent:'space-between',
    padding:'11px 14px',borderRadius:9,
    background:'#d4f8ee',border:'1px solid #a0e8cf',
    fontSize:'.84rem',color:'#0a7c57'
  },

  /* ── Auth Modal Styles ── */
  authOverlay: {
    position:'fixed',inset:0,
    background:'rgba(10,8,30,0.72)',
    backdropFilter:'blur(8px)',
    display:'flex',alignItems:'center',justifyContent:'center',
    zIndex:1100,
    animation:'fadeIn .25s ease'
  },
  authBox: {
    background:'#fff',
    borderRadius:22,
    width:'92%',
    maxWidth:420,
    boxShadow:'0 32px 80px rgba(30,10,90,.22)',
    overflow:'hidden',
    animation:'slideUp .32s cubic-bezier(.22,1,.36,1)'
  },
  authHeader: {
    background:'linear-gradient(135deg,#3b3473,#5a4fcf)',
    padding:'32px 28px 24px',
    position:'relative'
  },
  authLogo: {
    fontSize:'.72rem',fontWeight:900,color:'rgba(255,255,255,.5)',
    letterSpacing:'.2em',textTransform:'uppercase',marginBottom:12,display:'block'
  },
  authTitle: {
    fontSize:'1.6rem',fontWeight:900,color:'#fff',margin:'0 0 4px'
  },
  authSub: {
    fontSize:'.82rem',color:'rgba(255,255,255,.6)',margin:0
  },
  authCloseBtn: {
    position:'absolute',top:16,right:16,
    width:30,height:30,borderRadius:9,border:'none',
    background:'rgba(255,255,255,.15)',color:'#fff',
    display:'flex',alignItems:'center',justifyContent:'center',
    cursor:'pointer',fontSize:'.8rem'
  },
  authBody: {
    padding:'28px 28px 24px',
    display:'flex',flexDirection:'column',gap:16
  },
  authFormGroup: {
    display:'flex',flexDirection:'column',gap:6,position:'relative'
  },
  authLabel: {
    fontSize:'.68rem',fontWeight:800,color:'#888',
    textTransform:'uppercase',letterSpacing:'.08em'
  },
  authInput: {
    background:'#f5f4fc',border:'1.5px solid #e8e4f8',borderRadius:10,
    padding:'12px 14px',color:'#1a1a2e',fontSize:'.88rem',outline:'none',
    transition:'border-color .2s'
  },
  authInputPass: {
    background:'#f5f4fc',border:'1.5px solid #e8e4f8',borderRadius:10,
    padding:'12px 44px 12px 14px',color:'#1a1a2e',fontSize:'.88rem',outline:'none',
    width:'100%',boxSizing:'border-box',transition:'border-color .2s'
  },
  eyeBtn: {
    position:'absolute',right:12,bottom:11,
    background:'none',border:'none',color:'#aaa',cursor:'pointer',
    display:'flex',alignItems:'center',fontSize:'.9rem',padding:0
  },
  authSubmitBtn: {
    width:'100%',padding:'13px',borderRadius:11,border:'none',
    background:'linear-gradient(135deg,#5a4fcf,#7c6fcd)',
    color:'#fff',fontSize:'.92rem',fontWeight:800,cursor:'pointer',
    marginTop:4,boxShadow:'0 6px 20px rgba(90,79,207,.35)',
    transition:'opacity .2s'
  },
  authDivider: {
    display:'flex',alignItems:'center',gap:12,
    fontSize:'.72rem',color:'#ccc',fontWeight:600,letterSpacing:'.06em'
  },
  authDividerLine: {flex:1,height:1,background:'#ececec'},
  authSwitch: {
    textAlign:'center',fontSize:'.82rem',color:'#888',paddingBottom:4
  },
  authSwitchBtn: {
    background:'none',border:'none',color:'#5a4fcf',fontWeight:700,
    cursor:'pointer',fontSize:'.82rem',padding:'0 2px'
  },
  authError: {
    background:'#fde8e8',border:'1px solid #f5b7b1',
    borderRadius:9,padding:'10px 14px',
    fontSize:'.82rem',color:'#c0392b',fontWeight:500
  },
  authSuccess: {
    background:'#d4f8ee',border:'1px solid #a0e8cf',
    borderRadius:9,padding:'10px 14px',
    fontSize:'.82rem',color:'#0a7c57',fontWeight:500
  },
};

/* ─────────────────────────────────────────
   LoginModal
───────────────────────────────────────── */
function LoginModal({ onClose, onSwitch, onSuccess }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.authOverlay} onClick={onClose}>
      <div style={S.authBox} onClick={e => e.stopPropagation()}>
        <div style={S.authHeader}>
          <span style={S.authLogo}>PROPIFY</span>
          <h2 style={S.authTitle}>Welcome back</h2>
          <p style={S.authSub}>Sign in to your account to continue</p>
          <button style={S.authCloseBtn} onClick={onClose}><FaTimes /></button>
        </div>
        <div style={S.authBody}>
          {error && <div style={S.authError}>{error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={S.authFormGroup}>
              <label style={S.authLabel}>Email Address</label>
              <input style={S.authInput} type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" required autoFocus />
            </div>
            <div style={S.authFormGroup}>
              <label style={S.authLabel}>Password</label>
              <input style={S.authInputPass} type={showPass ? 'text' : 'password'}
                name="password" value={form.password} onChange={handleChange}
                placeholder="Enter your password" required />
              <button type="button" style={S.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" style={{...S.authSubmitBtn, opacity: loading ? .6 : 1}} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
          <div style={S.authSwitch}>
            Don't have an account?{' '}
            <button style={S.authSwitchBtn} onClick={onSwitch}>Create one</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RegisterModal
───────────────────────────────────────── */
function RegisterModal({ onClose, onSwitch, onSuccess }) {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.authOverlay} onClick={onClose}>
      <div style={S.authBox} onClick={e => e.stopPropagation()}>
        <div style={S.authHeader}>
          <span style={S.authLogo}>PROPIFY</span>
          <h2 style={S.authTitle}>Create account</h2>
          <p style={S.authSub}>Join thousands of property seekers</p>
          <button style={S.authCloseBtn} onClick={onClose}><FaTimes /></button>
        </div>
        <div style={S.authBody}>
          {error && <div style={S.authError}>{error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={S.authFormGroup}>
              <label style={S.authLabel}>Full Name</label>
              <input style={S.authInput} type="text" name="name"
                value={form.name} onChange={handleChange}
                placeholder="John Doe" required autoFocus />
            </div>
            <div style={S.authFormGroup}>
              <label style={S.authLabel}>Email Address</label>
              <input style={S.authInput} type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" required />
            </div>
            <div style={S.authFormGroup}>
              <label style={S.authLabel}>Password</label>
              <input style={S.authInputPass} type={showPass ? 'text' : 'password'}
                name="password" value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" required minLength={6} />
              <button type="button" style={S.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div style={S.authFormGroup}>
              <label style={S.authLabel}>Confirm Password</label>
              <input style={S.authInput} type="password" name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange}
                placeholder="Repeat your password" required />
            </div>
            <button type="submit" style={{...S.authSubmitBtn, opacity: loading ? .6 : 1}} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
          <div style={S.authSwitch}>
            Already have an account?{' '}
            <button style={S.authSwitchBtn} onClick={onSwitch}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ProfilePanel component
───────────────────────────────────────── */
function ProfilePanel({ isOpen, onClose }) {
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

  const handlePersonalInfoChange = (e) =>
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type:'', text:'' });
    try {
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
      const { data } = await api.put('/auth/update-profile', {
        name: fullName, email: personalInfo.email,
        phone: personalInfo.phone, dateOfBirth: personalInfo.dateOfBirth,
        role: personalInfo.userRole
      });
      updateUser(data.user);
      setMessage({ type:'success', text:'Profile updated successfully!' });
      setShowEditModal(false);
    } catch (err) {
      setMessage({ type:'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally { setLoading(false); }
  };

  const handleAddressChange = (e) =>
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });

  const handleAddressSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type:'', text:'' });
    try {
      const { data } = await api.put('/auth/update-address', addressInfo);
      updateUser(data.user);
      setMessage({ type:'success', text:'Address updated!' });
      setShowAddressModal(false);
    } catch (err) {
      setMessage({ type:'error', text: err.response?.data?.message || 'Failed to update address' });
    } finally { setLoading(false); }
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type:'', text:'' });
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type:'error', text:'Please enter a valid amount' });
      setLoading(false); return;
    }
    try {
      const { data } = await api.post('/auth/update-balance', { amount });
      updateUser(data.user);
      setBalance(data.user.balance);
      setMessage({ type:'success', text:`Added $${amount.toFixed(2)} to balance!` });
      setShowBalanceModal(false); setTopUpAmount('');
    } catch (err) {
      setMessage({ type:'error', text: err.response?.data?.message || 'Failed to update balance' });
    } finally { setLoading(false); }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
    (async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        const { data } = await api.post('/auth/upload-profile-picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        updateUser(data.user);
        setMessage({ type:'success', text:'Profile picture updated!' });
      } catch (err) {
        setMessage({ type:'error', text: err.response?.data?.message || 'Failed to upload picture' });
      } finally { setLoading(false); }
    })();
  };

  const handleLogout = () => { logout(); onClose(); navigate('/'); };
  const go = (path) => { onClose(); navigate(path); };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'User';
  const locationStr = [addressInfo.city, addressInfo.country].filter(Boolean).join(', ');

  if (!isOpen) return null;

  const navItems = [
    { key:'profile',    icon:<FaUser />,       label:'Profile' },
    { key:'address',    icon:<FaGlobe />,      label:'Address' },
    { key:'balance',    icon:<FaWallet />,     label:'Balance', badge: balance > 0 ? `$${Math.floor(balance)}` : null },
    { key:'explore',    icon:<FaSearch />,     label:'Explore' },
    { key:'properties', icon:<FaHeart />,      label:'Properties' },
    ...(personalInfo.userRole === 'broker' ? [
      { key:'dashboard', icon:<FaBriefcase />, label:'Dashboard' },
      { key:'addprop',   icon:<FaPlus />,      label:'Add Property' },
    ] : []),
    ...(personalInfo.userRole === 'admin' ? [
      { key:'admin',     icon:<FaShieldAlt />, label:'Admin' },
    ] : []),
  ];

  return (
    <>
      <style>{`
        @keyframes ppSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .pp-side-item:hover { background: rgba(255,255,255,.1) !important; color: #fff !important; }
        .pp-edit-btn:hover { background: #5a4fcf !important; color: #fff !important; }
        .pp-broker-btn:hover { background: #5a4fcf !important; color: #fff !important; border-color: #5a4fcf !important; }
        .pp-topup-hover:hover { background: #4338b8 !important; }
        .pp-logout:hover { background: rgba(255,80,80,.2) !important; color: #ff9090 !important; }
        .auth-input:focus { border-color: #5a4fcf !important; }
      `}</style>

      <div style={S.backdrop} onClick={onClose} />

      <div style={S.panel}>
        {/* ── Sidebar ── */}
        <aside style={S.sidebar}>
          <div style={S.brand}>PROPIFY</div>
          <nav style={S.sidenav}>
            {navItems.map(item => (
              <button key={item.key} className="pp-side-item"
                style={S.sideItem(activeNav === item.key)}
                onClick={() => {
                  setActiveNav(item.key);
                  if (item.key === 'address')    setShowAddressModal(true);
                  if (item.key === 'balance')    setShowBalanceModal(true);
                  if (item.key === 'explore')    go('/explore');
                  if (item.key === 'properties') go('/properties');
                  if (item.key === 'dashboard')  go('/broker/dashboard');
                  if (item.key === 'addprop')    go('/broker/add-property');
                  if (item.key === 'admin')      go('/admin');
                }}>
                <span style={{fontSize:'.9rem',width:16,flexShrink:0}}>{item.icon}</span>
                <span style={{flex:1}}>{item.label}</span>
                {item.badge && <span style={S.sideBadge}>{item.badge}</span>}
              </button>
            ))}
          </nav>
          <button className="pp-logout" style={S.sideLogout} onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </aside>

        {/* ── Main ── */}
        <main style={S.main}>
          <div style={S.topbar}>
            <h1 style={S.mainTitle}>Profile</h1>
            <button style={S.closeBtn} onClick={onClose}><FaTimes /></button>
          </div>

          {message.text && (
            <div style={S.toast(message.type)}>
              {message.text}
              <button style={S.toastBtn} onClick={() => setMessage({ type:'', text:'' })}><FaTimes /></button>
            </div>
          )}

          {/* Profile card */}
          <div style={S.profileCard}>
            <div>
              <div style={S.avatar}>
                {previewUrl
                  ? <img src={previewUrl} alt="Profile" style={S.avatarImg} />
                  : <span>{personalInfo.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>
                }
                <label htmlFor="pp-avatar-input" style={S.camBtn}>
                  <FaCamera />
                  <input type="file" id="pp-avatar-input" accept="image/*"
                    onChange={handleProfilePictureChange} style={{display:'none'}} />
                </label>
              </div>
            </div>
            <div style={S.infoCol}>
              <div style={S.nameRow}>
                <h2 style={S.fullName}>{fullName}</h2>
                <button style={S.editIconBtn} onClick={() => setShowEditModal(true)}><FaEdit /></button>
              </div>
              <div style={S.detailRows}>
                <div style={S.detailRow}>
                  <span style={S.detailLabel}><FaEnvelope /> Email:</span>
                  <span style={S.detailVal}>{personalInfo.email || '—'}</span>
                </div>
                <div style={S.detailRow}>
                  <span style={S.detailLabel}><FaPhone /> Phone:</span>
                  <span style={S.detailVal}>{personalInfo.phone || 'Not set'}</span>
                </div>
                <div style={S.detailRow}>
                  <span style={S.detailLabel}><FaBirthdayCake /> Date of Birth:</span>
                  <span style={S.detailVal}>{personalInfo.dateOfBirth || 'Not set'}</span>
                </div>
                {locationStr && (
                  <div style={S.detailRow}>
                    <span style={S.detailLabel}><FaMapMarkerAlt /> Location:</span>
                    <span style={S.detailVal}>{locationStr}</span>
                  </div>
                )}
                <div style={S.detailRow}>
                  <span style={S.detailLabel}><FaUser /> Role:</span>
                  <span style={S.roleChip(personalInfo.userRole)}>
                    {personalInfo.userRole === 'admin'  && <FaCrown />}
                    {personalInfo.userRole === 'broker' && <FaBuilding />}
                    {personalInfo.userRole}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div style={S.sectionCard()}>
            <div style={S.sectionHead}>
              <h3 style={S.sectionTitle}>Address</h3>
              <button className="pp-edit-btn" style={S.sectionEditBtn} onClick={() => setShowAddressModal(true)}>
                <FaEdit /> Edit
              </button>
            </div>
            <div style={S.addrGrid}>
              {[
                { icon:<FaGlobe />,    label:'Country',     val: addressInfo.country    || 'Not set' },
                { icon:<FaCity />,     label:'City',        val: addressInfo.city       || 'Not set' },
                { icon:<FaMailBulk />, label:'Postal Code', val: addressInfo.postalCode || 'Not set' },
              ].map(({ icon, label, val }) => (
                <div key={label} style={S.addrItem}>
                  <span style={S.addrIcon}>{icon}</span>
                  <div>
                    <label style={S.addrLabel}>{label}</label>
                    <p style={S.addrVal}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broker section */}
          {personalInfo.userRole === 'broker' && (
            <div style={S.sectionCard('#f5f0ff')}>
              <div style={S.sectionHead}>
                <h3 style={S.sectionTitle}><FaBriefcase /> Broker Dashboard</h3>
              </div>
              <div style={S.brokerRow}>
                <button className="pp-broker-btn" style={S.brokerBtn} onClick={() => go('/broker/dashboard')}>
                  <FaBriefcase /> View Dashboard <FaChevronRight />
                </button>
                <button className="pp-broker-btn" style={S.brokerBtn} onClick={() => go('/broker/add-property')}>
                  <FaPlus /> Add Property <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ── Right panel ── */}
        <aside style={S.rightCol}>
          <div style={S.rightCard()}>
            <h3 style={S.rightTitle}>Balance</h3>
            <div style={S.balanceBig}>
              <span style={S.balanceSym}>$</span>
              <span style={S.balanceNum}>{(Number(balance)||0).toFixed(2)}</span>
            </div>
            <p style={S.balanceSub}>Available funds</p>
            <button className="pp-topup-hover" style={S.topupBtn} onClick={() => setShowBalanceModal(true)}>
              <FaPlus /> Top Up
            </button>
          </div>

          <div style={S.rightCard('#f8f7ff')}>
            <h3 style={S.rightTitle}>Account</h3>
            <div style={S.rightRows}>
              {[
                { icon:<FaUser />,     label:'Role',  val: personalInfo.userRole },
                { icon:<FaEnvelope />, label:'Email', val: personalInfo.email || '—' },
                { icon:<FaPhone />,    label:'Phone', val: personalInfo.phone || '—' },
              ].map(({ icon, label, val }) => (
                <div key={label} style={S.rightRow}>
                  <span style={S.rightIcon}>{icon}</span>
                  <div>
                    <label style={S.rightLabel}>{label}</label>
                    <p style={S.rightVal}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {personalInfo.userRole === 'customer' && (
            <div style={S.promoCard}>
              <h3 style={S.promoTitle}>Go Pro</h3>
              <ul style={S.promoList}>
                {['List your properties','Reach buyers faster','Full broker dashboard','Priority support'].map(t => (
                  <li key={t} style={S.promoItem}>
                    <span style={{position:'absolute',left:0,color:'#a5f3d0',fontWeight:700}}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
              <button style={S.promoBtn} onClick={() => go('/contact')}>Learn More</button>
            </div>
          )}
        </aside>
      </div>

      {/* ── Edit Personal Info Modal ── */}
      {showEditModal && (
        <div style={S.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHead}>
              <h3 style={S.modalTitle}>Edit Personal Information</h3>
              <button style={S.modalCloseBtn} onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handlePersonalInfoSubmit}>
              <div style={S.modalGrid}>
                {[
                  { label:'First Name',    name:'firstName',   type:'text',  placeholder:'First Name',        required:true },
                  { label:'Last Name',     name:'lastName',    type:'text',  placeholder:'Last Name',         required:true },
                  { label:'Email',         name:'email',       type:'email', placeholder:'email@example.com', required:true },
                  { label:'Phone',         name:'phone',       type:'tel',   placeholder:'+1 234 567 8900' },
                  { label:'Date of Birth', name:'dateOfBirth', type:'date' },
                ].map(f => (
                  <div key={f.name} style={S.formGroup}>
                    <label style={S.formLabel}>{f.label}</label>
                    <input style={S.formInput} type={f.type} name={f.name}
                      value={personalInfo[f.name]} onChange={handlePersonalInfoChange}
                      placeholder={f.placeholder} required={f.required} />
                  </div>
                ))}
                <div style={S.formGroup}>
                  <label style={S.formLabel}>User Role</label>
                  <select style={S.formInput} name="userRole" value={personalInfo.userRole}
                    onChange={handlePersonalInfoChange} disabled>
                    <option value="customer">Customer</option>
                    <option value="broker">Broker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div style={S.modalFoot}>
                <button type="submit" style={{...S.saveBtn(false), opacity: loading ? .45 : 1, cursor: loading ? 'not-allowed' : 'pointer'}} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Address Modal ── */}
      {showAddressModal && (
        <div style={S.modalOverlay} onClick={() => setShowAddressModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHead}>
              <h3 style={S.modalTitle}>Edit Address</h3>
              <button style={S.modalCloseBtn} onClick={() => setShowAddressModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleAddressSubmit}>
              <div style={{...S.modalGrid, gridTemplateColumns:'1fr'}}>
                {[
                  { label:'Country',     name:'country',    placeholder:'United States' },
                  { label:'City',        name:'city',       placeholder:'New York' },
                  { label:'Postal Code', name:'postalCode', placeholder:'10001' },
                ].map(f => (
                  <div key={f.name} style={S.formGroup}>
                    <label style={S.formLabel}>{f.label}</label>
                    <input style={S.formInput} type="text" name={f.name}
                      value={addressInfo[f.name]} onChange={handleAddressChange}
                      placeholder={f.placeholder} required />
                  </div>
                ))}
              </div>
              <div style={S.modalFoot}>
                <button type="submit" style={{...S.saveBtn(false), opacity: loading ? .45 : 1}} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Top Up Balance Modal ── */}
      {showBalanceModal && (
        <div style={S.modalOverlay} onClick={() => setShowBalanceModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHead}>
              <h3 style={S.modalTitle}>Top Up Balance</h3>
              <button style={S.modalCloseBtn} onClick={() => setShowBalanceModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleTopUpSubmit}>
              <div style={S.balModalBody}>
                <div style={S.curBalRow}>
                  <span>Current Balance</span>
                  <strong style={{fontSize:'1rem',color:'#1a1a2e',fontWeight:800}}>${(Number(balance)||0).toFixed(2)}</strong>
                </div>
                <div style={S.formGroup}>
                  <label style={S.formLabel}>Amount to Add</label>
                  <div style={S.amountWrap}>
                    <span style={S.amountSym}>$</span>
                    <input style={S.amountInput} type="number" step="0.01" min="0.01"
                      value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)}
                      placeholder="0.00" required />
                  </div>
                </div>
                <div>
                  <label style={S.quickLabel}>Quick Add</label>
                  <div style={S.quickBtns}>
                    {['10','50','100','500'].map(v => (
                      <button key={v} type="button" style={S.quickBtn(topUpAmount===v)}
                        onClick={() => setTopUpAmount(v)}>${v}</button>
                    ))}
                  </div>
                </div>
                {topUpAmount && !isNaN(parseFloat(topUpAmount)) && (
                  <div style={S.newBal}>
                    <span>New Balance:</span>
                    <strong style={{fontSize:'1rem',fontWeight:800}}>${(balance+parseFloat(topUpAmount)).toFixed(2)}</strong>
                  </div>
                )}
              </div>
              <div style={S.modalFoot}>
                <button type="submit" style={{...S.saveBtn(true), opacity: (loading||!topUpAmount) ? .45 : 1}}
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
}

/* ─────────────────────────────────────────
   Navbar
───────────────────────────────────────── */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [profileOpen, setProfileOpen] = useState(false);

  // 'login' | 'register' | null
  const [authModal, setAuthModal] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleNavigation = (path) => startTransition(() => navigate(path));

  // Protected routes: open login modal instead of navigating away
  const handleProtectedNavigation = (path) => {
    if (user) startTransition(() => navigate(path));
    else setAuthModal('login');
  };

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path) => location.pathname === path;

  // Close auth modal and optionally navigate somewhere after login/register
  const handleAuthSuccess = () => setAuthModal(null);

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .auth-input:focus  { border-color: #5a4fcf !important; box-shadow: 0 0 0 3px rgba(90,79,207,.12) !important; }
      `}</style>

      <nav className={`navbar-glass-modern ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-glass-wrapper">
          <div className="navbar-logo-glass" onClick={() => handleNavigation("/")}>
            <span className="logo-text-glass">PROPIFY</span>
          </div>

          <div className="navbar-links-glass">
            <button
              className={`nav-link-glass ${isActive("/") ? "active" : ""}`}
              onClick={() => handleNavigation("/")}
            >
              Home
            </button>
            <button
              className={`nav-link-glass ${isActive("/explore") ? "active" : ""}`}
              onClick={() => handleNavigation("/explore")}
            >
              Explore
            </button>
            <button
              className={`nav-link-glass ${isActive("/properties") ? "active" : ""} ${!user ? "protected-link" : ""}`}
              onClick={() => handleProtectedNavigation("/properties")}
            >
              Properties {!user && <FaLock className="lock-icon" />}
            </button>
            <button
              className={`nav-link-glass ${isActive("/brokers") || isActive("/broker/dashboard") ? "active" : ""} ${!user ? "protected-link" : ""}`}
              onClick={() => {
                if (user && user.role === 'broker') handleNavigation("/broker/dashboard");
                else handleProtectedNavigation("/brokers");
              }}
            >
              {user && user.role === 'broker'
                ? <><FaBriefcase /> My Dashboard</>
                : <>Brokers {!user && <FaLock className="lock-icon" />}</>
              }
            </button>
          </div>

          <div className="navbar-actions-glass">
            {!loading && !user ? (
              <>
                {/* ✅ Opens modal overlay, does NOT navigate away */}
                <button className="cta-btn-glass" onClick={() => setAuthModal('login')}>
                  Login <FaArrowRight />
                </button>
                <button className="cta-btn-glass register-btn-glass" onClick={() => setAuthModal('register')}>
                  Register <FaUserPlus />
                </button>
              </>
            ) : !loading && user ? (
              <>
                <button className="user-profile-glass" onClick={() => setProfileOpen(true)}>
                  <FaUser /> {user.name || "Profile"}
                </button>
                <button className="logout-btn-glass" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Profile panel (existing) */}
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* ✅ Auth modals — render ON TOP of current page, no route change */}
      {authModal === 'login' && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal('register')}
          onSuccess={handleAuthSuccess}
        />
      )}
      {authModal === 'register' && (
        <RegisterModal
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal('login')}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default Navbar;