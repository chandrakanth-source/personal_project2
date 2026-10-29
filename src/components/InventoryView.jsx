import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Edit3, 
  Trash2, 
  Copy, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Package, 
  Tag, 
  DollarSign, 
  Archive,
  BarChart2,
  Grid,
  List
} from 'lucide-react';
import { CATEGORIES } from '../data/constants';

export default function InventoryView({ 
  products, 
  onAdjustStock, 
  onEditProduct, 
  onDeleteProduct, 
  onDuplicateProduct, 
  onOpenAddModal,
  currency,
  initialSearchQuery = '',
  initialCategoryFilter = 'ALL',
  filterLowStockOnly = false
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(
    filterLowStockOnly ? 'LOW_STOCK' : (initialCategoryFilter || 'ALL')
  );
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('table'); // default table mode matching dashboard style
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  // Filtered & Sorted items
  const filteredProducts = useMemo(() => {
    let list = products.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'LOW_STOCK') {
        const threshold = item.lowStockLevel ?? 2;
        return item.quantity <= threshold;
      }
      return item.category === selectedCategory;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock_asc') return a.quantity - b.quantity;
      if (sortBy === 'stock_desc') return b.quantity - a.quantity;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Quick stats
  const stats = useMemo(() => {
    let totalUnits = 0;
    let lowStock = 0;
    let totalValue = 0;

    products.forEach(p => {
      const qty = Number(p.quantity) || 0;
      const price = Number(p.price) || 0;
      const threshold = p.lowStockLevel ?? 2;
      totalUnits += qty;
      totalValue += (qty * price);
      if (qty <= threshold) lowStock++;
    });

    return {
      totalProducts: products.length,
      totalUnits,
      lowStock,
      totalValue
    };
  }, [products]);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Products & Stock Management Header */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
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
            <Package size={24} color="var(--primary)" />
            <span>Products & Stock Inventory</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
            Add new products and track physical stock quantities present inside the shop.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: 12,
            fontSize: '0.92rem',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          <Plus size={18} strokeWidth={3} />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Top Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Total Products */}
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
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Products
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {stats.totalProducts}
            </div>
          </div>
        </div>

        {/* Total Units */}
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
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Stock Units
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {stats.totalUnits}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: `1px solid ${stats.lowStock > 0 ? 'var(--danger-light)' : 'var(--border)'}`,
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Low Stock Alert
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stats.lowStock > 0 ? 'var(--danger)' : 'var(--text-main)', lineHeight: 1.2 }}>
              {stats.lowStock} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>items</span>
            </div>
          </div>
        </div>

        {/* Total Valuation */}
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
            backgroundColor: 'var(--accent-purple-light)',
            color: 'var(--accent-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Inventory Valuation
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {currency}{stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, category or SKU..."
            style={{
              width: '100%',
              height: 44,
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

        {/* Filter & Sort Controls */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              height: 44,
              padding: '0 32px 0 14px',
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
            <option value="LOW_STOCK">⚠️ Low Stock Alert Only</option>
            <optgroup label="Shop Categories">
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </optgroup>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              height: 44,
              padding: '0 32px 0 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="updated">Sort by: Recently Updated</option>
            <option value="name">Sort by: Item Name (A-Z)</option>
            <option value="stock_asc">Sort by: Stock (Low to High)</option>
            <option value="stock_desc">Sort by: Stock (High to Low)</option>
            <option value="price_asc">Sort by: Price (Low to High)</option>
            <option value="price_desc">Sort by: Price (High to Low)</option>
          </select>

          {/* View Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: 2
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none'
              }}
              title="Card View"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'table' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none'
              }}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Items Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Shop Inventory Catalog</span>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-text)'
          }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <button
          onClick={onOpenAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Package size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 20px', fontSize: '0.9rem' }}>
            {searchQuery || selectedCategory !== 'ALL'
              ? 'No items matched your search query or filter criteria. Try resetting your filter.'
              : 'Your inventory is currently empty. Add your first computer shop product now!'}
          </p>
          <button
            onClick={onOpenAddModal}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-emerald)'
            }}
          >
            <Plus size={18} strokeWidth={2.8} />
            <span>Add New Item</span>
          </button>
        </div>
      )}

      {/* Grid Mode View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 18
        }}>
          {filteredProducts.map(item => {
            const qty = Number(item.quantity) || 0;
            const threshold = item.lowStockLevel ?? 2;
            const isLowStock = qty <= threshold;
            const warrantyMonths = Number(item.warranty) || 0;

            return (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${isLowStock ? 'rgba(239, 68, 68, 0.45)' : 'var(--border)'}`,
                  boxShadow: 'var(--shadow-sm)',
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'var(--transition)'
                }}
              >
                {/* Top Alert Bar if Low Stock */}
                {isLowStock && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #ef4444, #f59e0b)'
                  }} />
                )}

                <div>
                  {/* Category & Status Badges */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 12
                  }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-text)'
                      }}>
                        {item.category}
                      </span>
                      {isLowStock && (
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--danger-light)',
                          color: 'var(--danger-text)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <AlertTriangle size={11} />
                          Low ({qty}/{threshold})
                        </span>
                      )}
                    </div>

                    {/* Action icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button
                        onClick={() => onDuplicateProduct(item)}
                        title="Duplicate Item"
                        style={{
                          padding: 6,
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => onEditProduct(item)}
                        title="Edit Item"
                        style={{
                          padding: 6,
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--primary)'
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        title="Delete Item"
                        style={{
                          padding: 6,
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--danger)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Brand */}
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    lineHeight: 1.35,
                    marginBottom: 4,
                    wordBreak: 'break-word'
                  }}>
                    {item.name}
                  </h3>
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Tag size={13} />
                    <span>Brand: <strong style={{ color: 'var(--text-secondary)' }}>{item.brand}</strong></span>
                    {item.sku && (
                      <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.8 }}>
                        SKU: {item.sku}
                      </span>
                    )}
                  </div>

                  {/* Details Card */}
                  <div style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '10px 14px',
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Selling Price
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {currency}{item.price.toFixed(2)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Warranty
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldCheck size={14} color="var(--primary)" />
                        {warrantyMonths > 0 ? `${warrantyMonths} Mo` : 'None'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTop: '1px dashed var(--border)'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    In Stock:
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: 3,
                    gap: 6
                  }}>
                    <button
                      onClick={() => onAdjustStock(item.id, -1)}
                      disabled={qty <= 0}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-card)',
                        color: qty <= 0 ? 'var(--text-muted)' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        boxShadow: 'var(--shadow-sm)',
                        cursor: qty <= 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Minus size={16} />
                    </button>

                    <span style={{
                      minWidth: 44,
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: isLowStock ? 'var(--danger)' : 'var(--text-main)'
                    }}>
                      {qty}
                    </span>

                    <button
                      onClick={() => onAdjustStock(item.id, 1)}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Mode View */}
      {viewMode === 'table' && filteredProducts.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ITEM & BRAND</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>CATEGORY</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PRICE</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>WARRANTY</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>STOCK</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(item => {
                const qty = Number(item.quantity) || 0;
                const threshold = item.lowStockLevel ?? 2;
                const isLowStock = qty <= threshold;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.brand} {item.sku ? `• SKU: ${item.sku}` : ''}</div>
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
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                      {currency}{item.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.warranty ? `${item.warranty} Months` : 'None'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => onAdjustStock(item.id, -1)}
                          disabled={qty <= 0}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: qty <= 0 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{
                          fontWeight: 800,
                          minWidth: 32,
                          color: isLowStock ? 'var(--danger)' : 'var(--text-main)'
                        }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => onAdjustStock(item.id, 1)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {isLowStock && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 700, marginTop: 2 }}>
                          Low Stock
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          onClick={() => onEditProduct(item)}
                          style={{ padding: 6, borderRadius: 'var(--radius-xs)', color: 'var(--primary)' }}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          style={{ padding: 6, borderRadius: 'var(--radius-xs)', color: 'var(--danger)' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: 110
        }}>
          <div className="animate-pop" style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: 24,
            maxWidth: 440,
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, color: 'var(--danger)' }}>
              Confirm Deletion
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: 6 }}>
              Are you sure you want to remove <strong>"{deleteConfirmItem.name}"</strong>?
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              This will permanently delete the item from your store stock database.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setDeleteConfirmItem(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(deleteConfirmItem.id);
                  setDeleteConfirmItem(null);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
