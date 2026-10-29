import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Package, 
  DollarSign, 
  Shield, 
  Sparkles, 
  Cpu, 
  HardDrive, 
  Laptop, 
  Monitor, 
  Printer, 
  Wifi, 
  Zap, 
  Mouse, 
  HelpCircle,
  TrendingUp,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../data/constants';

// Category-specific suggestions and preset options
const BRAND_PRESETS = {
  'RAM / Memory': ['Kingston', 'Crucial', 'Corsair', 'Samsung', 'Adata', 'G.Skill', 'Hynix', 'Consistent'],
  'Storage (SSD / HDD)': ['Samsung', 'Western Digital (WD)', 'Kingston', 'Crucial', 'SanDisk', 'Seagate', 'Consistent'],
  'Laptops': ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI'],
  'Desktops': ['Dell', 'HP', 'Lenovo', 'Assembled', 'Asus', 'Frontech', 'Zebronics'],
  'Monitors': ['LG', 'Samsung', 'Dell', 'HP', 'BenQ', 'Acer', 'Zebronics', 'ViewSonic'],
  'Accessories': ['Logitech', 'HP', 'Dell', 'Zebronics', 'Fingers', 'Portronics', 'Redragon', 'TVS'],
  'Components': ['Intel', 'AMD', 'Gigabyte', 'ASUS', 'MSI', 'Corsair', 'Ant Esports', 'Cooler Master'],
  'Networking': ['TP-Link', 'D-Link', 'Tenda', 'Netgear', 'Mercusys', 'Cisco'],
  'Printers': ['Canon', 'Epson', 'HP', 'Brother', 'TVS (Thermal)', 'Everycom'],
  'Power / UPS': ['APC', 'Microtek', 'Luminous', 'Artis', 'Zebronics', 'Frontech'],
  'Software': ['Microsoft', 'Quick Heal', 'Kaspersky', 'K7 Security', 'Tally'],
  'Other': ['Generic', 'OEM']
};

