import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import CheckoutForm from './components/CheckoutForm';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { useProducts } from './hooks/useProducts';
import { Settings, Loader2 } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();
  
  // Use Supabase hook with categories and items
  const { 
    products, 
    categories,
    items,
    loading, 
    error,
    fetchProducts,
    addProduct, 
    updateProduct, 
    deleteProduct,
    getItemsByCategory,
    apiService // Add apiService from hook
  } = useProducts();
  
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Determine if Arabic for font class
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const addToCart = (product) => {
    // Check if product has enough balance
    if (product.balance !== undefined && product.balance <= 0) {
      alert(t('outOfStockAlert'));
      return;
    }
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Check if adding more than available balance
        if (product.balance !== undefined && existing.quantity + 1 > product.balance) {
          alert(t('cannotAddMore', { count: product.balance }));
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    // Find the product to check balance
    const product = products.find(p => p.id === id);
    if (product && product.balance !== undefined && newQuantity > product.balance) {
      alert(t('availableQty', { count: product.balance }));
      return;
    }
    
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    setCheckoutStep('cart');
    setIsCartOpen(false);
  };

  // Open Admin Panel
  const openAdminPanel = async () => {
    setIsAdminOpen(true);
    // Refresh data when opening admin panel
    if (fetchProducts) {
      setIsAdminLoading(true);
      try {
        await fetchProducts();
      } catch (error) {
        console.error("Failed to refresh data for admin panel:", error);
      } finally {
        setIsAdminLoading(false);
      }
    }
  };

  // Filter products by category
  const filteredProducts = categoryFilter === 'All' 
    ? products 
    : products.filter(p => {
        if (categoryFilter === 'all') return true;
        const category = categories.find(c => c.name === categoryFilter || c.id === categoryFilter);
        if (category) {
          return p.category_id === category.id;
        }
        return p.category === categoryFilter;
      });

      // In App.jsx, update the error section:
if (error && products.length === 0) {
  return (
    <div className={`min-h-screen bg-luxury-dark flex items-center justify-center ${isArabic ? 'font-arabic' : ''}`}>
      <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10 max-w-md">
        <h2 className="text-2xl text-white mb-4">
          {t('notice')}
        </h2>
        <div className={`mb-6 p-4 rounded-lg ${isUsingFallback ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <p className={`text-sm ${isUsingFallback ? 'text-yellow-400' : 'text-red-400'}`}>
            {error}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {isUsingFallback 
              ? t('sampleDataNotice')
              : t('checkDatabase')
            }
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={retryConnection} 
            className="px-6 py-3 bg-luxury-gold text-luxury-dark rounded-lg font-bold hover:bg-white transition-colors"
          >
            {t('retryConnection')}
          </button>
          <button 
            onClick={openAdminPanel} 
            className="px-6 py-3 border border-luxury-gold text-luxury-gold rounded-lg hover:bg-luxury-gold/10 transition-colors"
          >
            {t('openAdminPanel')}
          </button>
          {isUsingFallback && (
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:text-white transition-colors"
            >
              {t('reloadPage')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
  // Show error if database connection failed
  if (error) {
    return (
      <div className={`min-h-screen bg-luxury-dark flex items-center justify-center ${isArabic ? 'font-arabic' : ''}`}>
        <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10 max-w-md">
          <h2 className="text-2xl text-white mb-4">Failed to load products</h2>
          <p className="text-gray-400 mb-6">{error.message || error}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 px-6 py-3 bg-luxury-gold text-luxury-dark rounded-lg font-bold hover:bg-white transition-colors"
            >
              {t('retry') || 'Retry'}
            </button>
            <button 
              onClick={() => setIsAdminOpen(true)} 
              className="flex-1 px-6 py-3 border border-luxury-gold text-luxury-gold rounded-lg hover:bg-luxury-gold/10 transition-colors"
            >
              {t('adminPanel') || 'Admin Panel'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-luxury-dark text-white selection:bg-luxury-gold selection:text-white ${isArabic ? 'font-arabic' : ''}`}>
      <Navbar
        cartCount={cartItems.reduce((a, c) => a + c.quantity, 0)}
        toggleCart={() => setIsCartOpen(true)}
        changeLang={changeLang}
        currentLang={i18n.language}
        onAdminClick={openAdminPanel}
      />

      <Hero />

      <main id="products" className="container mx-auto px-6 py-20">
        <CategoryHeader 
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          lang={i18n.language}
        />

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 text-luxury-gold animate-spin" />
            <span className="ml-3 text-gray-400">Loading products...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  lang={i18n.language}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl text-gray-400 mb-2">
                  {t('noProducts')}
                </h3>
                <p className="text-gray-500">
                  {categoryFilter !== 'All' 
                    ? t('tryAnother')
                    : t('useAdminToAdd')
                  }
                </p>
                {categoryFilter === 'All' && products.length === 0 && (
                  <button
                    onClick={openAdminPanel}
                    className="mt-4 px-6 py-2 bg-luxury-gold text-luxury-dark rounded-lg font-bold hover:bg-white transition-colors"
                  >
                    {t('openAdminPanel')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Floating Admin Button - More Visible */}
      <div className="fixed bottom-6 left-6 z-40">
        <button 
          onClick={openAdminPanel} 
          className="p-4 bg-luxury-gold text-luxury-dark rounded-full shadow-lg hover:bg-white hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all duration-300 flex items-center gap-2 group"
          title={t('openAdminPanel')}
          disabled={isAdminLoading}
        >
          {isAdminLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden group-hover:inline font-bold text-sm pr-2">
                {t('admin')}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Modals & Overlays */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        setCheckoutStep={setCheckoutStep}
        lang={i18n.language}
        products={products} // Pass products for balance checks
      />

      {checkoutStep === 'checkout' && (
        <CheckoutForm
          cartItems={cartItems}
          onClose={() => {
            setCheckoutStep('cart');
            setIsCartOpen(false);
          }}
          clearCart={clearCart}
          lang={i18n.language}
        />
      )}

      {isAdminOpen && (
        <AdminPage
          onClose={() => setIsAdminOpen(false)}
          apiService={apiService} // Pass apiService instead of individual functions
          lang={i18n.language}
        />
      )}
    </div>
  );

  function changeLang(langCode) {
    i18n.changeLanguage(langCode);
  }
}

// Category Filter Component
const CategoryHeader = ({ categoryFilter, setCategoryFilter, categories = [], lang }) => {
  const { t } = useTranslation();
  
  const categoryOptions = [
    { id: 'All', name: t('nav.explore') || 'All', name_ar: 'الكل', name_fr: 'Tout' },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      name_ar: cat.name_ar || cat.name,
      name_fr: cat.name_fr || cat.name,
    }))
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
          {t('nav.collection') || 'Our Collection'}
        </h2>
        <div className="w-24 h-1 bg-luxury-gold"></div>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4">
        {categoryOptions.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
              categoryFilter === cat.id 
                ? 'bg-luxury-gold text-luxury-dark' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {lang === 'ar' && cat.name_ar ? cat.name_ar : lang === 'fr' && cat.name_fr ? cat.name_fr : cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;