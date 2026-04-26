import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const appEnv = import.meta.env.VITE_APP_ENV || 'development';
const appName = import.meta.env.VITE_APP_NAME || 'App';

// Validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `❌ ${appName}: Missing Supabase environment variables!\n` +
    'Please check your .env file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Configuration
export const config = {
  appName,
  environment: appEnv,
  isProduction: appEnv === 'production',
  isDevelopment: appEnv === 'development',
  supabaseUrl,
};

// Development logging
if (config.isDevelopment) {
  const dbType = supabaseUrl.includes('test') || supabaseUrl.includes('dev')
    ? 'TEST ✅'
    : 'PRODUCTION ⚠️';

  console.log(`🏢 ${appName}`);
  console.log(`🔧 Environment: ${appEnv}`);
  console.log(`🗄️ Database: ${dbType}`);
  console.log(`🔗 URL: ${supabaseUrl}`);
}

// Export helper to show warning in production
export function showProductionWarning() {
  if (config.isProduction) {
    console.warn(`⚠️ ${appName} is running in PRODUCTION mode!`);
  }
}