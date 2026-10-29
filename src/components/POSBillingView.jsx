import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  QrCode, 
  User, 
  Phone, 
  Receipt, 
  ShieldCheck, 
  CheckCircle,
  AlertTriangle,
  FileDown,
  Printer,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../data/constants';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export default function POSBillingView({ 
  products, 
  settings, 
  onCompleteSale 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  
  // Customer & Billing details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [applyTax, setApplyTax] = useState(settings.taxEnabled ?? true);
  
  // Completed sale state for modal
  const [completedSale, setCompletedSale] = useState(null);

  const currency = settings.currency || '$';
  const taxRate = settings.taxRate || 5;

  // Filter products for the POS catalog
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
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
      alert('Cart is empty. Select items to checkout.');
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

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
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

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: 20,
        alignItems: 'start'
      }}>
        
        {/* Left: Product Selector */}
        <div>
          {/* Search and Category bar */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 16
          }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan / Type product name or SKU..."
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 14px 0 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                height: 42,
                padding: '0 30px 0 12px',
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
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Product Items Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto',
            paddingRight: 4
          }}>
            {filteredProducts.map(product => {
              const inStock = product.quantity > 0;
              const cartItem = cart.find(c => c.id === product.id);
              const inCartQty = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => inStock && addToCart(product)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${inCartQty > 0 ? 'var(--primary)' : 'var(--border)'}`,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: inStock ? 'pointer' : 'not-allowed',
                    opacity: inStock ? 1 : 0.6,
                    position: 'relative',
                    transition: 'var(--transition-fast)',
                    boxShadow: inCartQty > 0 ? 'var(--shadow-emerald)' : 'var(--shadow-sm)'
                  }}
                >
                  {inCartQty > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      width: 24,
                      height: 24,
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {inCartQty}
                    </div>
                  )}

                  <div>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      marginBottom: 4
                    }}>
                      {product.category}
                    </div>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      lineHeight: 1.3,
                      marginBottom: 6
                    }}>
                      {product.name}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      {product.brand}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTop: '1px dashed var(--border)'
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {currency}{product.price.toFixed(2)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: inStock ? 'var(--text-muted)' : 'var(--danger)'
                    }}>
                      {inStock ? `Stock: ${product.quantity}` : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cart & Billing Panel */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 20,
          boxShadow: 'var(--shadow-md)',
          position: 'sticky',
          top: 86
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            paddingBottom: 14,
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Billing Cart</h3>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-text)'
              }}>
                {cart.length}
              </span>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div style={{
            maxHeight: 220,
            overflowY: 'auto',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            {cart.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 10px',
                color: 'var(--text-muted)'
              }}>
                <ShoppingCart size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p style={{ fontSize: '0.88rem' }}>Cart is empty</p>
                <span style={{ fontSize: '0.75rem' }}>Click products from the catalog to add</span>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {currency}{item.price.toFixed(2)} x {item.quantity} = {currency}{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => updateCartQty(item.id, -1)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ padding: 4, color: 'var(--danger)', marginLeft: 4 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer Details Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <div>
              <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Customer Phone / Mobile #"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                PAYMENT METHOD
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {['Cash', 'Card', 'UPI/QR', 'Transfer'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '6px 4px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: paymentMethod === method ? 'var(--primary-light)' : 'var(--bg-subtle)',
                      color: paymentMethod === method ? 'var(--primary-text)' : 'var(--text-secondary)',
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

            {/* Discount & Tax Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 14 }}>
                <input
                  type="checkbox"
                  id="applyTaxCheckbox"
                  checked={applyTax}
                  onChange={(e) => setApplyTax(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <label htmlFor="applyTaxCheckbox" style={{ fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  Add Tax ({taxRate}%)
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 12,
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--danger)' }}>
                <span>Discount ({discountPercent}%):</span>
                <span>-{currency}{discountAmount.toFixed(2)}</span>
              </div>
            )}

            {applyTax && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Tax / GST ({taxRate}%):</span>
                <span>{currency}{taxAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--primary)',
              borderTop: '1px dashed var(--border)',
              paddingTop: 8,
              marginTop: 4
            }}>
              <span>Grand Total:</span>
              <span>{currency}{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: cart.length === 0 ? 'var(--border)' : 'var(--primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: cart.length > 0 ? 'var(--shadow-emerald)' : 'none',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Receipt size={18} />
            <span>Complete Sale & Bill</span>
          </button>
        </div>
      </div>

      {/* Sale Success & Invoice Modal */}
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
            padding: 24,
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={32} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>
              Sale Completed Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
              Invoice <strong>#{completedSale.invoiceNumber}</strong> generated and inventory quantities updated.
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
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <strong>{completedSale.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                <span>Total Amount:</span>
                <span>{currency}{completedSale.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setCompletedSale(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                Close
              </button>
              <button
                onClick={() => generateInvoicePDF(completedSale, settings)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-emerald)'
                }}
              >
                <FileDown size={18} />
                <span>Download PDF Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
