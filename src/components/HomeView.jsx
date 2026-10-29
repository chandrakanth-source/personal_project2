import React from 'react';
import { 
  Tv, 
  Cpu, 
  Wrench, 
  ShieldCheck, 
  Award, 
  Headphones, 
  Handshake, 
  ArrowRight,
  Laptop
} from 'lucide-react';

export default function HomeView({ onNavigateTab }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      maxWidth: 1240,
      margin: '0 auto',
      width: '100%',
      paddingBottom: 40
    }}>
      {/* 1. Hero Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '36px 42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Left Welcome Copy */}
        <div style={{ flex: 1, maxWidth: 540, zIndex: 2 }}>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            WELCOME TO
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#1e3a8a',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: 16
          }}>
            Sri Thanu Communications
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: 26
          }}>
            Your one-stop shop for computers, accessories and IT solutions.
            We provide quality products, trusted service and complete
            support for all your computing needs.
          </p>

          <button
            onClick={() => onNavigateTab('stock')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#1d4ed8',
              color: '#ffffff',
              padding: '13px 26px',
              borderRadius: 30,
              fontSize: '0.95rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e40af';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Explore Our Products</span>
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Right Hero Hardware Showcase Image */}
        <div style={{
          flex: 1,
          maxWidth: 520,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/images/hero_devices.jpg"
            alt="Sri Thanu Communications Hardware Setup"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 280,
              objectFit: 'contain',
              borderRadius: 12
            }}
          />
        </div>
      </div>

      {/* 2. Three Feature Category Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20
      }}>
        {/* Card 1: Computers & Laptops */}
        <div 
          onClick={() => onNavigateTab('stock')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#93c5fd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284c7'
          }}>
            <Tv size={24} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: 6
            }}>
              Computers & Laptops
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              Latest laptops, desktops and accessories from top brands.
            </p>
          </div>
        </div>

        {/* Card 2: Computer Accessories */}
        <div 
          onClick={() => onNavigateTab('stock')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#d8b4fe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9333ea'
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: 6
            }}>
              Computer Accessories
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              Keyboards, mice, monitors, SSDs, RAM, UPS and more.
            </p>
          </div>
        </div>

        {/* Card 3: IT Solutions */}
        <div 
          onClick={() => onNavigateTab('stock')}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#86efac';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <Wrench size={24} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: 6
            }}>
              IT Solutions
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              Build your setup, upgrade your system and get expert support.
            </p>
          </div>
        </div>
      </div>

      {/* 3. "About Our Shop" Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '32px 36px',
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Left Shop Front Image */}
        <div style={{
          width: 290,
          minWidth: 290,
          height: 200,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <img
            src="/images/shop_front.jpg"
            alt="Sri Thanu Communications Showroom"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Right About Copy */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#1e3a8a',
            letterSpacing: '-0.02em',
            marginBottom: 12
          }}>
            About Our Shop
          </h2>
          <p style={{
            fontSize: '0.92rem',
            color: '#475569',
            lineHeight: 1.65,
            marginBottom: 24
          }}>
            Sri Thanu Communications is a trusted computer shop offering a wide range of computers,
            laptops, accessories and IT solutions. We are committed to providing genuine products,
            competitive prices and excellent customer service. Whether you are a student, professional
            or business owner, we have the right solution for you.
          </p>

          {/* 4 Feature Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <ShieldCheck size={20} color="#1d68ed" />
              <span>Genuine Products</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <Award size={20} color="#1d68ed" />
              <span>Best Prices</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <Headphones size={20} color="#1d68ed" />
              <span>Expert Support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <Handshake size={20} color="#1d68ed" />
              <span>Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Motto Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '16px 24px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 14,
        border: '1px solid var(--border-color)',
        color: '#1d4ed8',
        fontSize: '0.92rem',
        fontWeight: 600,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Laptop size={18} />
        <span>Your Technology Partner – Today and Always</span>
        <div style={{ width: 80, height: 1, backgroundColor: '#bfdbfe', marginLeft: 8 }} />
      </div>
    </div>
  );
}
