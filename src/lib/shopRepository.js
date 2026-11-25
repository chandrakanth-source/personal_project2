import { supabase, isSupabaseConfigured } from './supabase';

const toRows = (items) => items.map((item) => ({
  id: String(item.id),
  data: item,
  updated_at: new Date().toISOString()
}));

export async function getSession() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signIn(email, password) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function ensureProfile(user) {
  if (!isSupabaseConfigured) return null;
  const profile = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || 'Shop Admin',
    role: 'Admin'
  };
  const { error } = await supabase.from('profiles').upsert(profile);
  if (error) throw error;
  return profile;
}

export async function loadShopDatabase() {
  if (!isSupabaseConfigured) return null;
  const [productsResult, salesResult, settingsResult] = await Promise.all([
    supabase.from('shop_products').select('data').order('updated_at', { ascending: false }),
    supabase.from('shop_sales').select('data').order('updated_at', { ascending: false }),
    supabase.from('shop_settings').select('data').eq('id', 'main').maybeSingle()
  ]);

  if (productsResult.error) throw productsResult.error;
  if (salesResult.error) throw salesResult.error;
  if (settingsResult.error) throw settingsResult.error;

  return {
    products: productsResult.data.map((row) => row.data),
    sales: salesResult.data.map((row) => row.data),
    shopSettings: settingsResult.data?.data || null
  };
}

export async function saveProducts(products) {
  if (!isSupabaseConfigured) return false;
  if (!Array.isArray(products)) throw new Error('Products must be an array.');

  const keepIds = products.map((item) => String(item.id));
  const existing = await supabase.from('shop_products').select('id');
  if (existing.error) throw existing.error;
  const staleIds = existing.data
    .map((row) => row.id)
    .filter((id) => !keepIds.includes(id));

  if (staleIds.length > 0) {
    const deleted = await supabase.from('shop_products').delete().in('id', staleIds);
    if (deleted.error) throw deleted.error;
  }

  if (toRows(products).length > 0) {
    const saved = await supabase.from('shop_products').upsert(toRows(products), { onConflict: 'id' });
    if (saved.error) throw saved.error;
  }
  return true;
}

export async function saveSales(sales) {
  if (!isSupabaseConfigured) return false;
  if (!Array.isArray(sales)) throw new Error('Sales must be an array.');

  const keepIds = sales.map((item) => String(item.id));
  const existing = await supabase.from('shop_sales').select('id');
  if (existing.error) throw existing.error;
  const staleIds = existing.data
    .map((row) => row.id)
    .filter((id) => !keepIds.includes(id));

  if (staleIds.length > 0) {
    const deleted = await supabase.from('shop_sales').delete().in('id', staleIds);
    if (deleted.error) throw deleted.error;
  }

  if (toRows(sales).length > 0) {
    const saved = await supabase.from('shop_sales').upsert(toRows(sales), { onConflict: 'id' });
    if (saved.error) throw saved.error;
  }
  return true;
}

export async function saveSettings(settings) {
  if (!isSupabaseConfigured) return false;
  const saved = await supabase.from('shop_settings').upsert({
    id: 'main',
    data: settings,
    updated_at: new Date().toISOString()
  });
  if (saved.error) throw saved.error;
  return true;
}
