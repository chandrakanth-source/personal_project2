import React, { useState } from 'react';
import { 
  Tv, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  Laptop, 
  Mouse, 
  Settings, 
  ShieldCheck, 
  Users, 
  X,
  Shield
} from 'lucide-react';
import { AUTHORIZED_USERS } from '../data/constants';

export default function LoginModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email address and password');
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    const userMatch = AUTHORIZED_USERS.find(
      u => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (userMatch) {
      setError('');
      onLoginSuccess(userMatch);
      onClose();
    } else {
      setError('Invalid email address or password. Please try again.');
    }
  };

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 25, 47, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div 
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: 960,
          backgroundColor: '#ffffff',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* LEFT PANEL: Dark Navy with Showroom photo overlay */}
        <div style={{
          position: 'relative',
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#ffffff',
          overflow: 'hidden',
          minHeight: 560
        }}>
          {/* Background image & deep blue overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/login_bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(11, 33, 73, 0.94) 0%, rgba(13, 39, 87, 0.92) 100%)',
            zIndex: 2
          }} />

          {/* Top Brand Identity */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
                  Sri Thanu
                </div>
                <div style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 600 }}>
                  Communications
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '0.92rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
              marginTop: 18,
              maxWidth: 360
            }}>
              Your One-Stop Shop for Computers, Accessories and IT Solutions
            </p>

            {/* 4 Feature Bullet Points */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginTop: 34
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.92rem', color: '#f1f5f9' }}>
                <Laptop size={20} color="#60a5fa" />
                <span>Latest Computers & Laptops</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.92rem', color: '#f1f5f9' }}>
                <Mouse size={20} color="#60a5fa" />
                <span>Accessories & Peripherals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.92rem', color: '#f1f5f9' }}>
                <Settings size={20} color="#60a5fa" />
                <span>Best Prices</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.92rem', color: '#f1f5f9' }}>
                <ShieldCheck size={20} color="#60a5fa" />
                <span>Trust & Support</span>
              </div>
            </div>
          </div>

          {/* Cursive Tagline at bottom matching image 3 */}
          <div style={{
            position: 'relative',
            zIndex: 3,
            fontFamily: 'var(--font-script)',
            fontSize: '2rem',
            color: '#60a5fa',
            letterSpacing: '0.02em',
            marginTop: 20
          }}>
            Build Your Digital Future
          </div>
        </div>

        {/* RIGHT PANEL: White clean login form */}
        <div style={{
          padding: '44px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {/* Lock Icon Badge */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#1d68ed'
            }}>
              <Lock size={24} />
            </div>

            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: 4
            }}>
              Welcome Back
            </h2>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              textAlign: 'center',
              marginBottom: 20
            }}>
              Sign in to access your account
            </p>

            {error && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                color: '#dc2626',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginBottom: 16,
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  backgroundColor: '#ffffff'
                }}>
                  <Mail size={18} color="#94a3b8" />
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
                      fontSize: '0.9rem',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Password
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  backgroundColor: '#ffffff'
                }}>
                  <Lock size={18} color="#94a3b8" />
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
                      fontSize: '0.9rem',
                      color: 'var(--text-main)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  backgroundColor: '#1d68ed',
                  color: '#ffffff',
                  padding: '13px',
                  borderRadius: 10,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(29, 104, 237, 0.35)',
                  marginTop: 6
                }}
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            </form>

            {/* Authorized Personnel Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 24,
              padding: '12px 14px',
              backgroundColor: '#f8fafc',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              color: '#64748b'
            }}>
              <Shield size={16} color="#1d68ed" />
              <span>Authorized personnel access only</span>
            </div>
          </div>

          {/* Secure Login Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: '0.75rem',
            color: '#64748b',
            marginTop: 20
          }}>
            <Shield size={14} color="#1d68ed" />
            <span>Sri Thanu Communications</span>
            <span>|</span>
            <span>Secure Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}
