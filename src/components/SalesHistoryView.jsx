import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Search, 
  FileDown, 
  User, 
  Phone, 
  Calendar, 
  DollarSign, 
  CreditCard,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export default function SalesHistoryView({ sales, settings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [selectedSaleDetail, setSelectedSaleDetail] = useState(null);

  const currency = settings.currency || '$';

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        sale.invoiceNumber.toLowerCase().includes(q) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(q)) ||
        (sale.customerPhone && sale.customerPhone.includes(q)) ||
        sale.items.some(it => it.name.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedMethod === 'ALL') return true;
      return sale.paymentMethod === selectedMethod;
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [sales, searchQuery, selectedMethod]);

  const totalRevenue = useMemo(() => {
    return sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
  }, [sales]);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Sales Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Sales Volume
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {currency}{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-blue-light)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Receipt size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Invoices Issued
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {sales.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20
      }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, customer name, phone or product..."
            style={{
              width: '100%',
              height: 42,
              padding: '0 14px 0 42px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          style={{
            height: 42,
            padding: '0 30px 0 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI/QR">UPI/QR</option>
          <option value="Transfer">Bank Transfer</option>
        </select>
      </div>

      {/* Sales History List / Table */}
      {filteredSales.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <Receipt size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>No Sales Invoices Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Completed sales and customer billing transactions will appear here.
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>INVOICE #</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATE & TIME</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>CUSTOMER</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ITEMS</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PAYMENT</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                    #{sale.invoiceNumber}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(sale.timestamp).toLocaleDateString()} {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sale.customerName || 'Walk-in'}</div>
                    {sale.customerPhone && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sale.customerPhone}</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      fontWeight: 600
                    }}>
                      {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-text)'
                    }}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {currency}{sale.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => generateInvoicePDF(sale, settings)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border)',
                        color: 'var(--primary)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      title="Download PDF"
                    >
                      <FileDown size={15} />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
