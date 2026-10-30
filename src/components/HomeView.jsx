import React, { useState } from 'react';
import { 
  Tv, 
  Cpu, 
  Wrench, 
  ShieldCheck, 
  Award, 
  Headphones, 
  Handshake, 
  ArrowRight,
  Laptop,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  User,
  Shield,
  FileText,
  Box,
  BarChart2,
  Settings,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AUTHORIZED_USERS } from '../data/constants';

export default function HomeView({ 
  onNavigateTab, 
  auth, 
  onLoginSuccess, 
  onLogout, 
  onOpenLoginModal 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = auth?.isLoggedIn;
  const currentUser = auth?.user;

  const handleFormLogin = (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both username/email and password');
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    const userMatch = AUTHORIZED_USERS.find(
      u => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (userMatch) {
      setError('');
      onLoginSuccess?.(userMatch);
    } else {
      setError('Invalid username/email or password. Please try again.');
    }
  };

  const scrollToLogin = () => {
    const el = document.getElementById('frontpage-login');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      onOpenLoginModal?.();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 1240,
      margin: '0 auto',
      width: '100%',
      paddingBottom: 40
    }}>
      {/* 1. Hero Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '36px 42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Left Welcome Copy */}
        <div style={{ flex: 1, maxWidth: 560, zIndex: 2 }}>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            WELCOME TO
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#1e3a8a',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: 16
          }}>
            Sri Thanu Communications
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: 24
          }}>
            Your one-stop shop for computers, accessories and IT solutions.
            We provide quality products, trusted service and complete
            support for all your computing needs.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigateTab('billing')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: 30,
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(29, 78, 216, 0.35)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e40af';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <FileText size={17} />
                  <span>Create Bill / POS</span>
                </button>

                <button
                  onClick={() => onNavigateTab('stock')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    padding: '12px 22px',
                    borderRadius: 30,
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(29, 78, 216, 0.08)';
                    e.currentTarget.style.borderColor = '#93c5fd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <Box size={17} />
                  <span>Stock Maintenance</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={scrollToLogin}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    padding: '12px 26px',
                    borderRadius: 30,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(29, 78, 216, 0.35)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e40af';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Lock size={17} />
                  <span>Staff & Admin Login</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => onNavigateTab('stock')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    padding: '12px 22px',
                    borderRadius: 30,
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#93c5fd';
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>Explore Products</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Hero Hardware Showcase Image */}
        <div style={{
          flex: 1,
          maxWidth: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          <img
            src="/images/hero_devices.jpg"
            alt="Sri Thanu Communications Hardware Setup"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 260,
              objectFit: 'contain',
              borderRadius: 12
            }}
          />

          {/* Floating pill badge */}
          <div style={{
            position: 'absolute',
            bottom: -6,
            right: 12,
            backgroundColor: isLoggedIn ? '#10b981' : '#1e3a8a',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
          }}>
            {isLoggedIn ? (
              <>
                <CheckCircle2 size={14} />
                <span>Active: {currentUser?.name || 'Staff'}</span>
              </>
            ) : (
              <>
                <Lock size={13} />
                <span>Staff Portal Available Below</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. DEDICATED FRONT PAGE LOGIN SECTION */}
      <div 
        id="frontpage-login"
        style={{
          scrollMarginTop: 90
        }}
      >
        {!isLoggedIn ? (
          /* FRONT PAGE LOGIN FORM (WHEN LOGGED OUT) */
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 18,
            border: '2px solid #3b82f6',
            boxShadow: '0 12px 32px -4px rgba(29, 78, 216, 0.15)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr'
          }}>
            {/* Left Decorative Information Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0b2149 0%, #1e3a8a 100%)',
              color: '#ffffff',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle background glow */}
              <div style={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                filter: 'blur(30px)'
              }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Laptop size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
                      Sri Thanu
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                      Communications
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  borderRadius: 6,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#7dd3fc',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: 12
                }}>
                  <Shield size={12} />
                  Staff & Admin Portal
                </div>

                <h3 style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: 10,
                  lineHeight: 1.25
                }}>
                  Sign in to Access Shop Operations
                </h3>

                <p style={{
                  fontSize: '0.88rem',
                  color: '#cbd5e1',
                  lineHeight: 1.55,
                  marginBottom: 24
                }}>
                  Log in directly from the front page to access billing invoices, add/edit inventory stock, create customer bills, and view daily financial reports.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#e2e8f0' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                    <span>POS Billing & Instant PDF Invoicing</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#e2e8f0' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                    <span>Live Stock Maintenance & Price Control</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#e2e8f0' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                    <span>Daily Sales & Profit Analysis</span>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 28,
                paddingTop: 16,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.78rem',
                color: '#94a3b8'
              }}>
                <Lock size={14} color="#38bdf8" />
                <span>Authorized Staff Security • Protected Access</span>
              </div>
            </div>

            {/* Right Interactive Login Form & Quick Select */}
            <div style={{ padding: '34px 38px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <h2 style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <LogIn size={22} color="#1d68ed" />
                    <span>Staff Login</span>
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 2 }}>
                    Please enter your username/email and password to sign in.
                  </p>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '9px 14px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: 16
                }}>
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                    Username / Email Address
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    border: '1px solid var(--border-color)',
                    borderRadius: 9,
                    padding: '9px 12px',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <Mail size={16} color="#94a3b8" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter username or email"
                      required
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                        background: 'transparent'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                    Password
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    border: '1px solid var(--border-color)',
                    borderRadius: 9,
                    padding: '9px 12px',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <Lock size={16} color="#94a3b8" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                        background: 'transparent'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: '#1d68ed',
                    color: '#ffffff',
                    padding: '11px',
                    borderRadius: 9,
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(29, 104, 237, 0.3)',
                    marginTop: 4,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1d68ed'}
                >
                  <LogIn size={17} />
                  <span>Sign In to Dashboard</span>
                </button>
              </form>

              {/* Secure Access Notice */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 22,
                padding: '11px 14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 9,
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                color: '#64748b'
              }}>
                <Shield size={15} color="#1d68ed" />
                <span>Authorized administrator access only</span>
              </div>
            </div>
          </div>
        ) : (
          /* FRONT PAGE ACTIVE SESSION CARD (WHEN LOGGED IN) */
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid #10b981',
            padding: '24px 30px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      Logged in as {currentUser?.name || 'Staff User'}
                    </h3>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 12,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 3 }}>
                    {currentUser?.role || 'Authorized Staff'} • {currentUser?.email || 'chandrakanthyaddhula@gmail.com'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={onOpenLoginModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  <User size={15} />
                  <span>Switch Account</span>
                </button>

                <button
                  onClick={onLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Quick Access Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              paddingTop: 8,
              borderTop: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => onNavigateTab('billing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>POS Invoicing</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Generate Bill</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('stock')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca' }}>
                  <Box size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Inventory</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Maintain Stock</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('reports')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                  <BarChart2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sales Reports</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Daily Revenue</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
                  <Settings size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Shop Settings</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>GST & Profile</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Three Feature Category Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20
      }}>
        {/* Card 1: Computers & Laptops */}
        <div 
          onClick={() => onNavigateTab('stock')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#93c5fd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284c7'
          }}>
            <Tv size={24} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: 6
            }}>
              Computers & Laptops
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              Latest laptops, desktops and accessories from top brands.
            </p>
          </div>
        </div>

        {/* Card 2: Computer Accessories */}
        <div 
          onClick={() => onNavigateTab('stock')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#d8b4fe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9333ea'
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: 6
            }}>
              Computer Accessories
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              Keyboards, mice, monitors, SSDs, RAM, UPS and more.
            </p>
          </div>
        </div>

        {/* Card 3: IT Solutions */}
        <div 
          onClick={() => onNavigateTab('stock')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#86efac';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <Wrench size={24} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: 6
            }}>
              IT Solutions
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              Build your setup, upgrade your system and get expert support.
            </p>
          </div>
        </div>
      </div>

      {/* 4. "About Our Shop" Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '32px 36px',
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Left Shop Front Image */}
        <div style={{
          width: 290,
          minWidth: 290,
          height: 200,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <img
            src="/images/shop_front.jpg"
            alt="Sri Thanu Communications Showroom"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Right About Copy */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#1e3a8a',
            letterSpacing: '-0.02em',
            marginBottom: 12
          }}>
            About Our Shop
          </h2>
          <p style={{
            fontSize: '0.92rem',
            color: '#475569',
            lineHeight: 1.65,
            marginBottom: 24
          }}>
            Sri Thanu Communications is a trusted computer shop offering a wide range of computers,
            laptops, accessories and IT solutions. We are committed to providing genuine products,
            competitive prices and excellent customer service. Whether you are a student, professional
            or business owner, we have the right solution for you.
          </p>

          {/* 4 Feature Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <ShieldCheck size={20} color="#1d68ed" />
              <span>Genuine Products</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <Award size={20} color="#1d68ed" />
              <span>Best Prices</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <Headphones size={20} color="#1d68ed" />
              <span>Expert Support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <Handshake size={20} color="#1d68ed" />
              <span>Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Motto Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '16px 24px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 14,
        border: '1px solid var(--border-color)',
        color: '#1d4ed8',
        fontSize: '0.92rem',
        fontWeight: 600,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Laptop size={18} />
        <span>Your Technology Partner – Today and Always</span>
        <div style={{ width: 80, height: 1, backgroundColor: '#bfdbfe', marginLeft: 8 }} />
      </div>
    </div>
  );
}
