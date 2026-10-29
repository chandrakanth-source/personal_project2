import React from 'react';
import { 
  Home, 
  Box, 
  Globe, 
  FileText, 
  BarChart2, 
  Tag, 
  Settings,
  Tv
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab
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

      {/* Footer subtle tag */}
      <div style={{
        padding: '18px 20px',
        fontSize: '0.72rem',
        color: '#64748b',
        borderTop: '1px solid var(--sidebar-border)'
      }}>
        © 2026 Sri Thanu Communications
      </div>
    </aside>
  );
}
