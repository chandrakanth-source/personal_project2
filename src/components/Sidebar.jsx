import React from 'react';
import { 
  Home, 
  Box, 
  Globe, 
  FileText, 
  BarChart2, 
  Tag, 
  Settings,
  Tv,
  LogIn,
  LogOut,
  User,
  Shield
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab,
  auth,
  onOpenLoginModal,
  onLogout
}) {
  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home 
    },
    { 
      id: 'stock', 
      label: 'Stock Maintenance', 
      icon: Box 
    },
    { 
      id: 'website', 
      label: 'Create a Website', 
      icon: Globe 
    },
    { 
      id: 'billing', 
      label: 'Create PDF Bill', 
      icon: FileText 
    },
    { 
      id: 'reports', 
      label: 'Daily Sales Reports', 
      icon: BarChart2 
    },
    { 
      id: 'catalog', 
      label: 'Products We Sell', 
      icon: Tag 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings 
    }
  ];

  return (
    <aside style={{
      width: 250,
      minWidth: 250,
      backgroundColor: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      color: 'var(--sidebar-text)',
      userSelect: 'none',
      zIndex: 40,
      position: 'relative'
    }}>
      {/* Brand Header */}
      <div 
        onClick={() => setCurrentTab('home')}
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          flexShrink: 0
        }}>
          {/* Stylized Desktop Monitor Icon matching screenshot */}
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.15
          }}>
            Sri Thanu
          </div>
          <div style={{
            fontSize: '0.85rem',
            color: '#38bdf8',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginTop: 2
          }}>
            Communications
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 12px rgba(29, 104, 237, 0.35)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={19} strokeWidth={isActive ? 2.4 : 2} color={isActive ? '#ffffff' : '#94a3b8'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Staff Portal & Account Status */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--sidebar-border)'
      }}>
        {auth?.isLoggedIn && auth?.user ? (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#1d68ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                flexShrink: 0
              }}>
                {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : <User size={15} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {auth.user.name}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#38bdf8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {auth.user.role || 'Staff'}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Log Out"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f87171',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLoginModal}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: '#1d68ed',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(29, 104, 237, 0.35)',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e40af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1d68ed';
            }}
          >
            <LogIn size={15} />
            <span>Staff Login</span>
          </button>
        )}
      </div>

      {/* Footer subtle tag */}
      <div style={{
        padding: '14px 20px',
        fontSize: '0.72rem',
        color: '#64748b'
      }}>
        © 2026 Sri Thanu Communications
      </div>
    </aside>
  );
}
