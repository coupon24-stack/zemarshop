// public/js/config.js

export const CONFIG = {
  MODE_DEMO: true,
  SITE_NAME: 'ZemarShop',
  SITE_TAGLINE: 'Tout ce que tu cherches, au même endroit.',
  CURRENCY: 'FCFA',
  PHONE_SUPPORT: '+225 00 00 00 00 00',
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  COMMISSION_RATE: 10,
};

export function isSupabaseReady() {
  return Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
}
