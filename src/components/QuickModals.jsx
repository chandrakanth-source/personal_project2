import React, { useState } from 'react';
import { X, UserPlus, Truck, Barcode, Check } from 'lucide-react';

export function AddCustomerModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gstin: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="dash-card fade-in" style={{ width: 440, maxWidth: '100%', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#ede9fe',
              color: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Add New Customer</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Customer Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="customer@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Address / City
            </label>
            <input
              type="text"
              placeholder="Main Road, Shop #12"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                fontWeight: 700
              }}
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreatePurchaseModal({ isOpen, onClose, products = [], onPurchase }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(5);
  const [supplier, setSupplier] = useState('Tech Distributors Hyderabad');
  const [notes, setNotes] = useState('Restock batch');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    onPurchase({
      productId: selectedProductId,
      quantity: Number(quantity) || 1,
      supplier,
      notes
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="dash-card fade-in" style={{ width: 440, maxWidth: '100%', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#ffedd5',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Create Purchase Order</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Select Item to Restock *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)'
              }}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current Qty: {p.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Quantity to Add *
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Supplier Name
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                backgroundColor: '#f97316',
                color: '#ffffff',
                fontWeight: 700
              }}
            >
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
