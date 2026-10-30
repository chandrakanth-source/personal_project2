import { INITIAL_PRODUCTS, DEFAULT_SETTINGS } from '../data/constants';

const KEYS = {
  PRODUCTS: 'srithanu_products_v1',
  SALES: 'srithanu_sales_v1',
  SETTINGS: 'srithanu_settings_v1',
  THEME: 'srithanu_theme_v1',
  AUTH: 'srithanu_auth_v1'
};

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading products from localStorage:', e);
  }
  // Initialize with the 5 default products from screenshot
  saveStoredProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products) {
  try {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  } catch (e) {
    console.error('Error saving products:', e);
    return false;
  }
}

export function getStoredSales() {
  try {
    const raw = localStorage.getItem(KEYS.SALES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading sales from localStorage:', e);
  }
  return [];
}

export function saveStoredSales(sales) {
  try {
    localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
    return true;
  } catch (e) {
    console.error('Error saving sales:', e);
    return false;
  }
}

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error reading settings:', e);
  }
  saveStoredSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving settings:', e);
    return false;
  }
}

export function getStoredTheme() {
  try {
    return localStorage.getItem(KEYS.THEME) || 'light';
  } catch (e) {
    return 'light';
  }
}

export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(KEYS.THEME, theme);
  } catch (e) {
    console.error('Error saving theme:', e);
  }
}

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(KEYS.AUTH);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading auth:', e);
  }
  return {
    isLoggedIn: false,
    user: null
  };
}

export function saveStoredAuth(auth) {
  try {
    localStorage.setItem(KEYS.AUTH, JSON.stringify(auth));
  } catch (e) {
    console.error('Error saving auth:', e);
  }
}
