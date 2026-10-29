import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Receipt, 
  DollarSign, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle,
  AlertTriangle,
  Save
} from 'lucide-react';
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS } from '../data/constants';

export default function SettingsView({ 
  settings, 
  onSaveSettings, 
  onResetToSample, 
  products, 
  sales, 
  onImportDatabase 
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export full JSON backup
  const handleExportJSON = () => {
    const backupData = {
      version: 2,
      exportDate: new Date().toISOString(),
      shopSettings: formData,
      products,
      sales
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.products && Array.isArray(imported.products)) {
          if (confirm(`Import database with ${imported.products.length} products and ${(imported.sales || []).length} sales records?`)) {
            onImportDatabase(imported);
            alert('Database restored successfully!');
          }
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ paddingBottom: 40, maxWidth: 960, margin: '0 auto' }}>
      
      {saveSuccess && (
        <div className="animate-pop" style={{
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary-text)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 700
        }}>
          <CheckCircle size={20} />
          <span>Store settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Store Profile Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 24,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Store size={20} color="var(--primary)" />
            <span>Store Profile & Invoice Branding</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Phone / Contact Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Store Physical Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  GSTIN / Tax ID Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                Invoice Terms & Warranty Policy Notice
              </label>
              <textarea
                name="invoiceFooterNote"
                value={formData.invoiceFooterNote}
                onChange={handleChange}
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax Config */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 24,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <DollarSign size={20} color="var(--primary)" />
            <span>Currency & Billing Taxes</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                Currency Symbol
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="AED ">AED (Dirham)</option>
                <option value="C$">C$ (CAD)</option>
                <option value="A$">A$ (AUD)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Settings CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-emerald)'
            }}
          >
            <Save size={18} />
            <span>Save Store Settings</span>
          </button>
        </div>

      </form>

      {/* Database Backup & Maintenance Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        padding: 24,
        marginTop: 24,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Database size={20} color="var(--accent-blue)" />
          <span>Database Backup & Recovery</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          Export your entire inventory and invoices to a local backup file or restore previously saved data.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button
            type="button"
            onClick={handleExportJSON}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Download size={18} color="var(--primary)" />
            <span>Export Database (JSON)</span>
          </button>

          <label style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer'
          }}>
            <Upload size={18} color="var(--accent-blue)" />
            <span>Import Database (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset to default computer shop sample products? Current items will be overwritten.')) {
                onResetToSample();
              }
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-light)',
              border: '1px solid var(--danger-light)',
              color: 'var(--danger-text)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginLeft: 'auto'
            }}
          >
            <RotateCcw size={18} />
            <span>Reset Demo Inventory</span>
          </button>
        </div>
      </div>

    </div>
  );
}
