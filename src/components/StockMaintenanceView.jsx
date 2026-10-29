import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Laptop, 
  Tv, 
  Cpu, 
  HardDrive, 
  Mouse, 
  Keyboard as KeyboardIcon,
  Printer,
  Wifi,
  Zap,
  Headphones,
  Check, 
  ChevronDown 
} from 'lucide-react';
import { 
  CATEGORIES, 
  PRODUCT_NAME_OPTIONS, 
  PRODUCT_CONFIG_SCHEMAS 
} from '../data/constants';

export default function StockMaintenanceView({
  products,
  onSaveProducts,
  showToast
}) {
  // Current Selected Product
  const [productName, setProductName] = useState('Laptop');

  // Dynamic configuration field values dictionary: { [fieldId]: value }
  const [configValues, setConfigValues] = useState(() => {
    const initialSchema = PRODUCT_CONFIG_SCHEMAS['Laptop'];
    const initial = {};
    initialSchema.fields.forEach(f => {
      initial[f.id] = f.defaultValue;
    });
    return initial;
  });

  // Quantity and Price
  const [quantity, setQuantity] = useState('10');
  const [price, setPrice] = useState('54990');

  // Search & Filter state for Available Stock table
  const [tableSearch, setTableSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Edit item state
  const [editingItemId, setEditingItemId] = useState(null);

  // Active Schema for the current product name
  const currentSchema = useMemo(() => {
    return PRODUCT_CONFIG_SCHEMAS[productName] || PRODUCT_CONFIG_SCHEMAS['Laptop'];
  }, [productName]);

  // When user changes Product Name in Step 1
  const handleProductChange = (newProductName) => {
    setProductName(newProductName);
    const schema = PRODUCT_CONFIG_SCHEMAS[newProductName] || PRODUCT_CONFIG_SCHEMAS['Laptop'];

    // Update configuration fields to defaults of the new product
    const newConfig = {};
    schema.fields.forEach(f => {
      newConfig[f.id] = f.defaultValue;
    });
    setConfigValues(newConfig);

    // If not actively editing an existing item, auto-adjust suggested quantity and price
    if (!editingItemId) {
      setQuantity(String(schema.defaultQuantity));
      setPrice(String(schema.defaultPrice));
    }
  };

  // When user changes a specific configuration dropdown in Step 2
  const handleConfigFieldChange = (fieldId, value) => {
    setConfigValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Helper icon for selected product
  const getProductIcon = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('laptop')) return <Laptop size={22} color="#1d68ed" />;
    if (n.includes('monitor') || n.includes('desktop')) return <Tv size={22} color="#0284c7" />;
    if (n.includes('mouse')) return <Mouse size={22} color="#475569" />;
    if (n.includes('keyboard')) return <KeyboardIcon size={22} color="#475569" />;
    if (n.includes('ram') || n.includes('component')) return <Cpu size={22} color="#16a34a" />;
    if (n.includes('ssd') || n.includes('hdd') || n.includes('storage')) return <HardDrive size={22} color="#7c3aed" />;
    if (n.includes('printer')) return <Printer size={22} color="#059669" />;
    if (n.includes('router') || n.includes('wifi')) return <Wifi size={22} color="#2563eb" />;
    if (n.includes('ups')) return <Zap size={22} color="#d97706" />;
    if (n.includes('headphone')) return <Headphones size={22} color="#9333ea" />;
    return <Box size={22} color="#1d68ed" />;
  };

  // Helper image thumbnail for row
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

  // Pre-fill form when editing an item
  const handleStartEdit = (item) => {
    setEditingItemId(item.id);
    const targetProduct = PRODUCT_NAME_OPTIONS.includes(item.name) ? item.name : 'Laptop';
    setProductName(targetProduct);
    
    const schema = PRODUCT_CONFIG_SCHEMAS[targetProduct] || PRODUCT_CONFIG_SCHEMAS['Laptop'];
    const newConfig = {};
    schema.fields.forEach(f => {
      newConfig[f.id] = item[f.id] || f.defaultValue;
    });
    // Fallbacks for common fields
    if (item.brand) newConfig.brand = item.brand;
    if (item.processor) newConfig.processor = item.processor;
    if (item.ram) newConfig.ram = item.ram;
    if (item.storage) newConfig.storage = item.storage;
    if (item.screenSize) newConfig.screenSize = item.screenSize;

    setConfigValues(newConfig);
    setQuantity(String(item.quantity ?? 10));
    setPrice(String(item.price ?? 54990));
    showToast?.(`Editing "${item.name}" - update details in form above`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Add / Update Item
  const handleAddOrUpdate = (e) => {
    e?.preventDefault();
    const qty = parseInt(quantity, 10);
    const prc = parseFloat(price);

    if (isNaN(qty) || qty < 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    if (isNaN(prc) || prc < 0) {
      alert('Please enter a valid price.');
      return;
    }

    // Format configuration string based on current schema
    const configString = currentSchema.formatConfig(configValues);
    const brand = configValues.brand || 'Original';

    if (editingItemId) {
      // Update existing item
      const updated = products.map(p => {
        if (p.id === editingItemId) {
          return {
            ...p,
            name: productName,
            brand,
            ...configValues,
            configuration: configString,
            category: currentSchema.category,
            quantity: qty,
            price: prc,
            status: qty > 0 ? 'In Stock' : 'Out of Stock'
          };
        }
        return p;
      });
      onSaveProducts(updated);
      setEditingItemId(null);
      showToast?.(`Updated "${productName}" successfully!`);
    } else {
      // Create new item
      const newItem = {
        id: `prod-${Date.now()}`,
        name: productName,
        brand,
        ...configValues,
        configuration: configString,
        category: currentSchema.category,
        quantity: qty,
        price: prc,
        status: qty > 0 ? 'In Stock' : 'Out of Stock',
        image: getProductImage({ name: productName })
      };
      onSaveProducts([newItem, ...products]);
      showToast?.(`Added "${productName}" to stock!`);
    }
  };

  // Handle Delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from stock?`)) {
      const updated = products.filter(p => p.id !== id);
      onSaveProducts(updated);
      if (editingItemId === id) setEditingItemId(null);
      showToast?.(`Removed "${name}" from stock.`, 'danger');
    }
  };

  // Filter products for the Available Stock table
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const q = tableSearch.toLowerCase().trim();
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.configuration && item.configuration.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (selectedCategory === 'All Categories') return true;
      return item.category === selectedCategory;
    });
  }, [products, tableSearch, selectedCategory]);

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
      {/* 1. Page Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: '#1d68ed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 18px rgba(29, 104, 237, 0.35)'
          }}>
            <Box size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#1e3a8a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Stock Maintenance
            </h1>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748b',
              marginTop: 4
            }}>
              Add new products, update stock and manage your inventory easily.
            </p>
          </div>
        </div>

        {/* Right Decorative banner badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'linear-gradient(90deg, rgba(239, 246, 255, 0) 0%, rgba(239, 246, 255, 0.8) 100%)',
          padding: '8px 16px',
          borderRadius: 14
        }}>
          <img
            src="/images/hero_devices.jpg"
            alt="Hardware Setup"
            style={{
              height: 58,
              width: 'auto',
              borderRadius: 8,
              objectFit: 'contain'
            }}
          />
        </div>
      </div>

      {/* 2. Add New Item Card (3 Columns with Dynamic Configuration) */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '28px 32px',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#1e3a8a'
          }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#1d68ed',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={16} strokeWidth={3} />
            </div>
            <span>{editingItemId ? 'Update Item Details' : 'Add New Item'}</span>
          </div>

          {editingItemId && (
            <button
              onClick={() => {
                setEditingItemId(null);
                handleProductChange('Laptop');
              }}
              style={{
                fontSize: '0.82rem',
                color: '#64748b',
                backgroundColor: 'var(--bg-subtle)',
                padding: '6px 14px',
                borderRadius: 8,
                fontWeight: 600
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* 3 Step Columns Grid */}
        <form onSubmit={handleAddOrUpdate}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr 1fr',
            gap: 32,
            alignItems: 'start'
          }}>
            {/* Step 1: Select Product Name */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#1d68ed',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  1
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  Select Product Name
                </span>
              </div>

              {/* Product dropdown */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <select
                  value={productName}
                  onChange={(e) => handleProductChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: 10,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                    appearance: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {PRODUCT_NAME_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: 14, top: 14, pointerEvents: 'none' }} />
              </div>

              {/* Selected Product Card */}
              <div style={{
                backgroundColor: '#f0f7ff',
                border: '1px solid #dbeafe',
                borderRadius: 12,
                padding: '18px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(29, 104, 237, 0.12)',
                  flexShrink: 0
                }}>
                  {getProductIcon(productName)}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e3a8a' }}>
                    Selected Product: {productName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                    {currentSchema.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Select Configuration (Dynamically adapts to selected product) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#1d68ed',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  2
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  Select Configuration
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentSchema.fields.map(field => {
                  const currentValue = configValues[field.id] || field.defaultValue;

                  return (
                    <div 
                      key={field.id} 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '110px 1fr', 
                        alignItems: 'center', 
                        gap: 12 
                      }}
                    >
                      <label style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        color: '#475569', 
                        textAlign: 'right',
                        whiteSpace: 'nowrap'
                      }}>
                        {field.label}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={currentValue}
                          onChange={(e) => handleConfigFieldChange(field.id, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 14px',
                            borderRadius: 8,
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-subtle)',
                            fontSize: '0.86rem',
                            color: 'var(--text-main)',
                            appearance: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Enter Stock Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#1d68ed',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  3
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  Enter Stock Details
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Quantity */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                      fontWeight: 600
                    }}
                  />
                </div>

                {/* Price */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                      fontWeight: 600
                    }}
                  />
                </div>

                {/* Add to Stock Button */}
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    backgroundColor: '#1d68ed',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: 10,
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(29, 104, 237, 0.35)',
                    marginTop: 4,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1555cb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1d68ed'}
                >
                  <Plus size={18} strokeWidth={2.8} />
                  <span>{editingItemId ? 'Update Stock' : 'Add to Stock'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Available Stock Card (Table matching Image 1) */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Table Header controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#1e3a8a',
            letterSpacing: '-0.02em'
          }}>
            Available Stock
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '8px 14px',
              width: 250
            }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  width: '100%'
                }}
              />
            </div>

            {/* Category Filter Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '8px 32px 8px 34px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  appearance: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter size={14} color="#64748b" style={{ position: 'absolute', left: 12, top: 11, pointerEvents: 'none' }} />
              <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: 12, top: 11, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* The Stock Table matching image 1 */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>#</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Configuration</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      {/* # Number */}
                      <td style={{ color: '#64748b', fontWeight: 600 }}>
                        {index + 1}
                      </td>

                      {/* Product Name with thumbnail */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            backgroundColor: '#f1f5f9',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <img
                              src={getProductImage(item)}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Brand */}
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {item.brand || '—'}
                      </td>

                      {/* Configuration */}
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {item.configuration || 'Standard'}
                      </td>

                      {/* Quantity */}
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.quantity}
                      </td>

                      {/* Price */}
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {Number(item.price).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          backgroundColor: item.quantity > 0 ? '#dcfce7' : '#fee2e2',
                          color: item.quantity > 0 ? '#15803d' : '#b91c1c'
                        }}>
                          {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Actions (Blue edit, Red delete) */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          {/* Edit button: blue square */}
                          <button
                            onClick={() => handleStartEdit(item)}
                            title="Edit product"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              backgroundColor: '#1d68ed',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(29, 104, 237, 0.25)'
                            }}
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Delete button: red square */}
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            title="Delete product"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              backgroundColor: '#ef4444',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
