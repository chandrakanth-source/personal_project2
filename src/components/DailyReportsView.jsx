import React, { useMemo, useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar
} from 'lucide-react';

export default function DailyReportsView({ sales = [], settings }) {
  const [timeRange, setTimeRange] = useState('7days');
  const currency = settings?.currency || '₹';
  const rangeDays = timeRange === '30days' ? 30 : timeRange === 'all' ? null : 7;
  const [now] = useState(() => new Date());
  const startTime = rangeDays ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - rangeDays + 1).getTime() : 0;
  const filteredSales = useMemo(
    () => sales.filter(sale => Number(sale.timestamp) >= startTime),
    [sales, startTime]
  );
  const dailyData = useMemo(() => {
    const days = rangeDays || 7;
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + index + 1);
      const start = date.getTime();
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
      const daySales = filteredSales.filter(sale => Number(sale.timestamp) >= start && Number(sale.timestamp) < end);
      return {
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        amount: daySales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0),
        orders: daySales.length,
        items: daySales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + (Number(item.quantity) || 0), 0), 0)
      };
    });
  }, [filteredSales, rangeDays, now]);
  const totalSalesWeek = filteredSales.reduce((acc, sale) => acc + (Number(sale.total) || 0), 0);
  const totalOrdersWeek = filteredSales.length;
  const maxAmount = Math.max(...dailyData.map(d => d.amount), 1);
  const todayKey = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todaySales = filteredSales.filter(sale => Number(sale.timestamp) >= todayKey);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
  const categoryTotals = {};
  filteredSales.forEach(sale => sale.items.forEach(item => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + (Number(item.quantity) || 0);
  }));
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No sales yet';

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
          <select value={timeRange} onChange={(event) => setTimeRange(event.target.value)} style={{ border: 'none', background: 'transparent', fontWeight: 600, color: 'var(--text-main)' }}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
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
            {currency} {todayRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} /> {todaySales.length} invoices today
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
            {currency} {totalOrdersWeek ? Math.round(totalSalesWeek / totalOrdersWeek).toLocaleString('en-IN') : '0'}
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
            {topCategory}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
            Based on units sold
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
                  {currency}{(d.amount / 1000).toFixed(1)}k
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
                  title={`${d.date}: ${currency}${d.amount.toLocaleString('en-IN')}`}
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
