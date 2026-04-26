import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from './AdminPanel';
import { motion } from 'framer-motion';
import { LogOut, AlertCircle, Shield, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../hooks/useProducts';

const AdminPage = ({ onClose, lang }) => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(true);

  const {
    products, categories, items,
    loading: isLoading,
    fetchProducts, addProduct, updateProduct, deleteProduct,
    fetchCategories, addCategory, updateCategory, deleteCategory,
    fetchItems, getItemsByCategory
  } = useProducts();

  useEffect(() => {
    if (isAdminPanelOpen && isAuthenticated && isAdmin) {
      const loadData = async () => {
        await fetchProducts();
        await fetchCategories();
        await fetchItems();
      };
      loadData();
    }
  }, [isAdminPanelOpen, isAuthenticated, isAdmin]);

  const handleLoginSuccess = () => setIsAdminPanelOpen(true);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setIsAdminPanelOpen(false);
      onClose?.();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onClose={onClose} />;
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0e14]/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-serif text-white mb-3">Access Denied</h2>
          <p className="text-white/40 mb-6">Your account does not have administrator privileges.</p>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white/70 hover:text-white rounded-xl transition-all duration-300 text-sm font-medium"
          >
            Return to Shop
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => { setIsAdminPanelOpen(false); onClose?.(); }}
        products={products}
        categories={categories}
        items={items}
        addProduct={addProduct}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        fetchProducts={fetchProducts}
        fetchCategories={fetchCategories}
        fetchItems={fetchItems}
        getItemsByCategory={getItemsByCategory}
        addCategory={addCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        lang={lang || i18n.language}
        isAdmin={isAdmin}
      />

      {!isAdminPanelOpen && (
        <div className="fixed top-6 right-6 z-[105]">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-4 flex items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#c9a227]" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Admin</p>
                <p className="text-sm text-white/70 truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="px-3 py-1.5 bg-[#c9a227]/10 hover:bg-[#c9a227]/20 border border-[#c9a227]/20 text-[#c9a227] text-xs font-semibold rounded-lg transition-all duration-200"
              >
                Open Panel
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminPage;