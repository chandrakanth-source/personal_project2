import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LoginModal from './components/LoginModal';
import HomeView from './components/HomeView';

const StockMaintenanceView = lazy(() => import('./components/StockMaintenanceView'));
const WebsiteView = lazy(() => import('./components/WebsiteView'));
const BillingView = lazy(() => import('./components/BillingView'));
const DailyReportsView = lazy(() => import('./components/DailyReportsView'));
const ProductsWeSellView = lazy(() => import('./components/ProductsWeSellView'));
const SettingsView = lazy(() => import('./components/SettingsView'));

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
import { INITIAL_PRODUCTS } from './data/constants';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import {
  ensureProfile,
  getSession,
  loadShopDatabase,
  saveProducts,
  saveSales,
  saveSettings,
  signIn,
  signOut
} from './lib/shopRepository';

const PROTECTED_TABS = ['stock', 'billing', 'reports', 'settings'];

export default function App() {
  // Navigation Tabs: 'home' | 'stock' | 'website' | 'billing' | 'reports' | 'catalog' | 'settings'
  const [currentTab, setCurrentTab] = useState('home');
  const [products, setProducts] = useState(() => getStoredProducts());
  const [sales, setSales] = useState(() => getStoredSales());
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [auth, setAuth] = useState(() =>
    isSupabaseConfigured ? { isLoggedIn: false, user: null } : getStoredAuth()
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(() => getStoredTheme());

  useEffect(() => {
    let active = true;

    const restoreSupabaseSession = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const session = await getSession();
        if (!active) return;

        if (session?.user) {
          const profile = await ensureProfile(session.user);
          setAuth({
            isLoggedIn: true,
            user: {
              id: session.user.id,
              name: profile?.name || 'Shop Admin',
              role: profile?.role || 'Admin',
              email: session.user.email
            }
          });

          const database = await loadShopDatabase();
          if (database && active) {
            if (database.products.length > 0) setProducts(database.products);
            if (database.sales) setSales(database.sales);
            if (database.shopSettings) setSettings(database.shopSettings);
          }
        }
      } catch (error) {
        console.error('Unable to restore Supabase session:', error);
      }
    };

    restoreSupabaseSession();

    const subscription = isSupabaseConfigured
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (!session?.user) {
            setAuth({ isLoggedIn: false, user: null });
          }
        })
      : null;

    return () => {
      active = false;
      subscription?.data?.subscription?.unsubscribe();
    };
  }, []);

  // Toast State
  const [toast, setToast] = useState(null);
  const handleNavigateTab = (tab) => {
    if (PROTECTED_TABS.includes(tab) && !auth.isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  // Apply Theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveStoredTheme(theme);
  }, [theme]);

  // Persist Products
  const handleSaveProducts = (newProducts) => {
    setProducts(newProducts);
    const localSaved = saveStoredProducts(newProducts);
    if (isSupabaseConfigured && auth.isLoggedIn) {
      saveProducts(newProducts).catch((error) => {
        console.error('Unable to save products to Supabase:', error);
        showToast('Saved locally, but cloud sync failed.', 'danger');
      });
    }
    if (!localSaved) showToast('Unable to save data in this browser.', 'danger');
  };

  // Persist Sales
  const handleSaveSales = (newSales) => {
    setSales(newSales);
    const localSaved = saveStoredSales(newSales);
    if (isSupabaseConfigured && auth.isLoggedIn) {
      saveSales(newSales).catch((error) => {
        console.error('Unable to save sales to Supabase:', error);
        showToast('Saved locally, but cloud sync failed.', 'danger');
      });
    }
    if (!localSaved) showToast('Unable to save data in this browser.', 'danger');
  };

  // Persist Settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    if (isSupabaseConfigured && auth.isLoggedIn) {
      saveSettings(newSettings).catch((error) => {
        console.error('Unable to save settings to Supabase:', error);
        showToast('Saved locally, but cloud sync failed.', 'danger');
      });
    }
    showToast('Shop settings updated successfully!');
  };

  // Login handler
  const handleLoginSuccess = async (credentialsOrUser, password) => {
    try {
      if (isSupabaseConfigured && typeof credentialsOrUser === 'string') {
        const user = await signIn(credentialsOrUser, password);
        const profile = await ensureProfile(user);
        const updatedAuth = {
          isLoggedIn: true,
          user: {
            id: user.id,
            name: profile?.name || 'Shop Admin',
            role: profile?.role || 'Admin',
            email: user.email
          }
        };
        setAuth(updatedAuth);
        saveStoredAuth(updatedAuth);

        const database = await loadShopDatabase();
        if (database) {
          if (database.products.length > 0) setProducts(database.products);
          if (database.sales) setSales(database.sales);
          if (database.shopSettings) setSettings(database.shopSettings);
        }
        showToast(`Logged in as ${updatedAuth.user.name}`);
        return true;
      }

      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    } catch (error) {
      throw error;
    }
  };

  // Logout handler
  const handleLogout = () => {
    const updatedAuth = {
      isLoggedIn: false,
      user: null
    };
    setAuth(updatedAuth);
    setCurrentTab('home');
    saveStoredAuth(updatedAuth);
    if (isSupabaseConfigured) {
      signOut().catch((error) => console.error('Unable to sign out from Supabase:', error));
    }
    showToast('Logged out successfully', 'info');
  };

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Handle Complete Sale from Billing
  const handleCompleteSale = (saleData) => {
    setSales(previousSales => {
      const updatedSales = [saleData, ...previousSales];
      handleSaveSales(updatedSales);
      return updatedSales;
    });

    setProducts(previousProducts => {
      if (!saleData.items || !Array.isArray(saleData.items)) return previousProducts;
      const updatedProducts = previousProducts.map(p => {
        const itemSold = saleData.items.find(i => i.id === p.id);
        if (!itemSold) return p;
        const nextQty = Math.max(0, (Number(p.quantity) || 0) - (Number(itemSold.quantity) || 1));
        return { ...p, quantity: nextQty, status: nextQty > 0 ? 'In Stock' : 'Out of Stock' };
      });
      handleSaveProducts(updatedProducts);
      return updatedProducts;
    });

    showToast(`Invoice #${saleData.invoiceNumber || 'NEW'} recorded successfully!`);
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell" style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
      color: 'var(--text-main)',
      fontFamily: 'var(--font-main)'
    }}>
      {/* 1. Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleNavigateTab}
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
          <Suspense fallback={<div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading...</div>}>
          {currentTab === 'home' && (
            <HomeView 
              onNavigateTab={handleNavigateTab}
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
              onResetToSample={() => {
                const resetProducts = INITIAL_PRODUCTS.map(product => ({ ...product }));
                handleSaveProducts(resetProducts);
                showToast('Inventory reset to the default sample products.');
              }}
              onImportDatabase={(imported) => {
                if (imported.products) handleSaveProducts(imported.products);
                if (imported.sales) handleSaveSales(imported.sales);
                if (imported.shopSettings) handleSaveSettings(imported.shopSettings);
              }}
            />
          )}
          </Suspense>
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
