import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Tag, ShoppingBag, BarChart3, Settings,
  Users, CreditCard, Bell, Globe, Shield, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminProductCRUD from './AdminProductCRUD';
import AdminCategoryCRUD from './AdminCategoryCRUD';

const AdminPanel = ({
  isOpen,
  onClose,
  products,
  categories,
  items,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchCategories,
  fetchItems,
  getItemsByCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  lang,
  isAdmin
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'dashboard', label: t('admin.dashboard') || 'Dashboard', icon: BarChart3 },
    { id: 'products', label: t('admin.products') || 'Products', icon: Package },
    { id: 'categories', label: t('admin.categoriesLabel') || 'Categories', icon: Tag },
    { id: 'orders', label: t('admin.orders') || 'Orders', icon: ShoppingBag },
    { id: 'customers', label: t('admin.customers') || 'Customers', icon: Users },
    { id: 'payments', label: t('admin.payments') || 'Payments', icon: CreditCard },
    { id: 'notifications', label: t('admin.notifications') || 'Notifications', icon: Bell },
    { id: 'languages', label: t('admin.languages') || 'Languages', icon: Globe },
    { id: 'security', label: t('admin.security') || 'Security', icon: Shield },
    { id: 'settings', label: t('admin.settings') || 'Settings', icon: Settings }
  ];

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <AdminProductCRUD
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
            lang={lang}
            isAdmin={isAdmin}
            onClose={onClose}
          />
        );

      case 'categories':
        return (
          <AdminCategoryCRUD
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            fetchCategories={fetchCategories}
            lang={lang}
          />
        );

      case 'dashboard':
        return (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { title: t('admin.totalProducts'), value: products?.length || 0, color: 'from-[#c9a227]/20 to-[#c9a227]/5' },
                { title: t('admin.categories'), value: categories?.length || 0, color: 'from-[#2563eb]/20 to-[#2563eb]/5' },
                { title: t('admin.totalOrders'), value: '0', color: 'from-[#059669]/20 to-[#059669]/5' },
                { title: t('admin.revenue'), value: '$0', color: 'from-[#dc2626]/20 to-[#dc2626]/5' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br p-6 rounded-xl border border-white/[0.05]"
                  style={{ background: `linear-gradient(135deg, ${stat.color.includes('c9a227') ? 'rgba(201,162,39,0.15)' : stat.color.includes('2563eb') ? 'rgba(37,99,235,0.15)' : stat.color.includes('059669') ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)'} 0%, transparent 100%)` }}
                >
                  <p className="text-white/50 text-sm mb-2">{stat.title}</p>
                  <p className="text-3xl font-serif text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
            <h2 className="text-xl font-serif text-white mb-4">{t('admin.welcomeAdmin')}</h2>
            <p className="text-white/40">{t('admin.manageStore')}</p>
          </div>
        );

      default:
        return (
          <div className="p-8">
            <h2 className="text-xl font-serif text-white mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label || 'Admin Panel'}
            </h2>
            <p className="text-white/40">
              {t('admin.comingSoon', { tab: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) })}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#0a0e14]">
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#0d1117] to-[#0a0e14] border-r border-white/[0.05] h-full overflow-y-auto">
        {/* Logo/Header */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c9a227]/20 to-transparent border border-[#c9a227]/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#c9a227]" />
            </div>
            <div>
              <h2 className="text-lg font-serif text-white leading-none">Admin</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">{t('admin.controlCenter')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c9a227]/15 to-transparent text-[#c9a227] border border-[#c9a227]/30'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#c9a227]' : ''}`} />
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-[#c9a227] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0d1117]/80 border-b border-white/[0.05] px-8 py-5 flex justify-between items-center backdrop-blur-sm shrink-0">
          <div>
            <h1 className="text-xl font-serif text-white">
              {tabs.find(tab => tab.id === activeTab)?.label || 'Admin Panel'}
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              {activeTab === 'products'
                ? t('admin.manageInventory')
                : t('admin.configureSettings', { tab: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <span>{t('admin.close')}</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-[#0a0e14]/50">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;