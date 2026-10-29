import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  FileText, 
  Download, 
  ArrowUpRight,
  Receipt
} from 'lucide-react';

export default function DailyReportsView({ sales = [], products = [], settings }) {
  const [timeRange, setTimeRange] = useState('7days');
  const currency = settings?.currency || '₹';

  // Demo daily trends data
  const dailyData = [
    { date: 'Today', amount: 54990, orders: 3, items: 3 },
    { date: 'Yesterday', amount: 38400, orders: 4, items: 6 },
    { date: 'Oct 21', amount: 46200, orders: 5, items: 7 },
    { date: 'Oct 20', amount: 62500, orders: 6, items: 9 },
    { date: 'Oct 19', amount: 29800, orders: 3, items: 5 },
    { date: 'Oct 18', amount: 51200, orders: 5, items: 8 },
    { date: 'Oct 17', amount: 41000, orders: 4, items: 6 }
  ];

  const totalSalesWeek = dailyData.reduce((acc, d) => acc + d.amount, 0);
  const totalOrdersWeek = dailyData.reduce((acc, d) => acc + d.orders, 0);
  const maxAmount = Math.max(...dailyData.map(d => d.amount));

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
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)'
          }}>
            <BarChart2 size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#1e3a8a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Daily Sales Reports
            </h1>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748b',
              marginTop: 4
            }}>
              Track shop performance, daily billing totals, and sales analytics.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'var(--bg-subtle)',
          padding: '8px 16px',
          borderRadius: 10,
          border: '1px solid var(--border-color)',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--text-main)'
        }}>
          <Calendar size={16} color="#1d68ed" />
          <span>Last 7 Days</span>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 14,
          border: '1px solid var(--border-color)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Today's Revenue</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1e3a8a', marginTop: 4 }}>
            {currency} 54,990
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} /> +18.4% vs yesterday
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 14,
          border: '1px solid var(--border-color)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Weekly Total</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
            {currency} {totalSalesWeek.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
            Across {totalOrdersWeek} billed invoices
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 14,
          border: '1px solid var(--border-color)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Average Order Value</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
            {currency} {Math.round(totalSalesWeek / totalOrdersWeek).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 4 }}>
            High average ticket size
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 14,
          border: '1px solid var(--border-color)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Top Selling Category</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1d68ed', marginTop: 4 }}>
            Laptops
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
            62% of shop sales volume
          </div>
        </div>
      </div>

      {/* Daily Sales Chart & Breakdown */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '28px 32px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e3a8a' }}>
              Daily Revenue Trend
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
              Daily billings generated for Sri Thanu Communications
            </p>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          height: 220,
          paddingTop: 20,
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: 14
        }}>
          {dailyData.map((d, i) => {
            const heightPercent = Math.round((d.amount / maxAmount) * 100);
            const isToday = i === 0;

            return (
              <div key={d.date} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                height: '100%',
                justifyContent: 'flex-end'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isToday ? '#1d68ed' : '#64748b' }}>
                  ₹{(d.amount / 1000).toFixed(1)}k
                </div>

                <div
                  style={{
                    width: '100%',
                    maxWidth: 48,
                    height: `${heightPercent}%`,
                    backgroundColor: isToday ? '#1d68ed' : '#cbd5e1',
                    borderRadius: '8px 8px 4px 4px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  title={`${d.date}: ₹${d.amount.toLocaleString('en-IN')}`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isToday ? '#1d68ed' : '#cbd5e1'}
                />

                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? '#1d68ed' : '#64748b',
                  marginTop: 6
                }}>
                  {d.date}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Breakdown Table */}
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>
            Recent Day Logs
          </h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoices Generated</th>
                <th>Items Sold</th>
                <th>Total Daily Sales</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((d) => (
                <tr key={d.date}>
                  <td style={{ fontWeight: 600 }}>{d.date}</td>
                  <td>{d.orders} bills</td>
                  <td>{d.items} units</td>
                  <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                    {currency} {d.amount.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: '#dcfce7',
                      color: '#15803d'
                    }}>
                      Reconciled ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
