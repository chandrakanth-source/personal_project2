import React from 'react';
import { 
  Laptop, 
  Package, 
  ShoppingCart, 
  Receipt, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon, 
  Plus,
  AlertTriangle
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  theme, 
  toggleTheme, 
  lowStockCount, 
  onOpenAddItem,
  shopName 
}) {
  const navItems = [
    { id: 'settings', label: '1. Settings', icon: Settings },
    { id: 'inventory', label: '2. Add & Manage Devices', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null, badgeDanger: true },
    { id: 'analytics', label: '3. Shop Value & Analytics', icon: BarChart3 },
    { id: 'pos', label: 'POS & Billing', icon: ShoppingCart },
    { id: 'sales', label: 'Sales & Invoices', icon: Receipt },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: 1380,
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-emerald)'
          }}>
            <Laptop size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              lineHeight: 1.2
            }}>
              {shopName || 'Computer Shop Inventory'}
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--primary)'
            }}>
              POS & Stock Management
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: 'var(--bg-subtle)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition-fast)',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: item.badgeDanger ? 'var(--danger)' : 'var(--primary)',
                    color: '#ffffff'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={toggleTheme}
            title="Toggle light / dark theme"
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)'
            }}
          >
            {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#475569" />}
          </button>

          <button
            onClick={onOpenAddItem}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: 'var(--shadow-emerald)',
              transition: 'var(--transition-fast)'
            }}
          >
            <Plus size={18} strokeWidth={2.8} />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </header>
  );
}
