import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PackageCheck, 
  AlertTriangle, 
  PieChart, 
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { CATEGORIES } from '../data/constants';

export default function AnalyticsView({ products, sales, settings }) {
  const currency = settings.currency || '$';

  // Deep Shop Valuation & Category Financials
  const metrics = useMemo(() => {
    let totalStockUnits = 0;
    let totalRetailVal = 0;
    let totalCostVal = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    const categoryStats = {};
    const brandMap = {};

    products.forEach(p => {
      const qty = Number(p.quantity) || 0;
      const price = Number(p.price) || 0;
      const cost = Number(p.costPrice) || (price * 0.75); // fallback estimated cost
      const lowLevel = p.lowStockLevel ?? 2;

      const itemRetailVal = qty * price;
      const itemCostVal = qty * cost;

      totalStockUnits += qty;
      totalRetailVal += itemRetailVal;
      totalCostVal += itemCostVal;

      if (qty === 0) outOfStockCount++;
      else if (qty <= lowLevel) lowStockCount++;

      // Category breakdown metrics
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = {
          name: p.category,
          units: 0,
          itemCount: 0,
          retailVal: 0,
          costVal: 0
        };
      }
      categoryStats[p.category].units += qty;
      categoryStats[p.category].itemCount += 1;
      categoryStats[p.category].retailVal += itemRetailVal;
      categoryStats[p.category].costVal += itemCostVal;

      // Brand breakdown
      if (p.brand) {
        brandMap[p.brand] = (brandMap[p.brand] || 0) + qty;
      }
    });

    const potentialGrossMargin = totalRetailVal - totalCostVal;
    const marginPercent = totalRetailVal > 0 ? ((potentialGrossMargin / totalRetailVal) * 100).toFixed(1) : 0;

    // Total sales revenue
    const totalSalesRev = sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);

    // Sorted category financial list
    const categoryFinancialList = Object.values(categoryStats).sort((a, b) => b.retailVal - a.retailVal);

    // Sorted brands
    const topBrands = Object.entries(brandMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      totalProducts: products.length,
      totalStockUnits,
      totalRetailVal,
      totalCostVal,
      potentialGrossMargin,
      marginPercent,
      lowStockCount,
      outOfStockCount,
      totalSalesRev,
      categoryFinancialList,
      topBrands
    };
  }, [products, sales]);

  return (
    <div style={{ paddingBottom: 40 }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Wallet size={26} color="var(--primary)" />
          <span>Total Shop Valuation & Stock Analysis</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Comprehensive financial valuation of all hardware, parts and peripherals currently in shop stock.
        </p>
      </div>

      {/* Top Value Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Retail Inventory Value */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 22,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Shop Stock Value
            </span>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={22} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>
            {currency}{metrics.totalRetailVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Across <strong>{metrics.totalStockUnits} total units</strong> in stock
          </div>
        </div>

        {/* Cost Base Valuation */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 22,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Purchase Cost
            </span>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={22} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
            {currency}{metrics.totalCostVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Total wholesale capital invested
          </div>
        </div>

        {/* Potential Profit Margin */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 22,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Expected Gross Profit
            </span>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-purple-light)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={22} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-purple)', lineHeight: 1.2 }}>
            {currency}{metrics.potentialGrossMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--primary-text)', marginTop: 8, fontWeight: 700 }}>
            +{metrics.marginPercent}% Potential profit margin
          </div>
        </div>

        {/* Stock Alert Summary */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 22,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Restock Needed
            </span>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={22} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: metrics.lowStockCount > 0 ? 'var(--danger)' : 'var(--text-main)', lineHeight: 1.2 }}>
            {metrics.lowStockCount + metrics.outOfStockCount} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>items</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--danger-text)', marginTop: 8, fontWeight: 600 }}>
            {metrics.outOfStockCount} Out of stock • {metrics.lowStockCount} Low stock
          </div>
        </div>
      </div>

      {/* Category Valuation Table */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        padding: 24,
        marginBottom: 24,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={20} color="var(--primary)" />
          <span>Category-wise Shop Value Breakdown</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 680 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>CATEGORY</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>PRODUCTS</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>STOCK UNITS</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>COST VALUE</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>RETAIL VALUE</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>% OF TOTAL SHOP VALUE</th>
              </tr>
            </thead>
            <tbody>
              {metrics.categoryFinancialList.map(cat => {
                const sharePct = metrics.totalRetailVal > 0 ? ((cat.retailVal / metrics.totalRetailVal) * 100).toFixed(1) : '0';
                return (
                  <tr key={cat.name} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {cat.name}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {cat.itemCount}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700 }}>
                      {cat.units}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {currency}{cat.costVal.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                      {currency}{cat.retailVal.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{sharePct}%</span>
                        <div style={{ width: 60, height: 6, backgroundColor: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, sharePct)}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
