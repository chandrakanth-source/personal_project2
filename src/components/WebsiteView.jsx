import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  Smartphone, 
  Monitor, 
  Share2, 
  Palette, 
  Download,
  Sparkles,
  QrCode
} from 'lucide-react';

export default function WebsiteView({ settings, products }) {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);

  const [siteConfig, setSiteConfig] = useState({
    title: 'Sri Thanu Communications',
    tagline: 'Your one-stop shop for computers, accessories and IT solutions',
    headline: 'Upgrade Your Digital World Today',
    subtext: 'Brand new laptops, custom PC builds, genuine computer accessories and doorstep IT support.',
    phone: '+91 98765 43210',
    whatsapp: '+919876543210',
    address: 'Shop No. 12, Tech Commercial Plaza, Main Road',
    timings: 'Mon - Sat: 9:30 AM to 9:00 PM',
    themeColor: '#1d68ed'
  });

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://srithanu.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  };

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
            backgroundColor: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)'
          }}>
            <Globe size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#1e3a8a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Create & Manage Your Website
            </h1>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748b',
              marginTop: 4
            }}>
              Launch and customize the official online catalog & storefront for Sri Thanu Communications.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--text-main)'
            }}
          >
            {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
            <span>{copied ? 'Link Copied!' : 'Copy Website URL'}</span>
          </button>

          <button
            onClick={handlePublish}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#1d68ed',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(29, 104, 237, 0.3)'
            }}
          >
            <Sparkles size={16} />
            <span>{published ? 'Published Live! ✓' : 'Publish Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Customizer on Left, Live Preview on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: 24,
        alignItems: 'start'
      }}>
        {/* Left: Customization Panel */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e3a8a' }}>
            Storefront Settings
          </h2>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Website Title
            </label>
            <input
              type="text"
              value={siteConfig.title}
              onChange={(e) => setSiteConfig({ ...siteConfig, title: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.88rem',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Hero Headline
            </label>
            <input
              type="text"
              value={siteConfig.headline}
              onChange={(e) => setSiteConfig({ ...siteConfig, headline: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.88rem',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Hero Subtext
            </label>
            <textarea
              rows={3}
              value={siteConfig.subtext}
              onChange={(e) => setSiteConfig({ ...siteConfig, subtext: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.88rem',
                color: 'var(--text-main)',
                resize: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Contact Phone / WhatsApp
            </label>
            <input
              type="text"
              value={siteConfig.phone}
              onChange={(e) => setSiteConfig({ ...siteConfig, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.88rem',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Store Timings
            </label>
            <input
              type="text"
              value={siteConfig.timings}
              onChange={(e) => setSiteConfig({ ...siteConfig, timings: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.88rem',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div style={{
            padding: '14px',
            backgroundColor: '#eff6ff',
            borderRadius: 10,
            border: '1px solid #bfdbfe',
            fontSize: '0.82rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <QrCode size={24} />
            <div>
              <strong>QR Code Standee Ready:</strong> Customers can scan in shop to view live available stock on their phones.
            </div>
          </div>
        </div>

        {/* Right: Interactive Live Preview Container */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Browser Bar Mockup */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid var(--border-color)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Window control dots */}
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>

            {/* Address bar */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 20,
              padding: '4px 18px',
              fontSize: '0.8rem',
              color: '#475569',
              width: '50%',
              textAlign: 'center',
              fontWeight: 500
            }}>
              🔒 https://srithanu.in
            </div>

            {/* Viewport switch */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setDeviceMode('desktop')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  backgroundColor: deviceMode === 'desktop' ? '#e2e8f0' : 'transparent',
                  color: deviceMode === 'desktop' ? '#0f172a' : '#94a3b8'
                }}
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  backgroundColor: deviceMode === 'mobile' ? '#e2e8f0' : 'transparent',
                  color: deviceMode === 'mobile' ? '#0f172a' : '#94a3b8'
                }}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          {/* Website Canvas */}
          <div style={{
            padding: deviceMode === 'mobile' ? '30px 20px' : '36px 40px',
            maxWidth: deviceMode === 'mobile' ? 420 : '100%',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            transition: 'all 0.25s ease'
          }}>
            {/* Mini Nav */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 20,
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  backgroundColor: '#0c234b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <Globe size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0c234b', lineHeight: 1.1 }}>{siteConfig.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>Communications</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                <span>Products</span>
                <span>Services</span>
                <span>Location</span>
              </div>
            </div>

            {/* Live Hero */}
            <div style={{
              padding: '40px 0 30px',
              display: 'flex',
              flexDirection: deviceMode === 'mobile' ? 'column' : 'row',
              alignItems: 'center',
              gap: 24
            }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  OFFICIAL STORE
                </span>
                <h1 style={{ fontSize: deviceMode === 'mobile' ? '1.5rem' : '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '8px 0 12px' }}>
                  {siteConfig.headline}
                </h1>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: 18 }}>
                  {siteConfig.subtext}
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{
                    backgroundColor: '#1d68ed',
                    color: '#ffffff',
                    padding: '9px 18px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}>
                    Browse Stock ({products.length} Items)
                  </button>
                  <button style={{
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    padding: '9px 18px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}>
                    Call Now
                  </button>
                </div>
              </div>

              <div style={{ width: deviceMode === 'mobile' ? '100%' : 260, borderRadius: 12, overflow: 'hidden' }}>
                <img
                  src="/images/hero_devices.jpg"
                  alt="Showcase"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Live Product Highlights */}
            <div style={{ marginTop: 24, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
                Featured In-Store Hardware
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: deviceMode === 'mobile' ? '1fr' : 'repeat(3, 1fr)', gap: 14 }}>
                {products.slice(0, 3).map(p => (
                  <div key={p.id} style={{
                    padding: 14,
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    backgroundColor: '#f8fafc'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{p.brand} • {p.configuration}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1d68ed', marginTop: 8 }}>
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
