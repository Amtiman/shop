# Setup Guide - Luxury Shop App

## ✅ I18n Implementation with Subdirectories

Your app now uses **i18next** with organized locale files in subdirectories for multilingual support.

### Current Structure
```
src/
├── components/
│   └── i18n/
│       ├── i18n.ts                 # Main i18n configuration
│       ├── translations.ts          # Translation imports
│       └── locales/                 # Organized locale files
│           ├── en.json
│           ├── ar.json
│           └── fr.json
```

### Features Enabled
- ✅ Language detection (auto-detects browser language)
- ✅ Local storage persistence (saves user's language preference)
- ✅ RTL support (automatic for Arabic)
- ✅ Nested key access with dot notation (`t('nav.home')`)
- ✅ Dynamic language switching with `i18n.changeLanguage()`

### Usage in Components
All components now use the `useTranslation()` hook:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <button onClick={() => i18n.changeLanguage('ar')}>
        العربية
      </button>
    </div>
  );
}
```

---

## ✅ Supabase Integration

Your app is now fully connected to Supabase for real-time database operations.

### Configuration

1. **Create a `.env.local` file** in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Get your credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or use existing one
   - Navigate to **Project Settings > API**
   - Copy `Project URL` and `Anon Key`

### Available Supabase Tables

Your app expects these tables in Supabase:

#### `products` table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `orders` table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  payment_method TEXT,
  items JSONB,
  total DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP
);
```

### API Service Methods

All CRUD operations use Supabase:

```typescript
import { apiService } from './services/api';

// Products
const products = await apiService.getProducts();
const product = await apiService.getProductById(id);
const newProduct = await apiService.addProduct({ name: 'Item', price: 100 });
const updated = await apiService.updateProduct({ id: 1, name: 'Updated' });
await apiService.deleteProduct(id);

// Orders
const orders = await apiService.getOrders();
const order = await apiService.submitOrder({
  fullName: 'John',
  phone: '+1234567890',
  address: 'Address',
  paymentMethod: 'card',
  items: [...],
  total: 500,
  date: new Date().toISOString()
});
```

### File Structure

- `src/lib/supabaseClient.ts` - Supabase client initialization
- `services/api.ts` - API service with CRUD operations
- `.env.example` - Template for environment variables

---

## 🚀 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` with Supabase credentials**

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📝 Project Dependencies Added

- **i18next** (v24.0.0) - i18n framework
- **react-i18next** (v14.0.0) - React integration
- **i18next-browser-languagedetector** (v8.0.0) - Auto language detection
- **@supabase/supabase-js** (v2.45.0) - Supabase client

---

## 🔗 Useful Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Library](https://github.com/supabase/supabase-js)

---

## ✨ Features Summary

| Feature | Status |
|---------|--------|
| Multi-language (EN, FR, AR) | ✅ Complete |
| Automatic RTL for Arabic | ✅ Complete |
| Language detection | ✅ Complete |
| Language persistence | ✅ Complete |
| Supabase connection | ✅ Complete |
| Product CRUD | ✅ Complete |
| Order submission | ✅ Complete |
| Error handling | ✅ Complete |

---

**Last Updated:** January 21, 2026
