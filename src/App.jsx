import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeView from './components/HomeView';
import StockMaintenanceView from './components/StockMaintenanceView';
import WebsiteView from './components/WebsiteView';
import BillingView from './components/BillingView';
import DailyReportsView from './components/DailyReportsView';
import ProductsWeSellView from './components/ProductsWeSellView';
import SettingsView from './components/SettingsView';
import LoginModal from './components/LoginModal';

import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredSales, 
  saveStoredSales, 
  getStoredSettings, 
  saveStoredSettings,
  getStoredTheme,
  saveStoredTheme,
  getStoredAuth,
  saveStoredAuth
} from './utils/storage';
import { DEFAULT_SETTINGS } from './data/constants';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  // Navigation Tabs: 'home' | 'stock' | 'website' | 'billing' | 'reports' | 'catalog' | 'settings'
  const [currentTab, setCurrentTab] = useState('home');
  const [products, setProducts] = useState(() => getStoredProducts());
  const [sales, setSales] = useState(() => getStoredSales());
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(() => getStoredTheme());

  // Toast State
  const [toast, setToast] = useState(null);

  // Apply Theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveStoredTheme(theme);
  }, [theme]);

  // Persist Products
  const handleSaveProducts = (newProducts) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  // Persist Sales
  const handleSaveSales = (newSales) => {
    setSales(newSales);
    saveStoredSales(newSales);
  };

  // Persist Settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    showToast('Shop settings updated successfully!');
  };

  // Login handler
  const handleLoginSuccess = (user) => {
    const updatedAuth = {
      isLoggedIn: true,
      user
    };
    setAuth(updatedAuth);
    saveStoredAuth(updatedAuth);
    showToast(`Logged in as ${user.name} (${user.role})`);
  };

  // Logout handler
  const handleLogout = () => {
    const updatedAuth = {
      isLoggedIn: false,
      user: null
    };
    setAuth(updatedAuth);
    saveStoredAuth(updatedAuth);
    showToast('Logged out successfully', 'info');
  };

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Handle Complete Sale from Billing
  const handleCompleteSale = (saleData) => {
    const updatedSales = [saleData, ...sales];
    handleSaveSales(updatedSales);

    // Deduct stock
    if (saleData.items && Array.isArray(saleData.items)) {
      const updatedProducts = products.map(p => {
        const itemSold = saleData.items.find(i => i.id === p.id);
        if (itemSold) {
          const nextQty = Math.max(0, (Number(p.quantity) || 0) - (Number(itemSold.quantity) || 1));
          return { ...p, quantity: nextQty, status: nextQty > 0 ? 'In Stock' : 'Out of Stock' };
        }
        return p;
      });
      handleSaveProducts(updatedProducts);
    }

    showToast(`Invoice #${saleData.invoiceNumber || 'NEW'} recorded successfully!`);
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
      color: 'var(--text-main)',
      fontFamily: 'var(--font-main)'
    }}>
      {/* 1. Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        auth={auth}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Canvas */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* TopBar */}
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          currentUser={auth.user}
          isLoggedIn={auth.isLoggedIn}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onNavigateTab={setCurrentTab}
        />

        {/* Tab Views */}
        <main style={{ padding: '28px 36px', flex: 1 }}>
          {currentTab === 'home' && (
            <HomeView 
              onNavigateTab={setCurrentTab}
              auth={auth}
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />
          )}

          {currentTab === 'stock' && (
            <StockMaintenanceView
              products={products}
              onSaveProducts={handleSaveProducts}
              showToast={showToast}
            />
          )}

          {currentTab === 'website' && (
            <WebsiteView
              settings={settings}
              products={products}
            />
          )}

          {currentTab === 'billing' && (
            <BillingView
              products={products}
              sales={sales}
              settings={settings}
              onCompleteSale={handleCompleteSale}
            />
          )}

          {currentTab === 'reports' && (
            <DailyReportsView
              sales={sales}
              products={products}
              settings={settings}
            />
          )}

          {currentTab === 'catalog' && (
            <ProductsWeSellView
              products={products}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              products={products}
              sales={sales}
              onImportDatabase={(imported) => {
                if (imported.products) handleSaveProducts(imported.products);
                if (imported.sales) handleSaveSales(imported.sales);
                if (imported.shopSettings) handleSaveSettings(imported.shopSettings);
              }}
            />
          )}
        </main>
      </div>

      {/* 3. Login Modal matching Image 3 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={auth.user}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 4. Toast Notification */}
      {toast && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            backgroundColor: toast.type === 'danger' ? '#ef4444' : (toast.type === 'info' ? '#1d68ed' : '#10b981'),
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.88rem',
            fontWeight: 600,
            zIndex: 999
          }}
        >
          {toast.type === 'danger' ? <AlertCircle size={18} /> : (toast.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />)}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