export default function ItemModal({ isOpen, onClose, onSave, editingItem, currency = '₹' }) {
  // Main form fields ordered as requested:
  // 1. category
  // 2. brand
  // 3. cost price & selling price
  // 4. quantity & low stock level
  // 5. warranty
  // 6. item notes / serial info
  const [formData, setFormData] = useState({
    category: 'RAM / Memory',
    brand: '',
    name: '',
    costPrice: '',
    price: '',
    quantity: '1',
    lowStockLevel: '2',
    warranty: '36',
    sku: '',
    notes: ''
  });

  // Dynamic Category Specific Inputs
  const [catSpecs, setCatSpecs] = useState({
    // RAM specs
    ramSize: '16GB',
    ramType: 'DDR4',
    ramSpeed: '3200MHz',
    ramFormFactor: 'Desktop (U-DIMM)',
    // Storage specs
    storageType: 'NVMe M.2 SSD',
    storageCapacity: '512GB',
    storageInterface: 'PCIe Gen 3.0',
    // Laptop specs
    laptopCpu: 'Intel Core i5',
    laptopGen: '13th Gen',
    laptopRam: '16GB',
    laptopStorage: '512GB SSD',
    laptopScreen: '15.6"',
    // Desktop specs
    desktopCpu: 'Intel Core i5',
    desktopMobo: 'H610',
    desktopRam: '16GB',
    desktopStorage: '512GB SSD',
    // Monitor specs
    monitorSize: '24"',
    monitorResolution: 'FHD 1080p',
    monitorRefresh: '75Hz',
    // Power / UPS specs
    powerType: 'Line-Interactive UPS',
    powerCapacity: '600VA',
    // Printer specs
    printerType: 'All-in-One InkTank',
    // Networking specs
    networkType: 'Wi-Fi Router',
    networkSpeed: 'AC1200 Dual Band',
    // Accessories specs
    accessoryType: 'Wireless Mouse',
    accessoryInterface: 'USB 2.4GHz Wireless'
  });

  const [errors, setErrors] = useState({});
  const [isNameManuallyEdited, setIsNameManuallyEdited] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        category: editingItem.category || 'RAM / Memory',
        brand: editingItem.brand || '',
        name: editingItem.name || '',
        costPrice: editingItem.costPrice ? editingItem.costPrice.toString() : '',
        price: editingItem.price ? editingItem.price.toString() : '',
        quantity: (editingItem.quantity ?? 1).toString(),
        lowStockLevel: (editingItem.lowStockLevel ?? 2).toString(),
        warranty: (editingItem.warranty ?? 12).toString(),
        sku: editingItem.sku || '',
        notes: editingItem.notes || ''
      });
      setIsNameManuallyEdited(true);
    } else {
      setFormData({
        category: 'RAM / Memory',
        brand: 'Kingston',
        name: 'Kingston 16GB DDR4 3200MHz Desktop RAM',
        costPrice: '',
        price: '',
        quantity: '1',
        lowStockLevel: '2',
        warranty: '36',
        sku: '',
        notes: ''
      });
      setIsNameManuallyEdited(false);
    }
    setErrors({});
  }, [editingItem, isOpen]);

  // Compute Auto Name from Category + Brand + Specs
  const autoComposedName = useMemo(() => {
    const brand = formData.brand.trim() || 'Generic';
    const cat = formData.category;

    if (cat === 'RAM / Memory' || cat.toLowerCase().includes('ram')) {
      return `${brand} ${catSpecs.ramSize} ${catSpecs.ramType} ${catSpecs.ramSpeed} ${catSpecs.ramFormFactor.includes('Laptop') ? 'Laptop' : 'Desktop'} RAM`;
    }
    if (cat === 'Storage (SSD / HDD)' || cat.toLowerCase().includes('storage')) {
      return `${brand} ${catSpecs.storageCapacity} ${catSpecs.storageType}`;
    }
    if (cat === 'Laptops' || cat.toLowerCase().includes('laptop')) {
      return `${brand} Laptop (${catSpecs.laptopCpu} ${catSpecs.laptopGen}, ${catSpecs.laptopRam}, ${catSpecs.laptopStorage}, ${catSpecs.laptopScreen})`;
    }
    if (cat === 'Desktops' || cat.toLowerCase().includes('desktop')) {
      return `${brand} Desktop PC (${catSpecs.desktopCpu}, ${catSpecs.desktopMobo}, ${catSpecs.desktopRam}, ${catSpecs.desktopStorage})`;
    }
    if (cat === 'Monitors' || cat.toLowerCase().includes('monitor')) {
      return `${brand} ${catSpecs.monitorSize} ${catSpecs.monitorResolution} ${catSpecs.monitorRefresh} Monitor`;
    }
    if (cat === 'Power / UPS' || cat.toLowerCase().includes('power')) {
      return `${brand} ${catSpecs.powerCapacity} ${catSpecs.powerType}`;
    }
    if (cat === 'Printers' || cat.toLowerCase().includes('printer')) {
      return `${brand} ${catSpecs.printerType}`;
    }
    if (cat === 'Networking' || cat.toLowerCase().includes('network')) {
      return `${brand} ${catSpecs.networkSpeed} ${catSpecs.networkType}`;
    }
    if (cat === 'Accessories' || cat.toLowerCase().includes('accessories')) {
      return `${brand} ${catSpecs.accessoryType} (${catSpecs.accessoryInterface})`;
    }
    return `${brand} ${formData.name || cat}`;
  }, [formData.category, formData.brand, catSpecs]);

  // Sync auto-composed name if user hasn't explicitly typed custom name
  useEffect(() => {
    if (!editingItem && !isNameManuallyEdited) {
      setFormData(prev => ({ ...prev, name: autoComposedName }));
    }
  }, [autoComposedName, editingItem, isNameManuallyEdited]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setIsNameManuallyEdited(true);
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCatSpecChange = (key, val) => {
    setCatSpecs(prev => ({ ...prev, [key]: val }));
  };

  const handleSelectBrandPreset = (brandName) => {
    setFormData(prev => ({ ...prev, brand: brandName }));
    if (errors.brand) setErrors(prev => ({ ...prev, brand: null }));
  };

  // Profit calculation helper
  const costVal = parseFloat(formData.costPrice) || 0;
  const sellVal = parseFloat(formData.price) || 0;
  const profitVal = sellVal - costVal;
  const marginPercent = sellVal > 0 ? ((profitVal / sellVal) * 100).toFixed(1) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid selling price is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Auto-generate SKU if left blank
    const cleanBrand = formData.brand.trim().slice(0, 3).toUpperCase();
    const cleanCat = formData.category.slice(0, 3).toUpperCase();
    const generatedSku = `${cleanBrand}-${cleanCat}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      id: editingItem ? editingItem.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      sku: formData.sku.trim() || (editingItem?.sku || generatedSku),
      costPrice: costVal,
      price: sellVal,
      quantity: Math.max(0, parseInt(formData.quantity, 10) || 0),
      lowStockLevel: Math.max(0, parseInt(formData.lowStockLevel, 10) || 2),
      warranty: Math.max(0, parseInt(formData.warranty, 10) || 0),
      notes: formData.notes.trim(),
      catSpecs: { ...catSpecs },
      updatedAt: Date.now()
    };

    onSave(payload);
  };

  const currentBrandPresets = BRAND_PRESETS[formData.category] || BRAND_PRESETS['Other'];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 110
    }}>
      <div 
        className="animate-pop"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 18,
          border: '1px solid var(--border)',
          width: '100%',
          maxWidth: 680,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Package size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {editingItem ? 'Edit Product Item' : 'Add New Inventory Item'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Select category to fill specialized inputs, costs & warranty
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 8,
              color: 'var(--text-muted)',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <form onSubmit={handleSubmit} style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* STEP 1: CATEGORY */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  1. Product Category *
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Controls dynamic spec inputs below
                </span>
              </div>

              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleChange(e);
                  // Update default brand to match first preset of selected category
                  const presets = BRAND_PRESETS[e.target.value] || [];
                  if (presets.length > 0 && !formData.brand) {
                    setFormData(prev => ({ ...prev, brand: presets[0] }));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: `1px solid ${errors.category ? '#ef4444' : 'var(--border)'}`,
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Quick Category Chips for Fast Tapping */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {['RAM / Memory', 'Storage (SSD / HDD)', 'Laptops', 'Desktops', 'Monitors', 'Accessories', 'Printers', 'Power / UPS'].map(quickCat => (
                  <button
                    key={quickCat}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: quickCat }));
                      const presets = BRAND_PRESETS[quickCat] || [];
                      if (presets.length > 0) setFormData(prev => ({ ...prev, category: quickCat, brand: presets[0] }));
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: '0.72rem',
                      fontWeight: formData.category === quickCat ? 800 : 500,
                      backgroundColor: formData.category === quickCat ? 'var(--primary)' : 'var(--bg-card)',
                      color: formData.category === quickCat ? '#ffffff' : 'var(--text-secondary)',
                      border: `1px solid ${formData.category === quickCat ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {quickCat}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: BRAND */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  2. Brand *
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Click a preset or type custom
                </span>
              </div>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Kingston, Crucial, Dell, HP, Samsung, Logitech"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1px solid ${errors.brand ? '#ef4444' : 'var(--border)'}`,
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              {errors.brand && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.brand}</span>}

              {/* Brand Presets Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {currentBrandPresets.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectBrandPreset(preset)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: 6,
                      fontSize: '0.73rem',
                      fontWeight: formData.brand === preset ? 800 : 500,
                      backgroundColor: formData.brand === preset ? 'var(--primary-light)' : 'var(--bg-subtle)',
                      color: formData.brand === preset ? 'var(--primary)' : 'var(--text-muted)',
                      border: `1px solid ${formData.brand === preset ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC CATEGORY INPUTS SPECIFIC TO HARDWARE */}
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.04)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: 14,
              padding: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Cpu size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formData.category} Specifications (Dynamic Inputs)
                </span>
              </div>

              {/* --- 1. RAM / Memory Dynamic Inputs --- */}
              {(formData.category === 'RAM / Memory' || formData.category.toLowerCase().includes('ram')) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RAM Size *</label>
                    <select
                      value={catSpecs.ramSize}
                      onChange={(e) => handleCatSpecChange('ramSize', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['4GB', '8GB', '16GB', '32GB', '64GB'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Generation *</label>
                    <select
                      value={catSpecs.ramType}
                      onChange={(e) => handleCatSpecChange('ramType', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['DDR3', 'DDR3L', 'DDR4', 'DDR5', 'LPDDR4'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Frequency / Speed</label>
                    <select
                      value={catSpecs.ramSpeed}
                      onChange={(e) => handleCatSpecChange('ramSpeed', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['1600MHz', '2400MHz', '2666MHz', '3200MHz', '4800MHz', '5200MHz', '5600MHz', '6000MHz'].map(sp => <option key={sp} value={sp}>{sp}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Form Factor</label>
                    <select
                      value={catSpecs.ramFormFactor}
                      onChange={(e) => handleCatSpecChange('ramFormFactor', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      <option value="Desktop (U-DIMM)">Desktop (DIMM)</option>
                      <option value="Laptop (SO-DIMM)">Laptop (SO-DIMM)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* --- 2. Storage Dynamic Inputs --- */}
              {(formData.category === 'Storage (SSD / HDD)' || formData.category.toLowerCase().includes('storage')) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Storage Form Factor *</label>
                    <select
                      value={catSpecs.storageType}
                      onChange={(e) => handleCatSpecChange('storageType', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      <option value="NVMe M.2 SSD">NVMe M.2 SSD</option>
                      <option value="SATA 2.5 SSD">SATA 2.5" SSD</option>
                      <option value="3.5 Desktop HDD">3.5" Desktop HDD</option>
                      <option value="2.5 Laptop HDD">2.5" Laptop HDD</option>
                      <option value="External USB HDD/SSD">External USB HDD/SSD</option>
                      <option value="USB Pen Drive">USB Pen Drive</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Capacity / Size *</label>
                    <select
                      value={catSpecs.storageCapacity}
                      onChange={(e) => handleCatSpecChange('storageCapacity', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['32GB', '64GB', '128GB', '256GB', '500GB', '512GB', '1TB', '2TB', '4TB'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Interface / Speed</label>
                    <select
                      value={catSpecs.storageInterface}
                      onChange={(e) => handleCatSpecChange('storageInterface', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      <option value="PCIe Gen 3.0">PCIe Gen 3.0 (Up to 3500MB/s)</option>
                      <option value="PCIe Gen 4.0">PCIe Gen 4.0 (Up to 7400MB/s)</option>
                      <option value="SATA III 6Gb/s">SATA III (6Gb/s)</option>
                      <option value="USB 3.2 Gen 1">USB 3.2 Gen 1</option>
                    </select>
                  </div>
                </div>
              )}

              {/* --- 3. Laptops Dynamic Inputs --- */}
              {(formData.category === 'Laptops' || formData.category.toLowerCase().includes('laptop')) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Processor / CPU</label>
                    <select
                      value={catSpecs.laptopCpu}
                      onChange={(e) => handleCatSpecChange('laptopCpu', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1/M2/M3'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Generation</label>
                    <select
                      value={catSpecs.laptopGen}
                      onChange={(e) => handleCatSpecChange('laptopGen', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['11th Gen', '12th Gen', '13th Gen', '14th Gen', '5000 Series', '7000 Series'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RAM</label>
                    <select
                      value={catSpecs.laptopRam}
                      onChange={(e) => handleCatSpecChange('laptopRam', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['8GB', '16GB', '32GB'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SSD</label>
                    <select
                      value={catSpecs.laptopStorage}
                      onChange={(e) => handleCatSpecChange('laptopStorage', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['256GB SSD', '512GB SSD', '1TB SSD'].map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Screen Size</label>
                    <select
                      value={catSpecs.laptopScreen}
                      onChange={(e) => handleCatSpecChange('laptopScreen', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['14"', '15.6"', '16"', '17.3"'].map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* --- 4. Monitors Dynamic Inputs --- */}
              {(formData.category === 'Monitors' || formData.category.toLowerCase().includes('monitor')) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Display Size</label>
                    <select
                      value={catSpecs.monitorSize}
                      onChange={(e) => handleCatSpecChange('monitorSize', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['19"', '21.5"', '24"', '27"', '32"'].map(ms => <option key={ms} value={ms}>{ms}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Resolution</label>
                    <select
                      value={catSpecs.monitorResolution}
                      onChange={(e) => handleCatSpecChange('monitorResolution', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['HD (720p)', 'FHD 1080p', '2K QHD', '4K UHD'].map(mr => <option key={mr} value={mr}>{mr}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Refresh Rate</label>
                    <select
                      value={catSpecs.monitorRefresh}
                      onChange={(e) => handleCatSpecChange('monitorRefresh', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['60Hz', '75Hz', '100Hz', '144Hz', '165Hz', '240Hz'].map(rf => <option key={rf} value={rf}>{rf}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* --- 5. Power / UPS / Printers / Networking fallback --- */}
              {formData.category === 'Power / UPS' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Device Type</label>
                    <select
                      value={catSpecs.powerType}
                      onChange={(e) => handleCatSpecChange('powerType', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['Line-Interactive UPS', 'Online UPS', 'Laptop Adapter 65W', 'Laptop Adapter 90W', 'Desktop SMPS 450W', 'Desktop SMPS 550W'].map(pt => <option key={pt} value={pt}>{pt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Rating / Capacity</label>
                    <select
                      value={catSpecs.powerCapacity}
                      onChange={(e) => handleCatSpecChange('powerCapacity', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['600VA', '1000VA', '1500VA', '2000VA', '65W', '90W', '450W', '550W', '650W'].map(pc => <option key={pc} value={pc}>{pc}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {formData.category === 'Accessories' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Accessory Item</label>
                    <select
                      value={catSpecs.accessoryType}
                      onChange={(e) => handleCatSpecChange('accessoryType', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['Wireless Mouse', 'Wired Mouse', 'Mechanical Keyboard', 'Keyboard & Mouse Combo', 'Headset with Mic', 'Webcam 1080p', 'HDMI Cable', 'USB Hub'].map(at => <option key={at} value={at}>{at}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Connectivity</label>
                    <select
                      value={catSpecs.accessoryInterface}
                      onChange={(e) => handleCatSpecChange('accessoryInterface', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}
                    >
                      {['USB Wired', 'USB 2.4GHz Wireless', 'Bluetooth', 'USB-C'].map(ai => <option key={ai} value={ai}>{ai}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Item Title / Model Field with Auto-Compose Helper */}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed rgba(37, 99, 235, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Item Name / Title on Bills & Catalog *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, name: autoComposedName }));
                      setIsNameManuallyEdited(false);
                    }}
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Sparkles size={12} /> Auto-format name
                  </button>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kingston 16GB DDR4 3200MHz Desktop RAM"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: `1px solid ${errors.name ? '#ef4444' : 'var(--border)'}`,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.73rem', marginTop: 2, display: 'block' }}>{errors.name}</span>}
              </div>
            </div>

            {/* STEP 3: COST PRICE & SELLING PRICE */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  3. Pricing & Profit Margin
                </label>
                {sellVal > 0 && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999,
                    backgroundColor: profitVal >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: profitVal >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {profitVal >= 0 ? `+${currency}${profitVal.toFixed(2)} profit (${marginPercent}%)` : `Loss: ${currency}${profitVal.toFixed(2)}`}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Cost Price */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Cost / Wholesale Purchase Price ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    placeholder="e.g. 2600"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>
                    What you paid to distributor / wholesaler
                  </span>
                </div>

                {/* Selling Price */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Selling Price ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 3400"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: `1px solid ${errors.price ? '#ef4444' : 'var(--border)'}`,
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                  {errors.price ? (
                    <span style={{ color: '#ef4444', fontSize: '0.73rem', marginTop: 2, display: 'block' }}>{errors.price}</span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>
                      Price billed to retail customer
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* STEP 4: QUANTITY & STOCK ALERT */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16
            }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>
                4. Quantity in Shop
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Physical Stock Count (Units present) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="1"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Low-Stock Alert Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="lowStockLevel"
                    value={formData.lowStockLevel}
                    onChange={handleChange}
                    placeholder="2"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* STEP 5: WARRANTY */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  5. Warranty Period
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Printed on invoice</span>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    min="0"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    placeholder="Months"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Months</span>
              </div>

              {/* Quick Warranty Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {[
                  { label: 'No Warranty', months: '0' },
                  { label: '1 Month', months: '1' },
                  { label: '6 Months', months: '6' },
                  { label: '1 Year (12 Mo)', months: '12' },
                  { label: '2 Years (24 Mo)', months: '24' },
                  { label: '3 Years (36 Mo)', months: '36' },
                  { label: '5 Years (60 Mo)', months: '60' }
                ].map(w => (
                  <button
                    key={w.months}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, warranty: w.months }))}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: formData.warranty === w.months ? 800 : 500,
                      backgroundColor: formData.warranty === w.months ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: formData.warranty === w.months ? 'var(--primary)' : 'var(--text-muted)',
                      border: `1px solid ${formData.warranty === w.months ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 6: ITEM NOTES / SERIAL INFO */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16
            }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>
                6. Item Notes & Serial Info
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Serial Number / SKU / Barcode
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Auto-generated if left blank (e.g. KNG-RAM-4921)"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Item Notes & Hardware Details
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Box sealed, serial numbers, heat spreader, includes charger, etc."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Form Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid var(--border)'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '11px 20px',
                borderRadius: 10,
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '11px 26px',
                borderRadius: 10,
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                cursor: 'pointer'
              }}
            >
              {editingItem ? 'Save Changes' : '+ Add Item to Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
