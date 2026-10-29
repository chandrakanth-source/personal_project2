import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  QrCode, 
  User, 
  Phone, 
  Receipt, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  FileDown, 
  Printer, 
  Calendar,
  DollarSign,
  Eye,
  X,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../data/constants';
import { generateInvoicePDF, printInvoice } from '../utils/pdfGenerator';
import CustomBillPaperBilling from './CustomBillPaperBilling';

export default function BillingView({ 
  products, 
  sales = [], 
  settings, 
  onCompleteSale 
}) {
  // Mode: 'custom_paper' | 'new_bill' | 'invoices'
  const [activeSubTab, setActiveSubTab] = useState('custom_paper');

  // --- NEW BILL / POS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  
  // Customer & Billing details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [applyTax, setApplyTax] = useState(settings?.taxEnabled ?? true);
  
  // Completed sale state for modal
  const [completedSale, setCompletedSale] = useState(null);

  // --- INVOICES / BILL HISTORY STATE ---
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyPaymentFilter, setHistoryPaymentFilter] = useState('ALL');
  const [previewSale, setPreviewSale] = useState(null);

  const currency = settings?.currency || '₹';
  const taxRate = settings?.taxRate || 5;

  // Filter products for the POS catalog
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedCategory === 'ALL') return true;
      return p.category === selectedCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = (product) => {
    if (product.quantity <= 0) {
      alert(`"${product.name}" is currently Out of Stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          alert(`Only ${product.quantity} units available in stock.`);
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          price: product.price,
          costPrice: product.costPrice || 0,
          warranty: product.warranty || 0,
          maxStock: product.quantity,
          quantity: 1
        }];
      }
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const next = item.quantity + delta;
          if (next <= 0) return null;
          if (next > item.maxStock) {
            alert(`Cannot exceed available stock (${item.maxStock}).`);
            return item;
          }
          return { ...item, quantity: next };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Totals calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return (subtotal * (discountPercent / 100));
  }, [subtotal, discountPercent]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const taxAmount = useMemo(() => {
    if (!applyTax) return 0;
    return (taxableAmount * (taxRate / 100));
  }, [taxableAmount, applyTax, taxRate]);

  const grandTotal = taxableAmount + taxAmount;

  // Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Select items to generate bill.');
      return;
    }

    const saleRecord = {
      id: `sale-${Date.now()}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      timestamp: Date.now(),
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim() || '',
      paymentMethod,
      items: [...cart],
      subtotal,
      discountPercent: Number(discountPercent) || 0,
      discountAmount,
      taxRate: applyTax ? taxRate : 0,
      taxAmount,
      total: grandTotal
    };

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }

    onCompleteSale(saleRecord);
    setCompletedSale(saleRecord);

    // Reset current POS form
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  // Filtered sales for History tab
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const q = historySearchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        sale.invoiceNumber.toLowerCase().includes(q) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(q)) ||
        (sale.customerPhone && sale.customerPhone.includes(q)) ||
        sale.items.some(it => it.name.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (historyPaymentFilter === 'ALL') return true;
      return sale.paymentMethod === historyPaymentFilter;
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [sales, historySearchQuery, historyPaymentFilter]);

  const totalSalesRevenue = useMemo(() => {
    return sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
  }, [sales]);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Top Header & Sub-Navigation */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Receipt size={24} color="var(--primary)" />
            <span>Billing & Invoicing Hub</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
            Generate customer invoices, print physical bills, or download PDF receipts.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 12,
          padding: 4,
          border: '1px solid var(--border)'
        }}>
          <button
            onClick={() => setActiveSubTab('custom_paper')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: activeSubTab === 'custom_paper' ? 700 : 600,
              backgroundColor: activeSubTab === 'custom_paper' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'custom_paper' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeSubTab === 'custom_paper' ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <FileText size={16} />
            <span>📄 Custom Bill Paper & Sign/Stamp</span>
          </button>

          <button
            onClick={() => setActiveSubTab('new_bill')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: activeSubTab === 'new_bill' ? 700 : 600,
              backgroundColor: activeSubTab === 'new_bill' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'new_bill' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeSubTab === 'new_bill' ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <ShoppingCart size={16} />
            <span>POS Register</span>
          </button>

          <button
            onClick={() => setActiveSubTab('invoices')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: activeSubTab === 'invoices' ? 700 : 600,
              backgroundColor: activeSubTab === 'invoices' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'invoices' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeSubTab === 'invoices' ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <Printer size={16} />
            <span>All Invoices & Past Bills ({sales.length})</span>
          </button>
        </div>
      </div>

      {/* --- SUB-TAB 0: CUSTOM BILL PAPER BILLING (REQUESTED FEATURE) --- */}
      {activeSubTab === 'custom_paper' && (
        <CustomBillPaperBilling
          products={products}
          settings={settings}
          onCompleteSale={onCompleteSale}
        />
      )}

      {/* --- SUB-TAB 1: NEW BILL (POS COUNTER) --- */}
      {activeSubTab === 'new_bill' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 400px',
          gap: 20,
          alignItems: 'start'
        }}>
          {/* Left: Product Selection Catalog */}
          <div>
            {/* Search and Category Filter */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 16
            }}>
              <div style={{ position: 'relative', flex: '1 1 240px' }}>
                <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search products by name, brand or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: 42,
                    padding: '0 12px 0 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  height: 42,
                  padding: '0 28px 0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Product Quick-Add Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border)',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>📦</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>No Products in Inventory</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Add products from the Products tab to select and bill them here.
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 14
              }}>
                {filteredProducts.map(product => {
                const isOutOfStock = product.quantity <= 0;
                const inCart = cart.find(c => c.id === product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${inCart ? 'var(--primary)' : 'var(--border)'}`,
                      padding: 14,
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      opacity: isOutOfStock ? 0.6 : 1,
                      transition: 'var(--transition)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isOutOfStock) e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!inCart && !isOutOfStock) e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    {inCart && (
                      <span style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 999
                      }}>
                        {inCart.quantity} in bill
                      </span>
                    )}

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {product.category}
                      </div>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        marginTop: 2,
                        lineHeight: 1.3,
                        minHeight: 36
                      }}>
                        {product.name}
                      </div>
                      {product.brand && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {product.brand}
                        </div>
                      )}
                    </div>

                    <div style={{
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {currency}{Number(product.price).toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: isOutOfStock ? '#ef4444' : 'var(--text-muted)', fontWeight: 600 }}>
                          {isOutOfStock ? 'Out of Stock' : `${product.quantity} in stock`}
                        </div>
                      </div>

                      <button
                        disabled={isOutOfStock}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: isOutOfStock ? 'var(--bg-subtle)' : 'var(--primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>

          {/* Right: Current Bill / Cart Drawer */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Receipt size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Current Bill Items
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  style={{
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div style={{
              maxHeight: 280,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 10px', color: 'var(--text-muted)' }}>
                  <ShoppingCart size={36} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>No items in bill yet</p>
                  <p style={{ fontSize: '0.78rem' }}>Click products on the left to add them to this invoice</p>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 8,
                      gap: 8
                    }}
                  >
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {currency}{Number(item.price).toFixed(2)} each
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-main)'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-main)'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.88rem', minWidth: 60, textAlign: 'right' }}>
                      {currency}{(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: '#ef4444', padding: 4 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Customer Details Form */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                Customer Details (For Bill)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)'
                  }}
                />
                <input
                  type="tel"
                  placeholder="Mobile / Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                Payment Method
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {['Cash', 'UPI/QR', 'Card', 'Transfer'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '7px 4px',
                      borderRadius: 8,
                      border: `1px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: paymentMethod === method ? 'var(--primary-light)' : 'var(--bg-subtle)',
                      color: paymentMethod === method ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textAlign: 'center'
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount & Tax Options */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                    marginTop: 4
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
                <input
                  type="checkbox"
                  id="taxCheck"
                  checked={applyTax}
                  onChange={(e) => setApplyTax(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="taxCheck" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                  GST/Tax ({taxRate}%)
                </label>
              </div>
            </div>

            {/* Price Calculation Summary */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 10,
              padding: 12,
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span>{currency}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                  <span>Discount ({discountPercent}%):</span>
                  <span>-{currency}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Tax ({taxRate}%):</span>
                  <span>+{currency}{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--primary)',
                borderTop: '1px dashed var(--border)',
                paddingTop: 8,
                marginTop: 4
              }}>
                <span>Total Amount:</span>
                <span>{currency}{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Complete Sale & Generate Bill Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                backgroundColor: cart.length === 0 ? 'var(--border)' : 'var(--primary)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.96rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: cart.length > 0 ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <Receipt size={18} />
              <span>Generate Bill & Print / Download</span>
            </button>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: ALL INVOICES & PAST BILLS --- */}
      {activeSubTab === 'invoices' && (
        <div>
          {/* Revenue & Invoices KPI */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 20
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Sales Volume
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>
                  {currency}{totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Receipt size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Invoices Issued
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>
                  {sales.length}
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
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
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="Search past bills by invoice #, customer name, phone or product..."
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
              value={historyPaymentFilter}
              onChange={(e) => setHistoryPaymentFilter(e.target.value)}
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

          {/* Invoices Table */}
          {filteredSales.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border)',
              padding: '60px 20px',
              textAlign: 'center'
            }}>
              <Receipt size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>No Invoices Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Completed sales and customer billing transactions will appear here to reprint or re-download.
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
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 750 }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>INVOICE #</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATE & TIME</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>CUSTOMER</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ITEMS</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PAYMENT</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS (PRINT / DOWNLOAD)</th>
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
                        {currency}{Number(sale.total).toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                          {/* Print Bill Button */}
                          <button
                            onClick={() => printInvoice(sale, settings)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              backgroundColor: 'var(--primary-light)',
                              border: '1px solid var(--border)',
                              color: 'var(--primary)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                            title="Print Bill"
                          >
                            <Printer size={15} />
                            <span>Print</span>
                          </button>

                          {/* Download PDF Button */}
                          <button
                            onClick={() => generateInvoicePDF(sale, settings)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              backgroundColor: 'var(--bg-subtle)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-main)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                            title="Download PDF Invoice"
                          >
                            <FileDown size={15} />
                            <span>PDF</span>
                          </button>

                          {/* Preview Details */}
                          <button
                            onClick={() => setPreviewSale(sale)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 8,
                              backgroundColor: 'var(--bg-subtle)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-muted)',
                              fontSize: '0.82rem'
                            }}
                            title="View Bill Details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- SALE SUCCESS / BILL READY MODAL --- */}
      {completedSale && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: 120
        }}>
          <div className="animate-pop" style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: 26,
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={32} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>
              Bill Generated Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
              Invoice <strong>#{completedSale.invoiceNumber}</strong> is ready to print or download.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              marginBottom: 20,
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
                <strong>{completedSale.customerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <strong>{completedSale.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Count:</span>
                <strong>{completedSale.items.length} item(s)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span>Total Billed:</span>
                <span>{currency}{completedSale.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons for Print and Download */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCompletedSale(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                Close
              </button>

              <button
                onClick={() => printInvoice(completedSale, settings)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  backgroundColor: '#1e40af',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(30, 64, 175, 0.35)'
                }}
              >
                <Printer size={18} />
                <span>Print Bill</span>
              </button>

              <button
                onClick={() => generateInvoicePDF(completedSale, settings)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                }}
              >
                <FileDown size={18} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BILL PREVIEW MODAL --- */}
      {previewSale && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: 120
        }}>
          <div className="animate-pop" style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: 24,
            maxWidth: 580,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Invoice #{previewSale.invoiceNumber}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {new Date(previewSale.timestamp).toLocaleDateString()} {new Date(previewSale.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <button onClick={() => setPreviewSale(null)} style={{ color: 'var(--text-muted)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Customer & Payment Info */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
                <strong>{previewSale.customerName}</strong>
              </div>
              {previewSale.customerPhone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                  <span>{previewSale.customerPhone}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <span>{previewSale.paymentMethod}</span>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: 16 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px' }}>Item</th>
                  <th style={{ padding: '6px 4px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '6px 4px', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '6px 4px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {previewSale.items.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 4px' }}>
                      <div style={{ fontWeight: 600 }}>{it.name}</div>
                      {it.warranty > 0 && <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{it.warranty} months warranty</div>}
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{it.quantity}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'right' }}>{currency}{Number(it.price).toFixed(2)}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 700 }}>{currency}{(it.price * it.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: 8, marginBottom: 20, fontSize: '0.9rem' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Subtotal: {currency}{Number(previewSale.subtotal).toFixed(2)}</div>
              {previewSale.discountAmount > 0 && (
                <div style={{ color: '#ef4444', marginBottom: 4 }}>Discount: -{currency}{Number(previewSale.discountAmount).toFixed(2)}</div>
              )}
              {previewSale.taxAmount > 0 && (
                <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Tax: +{currency}{Number(previewSale.taxAmount).toFixed(2)}</div>
              )}
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: 6 }}>
                Grand Total: {currency}{Number(previewSale.total).toFixed(2)}
              </div>
            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setPreviewSale(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Close
              </button>
              <button
                onClick={() => printInvoice(previewSale, settings)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  backgroundColor: '#1e40af',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Printer size={16} />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => generateInvoicePDF(previewSale, settings)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <FileDown size={16} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
