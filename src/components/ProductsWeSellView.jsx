import React, { useState, useMemo } from 'react';
import { 
  Tag, 
  Search, 
  Filter, 
  FileText, 
  Check, 
  Laptop, 
  Tv, 
  Cpu, 
  HardDrive, 
  Mouse, 
  Box,
  ShoppingCart
} from 'lucide-react';
import { CATEGORIES } from '../data/constants';

export default function ProductsWeSellView({ 
  products, 
  onNavigateTab,
  onSelectProductForBill
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const getProductImage = (item) => {
    if (item.image) return item.image;
    const n = (item.name || '').toLowerCase();
    if (n.includes('laptop')) return '/images/products/laptop.jpg';
    if (n.includes('mouse')) return '/images/products/mouse.jpg';
    if (n.includes('keyboard')) return '/images/products/keyboard.jpg';
    if (n.includes('monitor')) return '/images/products/monitor.jpg';
    if (n.includes('ram')) return '/images/products/ram.jpg';
    return '/images/products/laptop.jpg';
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.configuration && p.configuration.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (activeCategory === 'All Categories') return true;
      return p.category === activeCategory;
    });
  }, [products, search, activeCategory]);

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
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 18px rgba(139, 92, 246, 0.35)'
          }}>
            <Tag size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#1e3a8a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Products We Sell
            </h1>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748b',
              marginTop: 4
            }}>
              Explore available computers, genuine hardware components, accessories, and pricing.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '9px 16px',
          width: 280
        }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.88rem',
              color: 'var(--text-main)',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 4
      }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                fontSize: '0.85rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? '#1d68ed' : 'var(--bg-card)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? '1px solid #1d68ed' : '1px solid var(--border-color)',
                boxShadow: isActive ? '0 2px 8px rgba(29, 104, 237, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: 20
      }}>
        {filtered.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: 48,
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            color: '#64748b'
          }}>
            No products found matching "{search}".
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 16,
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {/* Product Image Area */}
              <div style={{
                height: 180,
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                borderBottom: '1px solid var(--border-color)',
                position: 'relative'
              }}>
                <img
                  src={getProductImage(item)}
                  alt={item.name}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: item.quantity > 0 ? '#dcfce7' : '#fee2e2',
                  color: item.quantity > 0 ? '#15803d' : '#b91c1c',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 20
                }}>
                  {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Product Details */}
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d68ed', textTransform: 'uppercase' }}>
                    {item.brand || 'Original Brand'}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>
                    {item.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
                    {item.configuration || 'High performance genuine model'}
                  </div>
                </div>

                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Best Price</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a' }}>
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectProductForBill?.(item);
                      onNavigateTab('billing');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: '#1d68ed',
                      color: '#ffffff',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(29, 104, 237, 0.25)'
                    }}
                  >
                    <FileText size={14} />
                    <span>Create Bill</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
