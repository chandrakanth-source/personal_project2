import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, LogOut, Sun, Moon, Shield } from 'lucide-react';

export default function TopBar({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  currentUser,
  onOpenLoginModal,
  onNavigateTab
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      height: 72,
      backgroundColor: 'var(--bg-topbar)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Search Input Bar matching screenshot */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        padding: '9px 16px',
        width: 420,
        maxWidth: '50%'
      }}>
        <Search size={17} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            width: '100%',
            color: 'var(--text-main)',
            fontSize: '0.88rem'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ color: '#94a3b8', fontSize: '0.8rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Right User & Notification Controls */}
      <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            style={{
              position: 'relative',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              borderRadius: 8
            }}
          >
            <Bell size={20} />
            {/* Red notification dot */}
            <span style={{
              position: 'absolute',
              top: 7,
              right: 8,
              width: 8,
              height: 8,
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #ffffff'
            }} />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: 48,
              right: 0,
              width: 300,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-dropdown)',
              padding: 16,
              zIndex: 50
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 10 }}>Notifications</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 8 }}>
                  🔔 <strong>System Ready</strong> - Inventory & billing synchronized.
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 8 }}>
                  📦 <strong>Stock Normal</strong> - All 5 key hardware categories in stock.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill matching screenshot */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 10px',
              borderRadius: 10
            }}
          >
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#1d68ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <User size={18} />
            </div>
            <span style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--text-main)'
            }}>
              {currentUser?.name || 'Admin'}
            </span>
            <ChevronDown size={16} color="#64748b" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: 52,
              right: 0,
              width: 240,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-dropdown)',
              padding: '12px 8px',
              zIndex: 50
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentUser?.name || 'Admin'}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentUser?.email || 'admin@srithanu.in'}</div>
                <div style={{ 
                  marginTop: 6, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 4, 
                  fontSize: '0.72rem', 
                  color: '#1d68ed', 
                  backgroundColor: '#eff6ff', 
                  padding: '2px 8px', 
                  borderRadius: 6,
                  fontWeight: 600
                }}>
                  <Shield size={12} /> {currentUser?.role || 'Admin (owner)'}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenLoginModal();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.86rem',
                  color: 'var(--text-main)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <User size={16} color="#1d68ed" />
                <span>Switch User / Login</span>
              </button>

              <button
                onClick={toggleTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.86rem',
                  color: 'var(--text-main)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#64748b" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigateTab('settings');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.86rem',
                  color: 'var(--text-main)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Shield size={16} color="#10b981" />
                <span>Shop Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
