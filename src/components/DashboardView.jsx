import React, { useState } from 'react';
import { 
  Package, 
  Boxes, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ShoppingCart, 
  UserPlus, 
  Truck, 
  ArrowRight, 
  Laptop, 
  Monitor, 
  Cpu, 
  HardDrive, 
  Mouse, 
  Printer, 
  Wifi, 
  Disc, 
  MoreHorizontal
} from 'lucide-react';
import { 
  TOP_SELLING_PRODUCTS, 
  RECENT_ACTIVITIES, 
  SALES_OVERVIEW_DATA, 
  CATEGORY_SALES_BREAKDOWN 
} from '../data/constants';

export default function DashboardView({
  products = [],
  sales = [],
  onOpenAddProduct,
  onNavigateTab,
  onRecordSale,
  onAddCustomer,
  onCreatePurchase,
  currency = '₹'
}) {
  const [salesTimeframe, setSalesTimeframe] = useState('7days');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Compute real stats from store data
  const totalProductsCount = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const lowStockItems = products.filter(p => p.quantity <= (p.lowStockLevel ?? 2));
  const lowStockCount = lowStockItems.length;

  // Real today's sales
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaySalesList = (sales || []).filter(s => (s.timestamp || 0) >= todayStart.getTime());
  const todaySalesAmount = todaySalesList.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
  const todayInvoicesCount = todaySalesList.length;

  // Format Indian rupee format
  const formatCurrency = (amount) => {
    return `${currency} ${Number(amount).toLocaleString('en-IN')}`;
  };

  // Hardware Icon mapper
  const getProductIcon = (item) => {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();

    if (cat.includes('laptop') || name.includes('laptop') || name.includes('inspiron') || name.includes('pavilion')) {
      return <Laptop size={18} color="#2563eb" />;
    }
    if (cat.includes('monitor') || name.includes('monitor')) {
      return <Monitor size={18} color="#0284c7" />;
    }
    if (cat.includes('ram') || name.includes('ram') || cat.includes('component')) {
      return <Cpu size={18} color="#16a34a" />;
    }
    if (cat.includes('storage') || name.includes('ssd') || name.includes('hdd') || name.includes('pen drive')) {
      return <HardDrive size={18} color="#7c3aed" />;
    }
    if (cat.includes('mouse') || name.includes('mouse')) {
      return <Mouse size={18} color="#475569" />;
    }
    if (cat.includes('ups') || name.includes('ups') || cat.includes('power')) {
      return <Cpu size={18} color="#d97706" />;
    }
    if (cat.includes('printer') || name.includes('printer')) {
      return <Printer size={18} color="#059669" />;
    }
    if (cat.includes('network') || name.includes('router')) {
      return <Wifi size={18} color="#2563eb" />;
    }
    return <Package size={18} color="#64748b" />;
  };

  // Top 10 products for the table
  const top10Products = products.slice(0, 10);

  // Top 5 low stock items
  const displayLowStock = lowStockItems.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. Header Greeting Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            Good Morning, Uncle! <span>👋</span>
          </h2>
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--text-muted)',
            marginTop: 4,
            fontWeight: 500
          }}>
            Here's what's happening with your computer shop today.
          </p>
        </div>

        <div style={{
          textAlign: 'right',
          backgroundColor: 'var(--bg-card)',
          padding: '8px 16px',
          borderRadius: 12,
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Oct 9, 2026
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            10:24 AM
          </div>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: 20
      }}>
        {/* Total Products */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Package size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Total Products
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, marginTop: 2 }}>
                {totalProductsCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Across 12 categories
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <TrendingUp size={14} /> 5 new products this week
          </div>
        </div>

        {/* Units in Stock */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Boxes size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Units in Stock
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, marginTop: 2 }}>
                {totalStockUnits.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Total quantity available
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <TrendingUp size={14} /> 3% since last week
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#fffbeb',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Low Stock Items
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, marginTop: 2 }}>
                {lowStockCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Need restocking
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <TrendingDown size={14} /> 2 more than last week
          </div>
        </div>

        {/* Today's Sales */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#f5f3ff',
              color: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '1.4rem',
              fontWeight: 800
            }}>
              {currency}
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Today's Sales
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, marginTop: 2 }}>
                {currency} {todaySalesAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {todayInvoicesCount} {todayInvoicesCount === 1 ? 'invoice' : 'invoices'} completed
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: todayInvoicesCount > 0 ? '#10b981' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            {todayInvoicesCount > 0 ? (
              <><TrendingUp size={14} /> Active billing today</>
            ) : (
              <span>No bills issued today</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Grid (Left 74% / Right 26%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 280px',
        gap: 24,
        alignItems: 'start'
      }}>
        
        {/* LEFT MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Row of 3 Cards: Sales Overview + Sales by Category + Top Selling Products */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1.1fr 1fr',
            gap: 20
          }}>
            
            {/* Sales Overview Chart */}
            <div className="dash-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Sales Overview
                </h3>
                <select
                  value={salesTimeframe}
                  onChange={(e) => setSalesTimeframe(e.target.value)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    padding: '4px 8px'
                  }}
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Combined Bar + Line Chart */}
              <div style={{ height: 180, position: 'relative', display: 'flex', alignItems: 'flex-end', paddingTop: 20 }}>
                {/* Y-axis Guides */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontSize: '0.65rem',
                  color: 'var(--text-light)',
                  pointerEvents: 'none'
                }}>
                  <span>50K</span>
                  <span>40K</span>
                  <span>30K</span>
                  <span>20K</span>
                  <span>10K</span>
                  <span>0</span>
                </div>

                {/* Bars & SVG line */}
                <div style={{
                  marginLeft: 32,
                  width: 'calc(100% - 32px)',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  {/* Background grid lines */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}>
                    {[0, 1, 2, 3, 4, 5].map((_, i) => (
                      <div key={i} style={{ borderBottom: '1px dashed var(--border-color)', width: '100%' }} />
                    ))}
                  </div>

                  {/* SVG Line Curve for Orders */}
                  <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 'calc(100% - 24px)',
                    overflow: 'visible',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}>
                    <path
                      d="M 12 110 L 48 85 L 85 75 L 122 62 L 158 50 L 195 35 L 232 20"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                    {[
                      { x: 12, y: 110 },
                      { x: 48, y: 85 },
                      { x: 85, y: 75 },
                      { x: 122, y: 62 },
                      { x: 158, y: 50 },
                      { x: 195, y: 35 },
                      { x: 232, y: 20 }
                    ].map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                    ))}
                  </svg>

                  {/* Vertical Bars */}
                  {SALES_OVERVIEW_DATA.map((item, index) => {
                    const heightPercent = (item.amount / 50000) * 100;
                    const isHovered = hoveredBarIndex === index;

                    return (
                      <div
                        key={item.day}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          width: '12%',
                          height: '100%',
                          justifyContent: 'flex-end',
                          zIndex: 1,
                          cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Tooltip on Hover */}
                        {isHovered && (
                          <div style={{
                            position: 'absolute',
                            bottom: `calc(${heightPercent}% + 30px)`,
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            padding: '4px 8px',
                            borderRadius: 6,
                            fontSize: '0.68rem',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            zIndex: 10
                          }}>
                            ₹{item.amount.toLocaleString()} ({item.orders} orders)
                          </div>
                        )}

                        <div style={{
                          width: '100%',
                          height: `${Math.min(100, heightPercent * 0.8)}%`,
                          backgroundColor: isHovered ? '#1d4ed8' : '#3b82f6',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease, background-color 0.2s'
                        }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart Legend */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 12,
                justifyContent: 'center',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                  <span>Sales Amount (₹)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span>Orders</span>
                </div>
              </div>
            </div>

            {/* Sales by Category Donut Chart */}
            <div className="dash-card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                Sales by Category
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* SVG Donut */}
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <svg viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {/* Ring background */}
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                    
                    {/* Slices */}
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="32 68" strokeDashoffset="0" />
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#06b6d4" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="-32" />
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="12 88" strokeDashoffset="-50" />
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="8 92" strokeDashoffset="-62" />
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="7 93" strokeDashoffset="-70" />
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#ec4899" strokeWidth="6" strokeDasharray="6 94" strokeDashoffset="-77" />
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#94a3b8" strokeWidth="6" strokeDasharray="17 83" strokeDashoffset="-83" />
                  </svg>
                  
                  {/* Center Text */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                      ₹ 2,48,750
                    </span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                      Total Sales
                    </span>
                  </div>
                </div>

                {/* Legend list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  {CATEGORY_SALES_BREAKDOWN.map((cat) => (
                    <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cat.color }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="dash-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Top Selling Products
                </h3>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  This Month
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TOP_SELLING_PRODUCTS.map((prod) => (
                  <div
                    key={prod.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '4px 0',
                      borderBottom: prod.rank < 5 ? '1px solid var(--border-color)' : 'none'
                    }}
                  >
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-light)',
                      width: 14
                    }}>
                      {prod.rank}
                    </span>

                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {prod.icon === 'laptop' && <Laptop size={14} color="#2563eb" />}
                      {prod.icon === 'ram' && <Cpu size={14} color="#16a34a" />}
                      {prod.icon === 'ssd' && <HardDrive size={14} color="#7c3aed" />}
                      {prod.icon === 'mouse' && <Mouse size={14} color="#475569" />}
                      {prod.icon === 'pendrive' && <Disc size={14} color="#d97706" />}
                    </div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {prod.name}
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>
                      {prod.unitsSold} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row of 2 Tables: Current Stock (Top 10) & Low Stock Items */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.9fr 1fr',
            gap: 20
          }}>
            
            {/* Current Stock (Top 10) Table */}
            <div className="dash-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Current Stock (Top 10)
                </h3>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('products')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                  }}
                >
                  View All Products <ArrowRight size={14} />
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{
                      textAlign: 'left',
                      color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: 8
                    }}>
                      <th style={{ padding: '8px 4px', fontWeight: 600 }}>#</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>Product Name</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>Category</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>Brand</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>Model / Specification</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>Qty</th>
                      <th style={{ padding: '8px 6px', fontWeight: 600 }}>Price ({currency})</th>
                      <th style={{ padding: '8px 4px', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top10Products.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                          <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>📦</div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>No Products Added Yet</div>
                          <div style={{ fontSize: '0.75rem', marginTop: 4 }}>Add items from the Products tab to see stock levels here.</div>
                        </td>
                      </tr>
                    ) : (
                      top10Products.map((p, index) => {
                      const isLowStock = p.quantity <= (p.lowStockLevel ?? 5);

                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '8px 4px', color: 'var(--text-light)', fontWeight: 600 }}>
                            {index + 1}
                          </td>
                          <td style={{ padding: '8px 6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {getProductIcon(p)}
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '8px 6px', color: 'var(--text-secondary)' }}>
                            {p.category}
                          </td>
                          <td style={{ padding: '8px 6px', color: 'var(--text-secondary)' }}>
                            {p.brand}
                          </td>
                          <td style={{ padding: '8px 6px', color: 'var(--text-muted)' }}>
                            {p.modelSpec || p.notes || '-'}
                          </td>
                          <td style={{ padding: '8px 6px', fontWeight: 700, color: isLowStock ? '#d97706' : 'var(--text-main)' }}>
                            {p.quantity}
                          </td>
                          <td style={{ padding: '8px 6px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {Number(p.price).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '8px 4px' }}>
                            {isLowStock ? (
                              <span className="badge-low-stock">Low Stock</span>
                            ) : (
                              <span className="badge-in-stock">In Stock</span>
                            )}
                          </td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Items Card */}
            <div className="dash-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Low Stock Items
                </h3>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('products')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--primary)'
                  }}
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {displayLowStock.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>✅</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>All Stock Levels Healthy</div>
                    <div style={{ fontSize: '0.74rem', marginTop: 2 }}>No items are currently running low.</div>
                  </div>
                ) : (
                  displayLowStock.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '6px 0',
                        borderBottom: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        backgroundColor: '#fffbeb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getProductIcon(item)}
                      </div>

                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600 }}>
                          Qty: {item.quantity} (Min: {item.lowStockLevel})
                        </div>
                      </div>

                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        flexShrink: 0
                      }}>
                        !
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN: Quick Actions & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Quick Actions Card */}
          <div className="dash-card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>
              Quick Actions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Add New Product */}
              <button
                onClick={onOpenAddProduct}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Plus size={14} strokeWidth={3} />
                </div>
                <span>Add New Product</span>
              </button>

              {/* Record Sale */}
              <button
                onClick={onRecordSale}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                <ShoppingCart size={18} />
                <span>Record Sale</span>
              </button>

              {/* Add Customer */}
              <button
                onClick={onAddCustomer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
              >
                <UserPlus size={18} />
                <span>Add Customer</span>
              </button>

              {/* Create Purchase */}
              <button
                onClick={onCreatePurchase}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  backgroundColor: '#f97316',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                <Truck size={18} />
                <span>Create Purchase</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dash-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Recent Activity
              </h3>
              <button
                onClick={() => onNavigateTab && onNavigateTab('billing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--primary)'
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: `${act.statusColor}18`,
                    color: act.statusColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {act.icon === 'cart' && <ShoppingCart size={16} />}
                    {act.icon === 'truck' && <Truck size={16} />}
                    {act.icon === 'box' && <Package size={16} />}
                    {act.icon === 'user' && <UserPlus size={16} />}
                    {act.icon === 'alert' && <AlertTriangle size={16} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {act.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>
                        {act.time}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {act.subtitle}
                    </div>

                    {act.amount && (
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                        {act.amount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Category Quick-Filter Bar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 16,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 4
        }}>
          {[
            { label: 'Laptops', icon: Laptop },
            { label: 'Desktops', icon: Monitor },
            { label: 'Monitors', icon: Monitor },
            { label: 'Accessories', icon: Mouse },
            { label: 'Storage', icon: HardDrive },
            { label: 'Components', icon: Cpu },
            { label: 'Networking', icon: Wifi },
            { label: 'Printers', icon: Printer },
            { label: 'Software', icon: Disc },
            { label: 'Others', icon: MoreHorizontal }
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => onNavigateTab && onNavigateTab('inventory', cat.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-input)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          Your One Stop Computer Shop 💻
        </div>
      </div>
    </div>
  );
}
