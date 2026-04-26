// AdminProductCRUD.jsx - Administrator Item Menu with Product CRUD
// Works with: product_categories, items, products tables
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, X, Save, Trash2, Edit3, Plus, Search,
    Image as ImageIcon, ChevronDown, Package, Tag,
    DollarSign, Percent, Archive, Filter, Grid, List,
    AlertCircle, CheckCircle, Loader2, RefreshCw,
    Menu, ShoppingBag, BarChart3, LogOut
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ═══════════════════════════════════════════════════════════════════
// CUSTOM DROPDOWN COMPONENT
// ═══════════════════════════════════════════════════════════════════

// AdminProductCRUD.jsx - FIXED VERSION
// Find the CustomDropdown component and replace it with this:

const CustomDropdown = ({
    label,
    value,
    options,
    onChange,
    placeholder = 'Select...',
    icon: Icon,
    disabled = false,
    lang = 'en'
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === value);
    const displayText = selectedOption
        ? (lang === 'ar' && selectedOption.name_ar ? selectedOption.name_ar : selectedOption.name)
        : placeholder;

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-left flex items-center justify-between gap-3 transition-all duration-200 ${isOpen
                    ? 'border-luxury-gold ring-2 ring-luxury-gold/20'
                    : 'border-gray-700 hover:border-gray-500'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span className={selectedOption ? 'text-white' : 'text-gray-500'}>
                        {displayText}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-[#1a2030] border border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-gray-500 text-sm">No options available</div>
                        ) : (
                            options.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${value === option.id
                                        ? 'bg-luxury-gold/20 text-luxury-gold'
                                        : 'text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    <span>{lang === 'ar' && option.name_ar ? option.name_ar : option.name}</span>
                                    {value === option.id && (
                                        <CheckCircle className="w-4 h-4 ml-auto" />
                                    )}
                                </button>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
// ═══════════════════════════════════════════════════════════════════
// TOAST NOTIFICATION COMPONENT
// ═══════════════════════════════════════════════════════════════════

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50';
    const textColor = type === 'success' ? 'text-green-400' : 'text-red-400';
    const ToastIcon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-6 right-6 z-[200] ${bgColor} border backdrop-blur-xl rounded-lg px-5 py-4 shadow-2xl flex items-center gap-3 max-w-sm`}
        >
            <ToastIcon className={`w-5 h-5 ${textColor} shrink-0`} />
            <p className={`${textColor} text-sm`}>{message}</p>
            <button onClick={onClose} className="text-gray-500 hover:text-white ml-2">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR MENU COMPONENT
// ═══════════════════════════════════════════════════════════════════

const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setIsCollapsed, onClose }) => {
    const menuItems = [
        { id: 'products', label: 'Products', icon: Package },
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-[#0d1117] border-r border-white/5 h-full flex flex-col shrink-0"
        >
            {/* Logo */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-luxury-gold rounded-lg flex items-center justify-center">
                                <Settings className="w-4 h-4 text-luxury-dark" />
                            </div>
                            <span className="text-white font-serif tracking-wider">Admin</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-luxury-gold' : ''}`} />
                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    );
                })}
            </nav>

            {/* Close / Exit */}
            <div className="p-3 border-t border-white/5">
                <button
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm">Exit Admin</span>}
                </button>
            </div>
        </motion.aside>
    );
};

// ═══════════════════════════════════════════════════════════════════
// PRODUCT FORM COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ProductForm = ({
    formData,
    setFormData,
    onSave,
    onCancel,
    isNew,
    isSaving,
    categories = [],
    items = [],
    getItemsByCategory,
    lang = 'en'
}) => {
    const { t } = useTranslation();
    const [imageError, setImageError] = useState(false);

    // Get items filtered by selected category
    const filteredItems = formData.category_id
        ? (getItemsByCategory ? getItemsByCategory(formData.category_id) : items.filter(item => item.category_id === formData.category_id))
        : [];

    // Reset item when category changes
    const handleCategoryChange = (categoryId) => {
        setFormData({
            ...formData,
            category_id: categoryId,
            item_id: '' // Reset item
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-[#1a2030] to-[#151a25] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
            {/* Form Header */}
            <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-serif text-white flex items-center gap-3">
                    {isNew ? (
                        <>
                            <Plus className="w-5 h-5 text-luxury-gold" />
                            {t('admin.newProduct')}
                        </>
                    ) : (
                        <>
                            <Edit3 className="w-5 h-5 text-luxury-gold" />
                            {t('admin.edit')}
                        </>
                    )}
                </h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Form Body */}
            <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-5">
                        {/* Category Dropdown */}
                        <CustomDropdown
                            label={t('admin.category')}
                            value={formData.category_id}
                            options={categories}
                            onChange={handleCategoryChange}
                            placeholder={t('admin.selectCategory')}
                            icon={Tag}
                            lang={lang}
                        />

                        {/* Item Dropdown (or create new) */}
                        {filteredItems.length > 0 ? (
                            <CustomDropdown
                                label={t('admin.selectItem')}
                                value={formData.item_id}
                                options={filteredItems}
                                onChange={(value) => {
                                    const selectedItem = filteredItems.find(i => i.id === value);
                                    setFormData({
                                        ...formData,
                                        item_id: value,
                                        name: selectedItem?.name || '',
                                        name_ar: selectedItem?.name_ar || ''
                                    });
                                }}
                                placeholder="Select or create new..."
                                icon={Package}
                                disabled={!formData.category_id}
                                lang={lang}
                            />
                        ) : null}

                        {/* Product Name (English) */}
                        <div>
                            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider">
                                {t('admin.productNameEn')} {!formData.item_id && <span className="text-luxury-gold">*{t('admin.newItemTag')}</span>}
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                                placeholder="e.g., Elegant Evening Dress"
                                disabled={!!formData.item_id}
                            />
                            {formData.item_id && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {t('admin.inheritedNameNote')}
                                </p>
                            )}
                        </div>

                        {/* Product Name (Arabic) */}
                        <div>
                            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider">
                                {t('admin.productNameAr')}
                            </label>
                            <input
                                type="text"
                                value={formData.name_ar || ''}
                                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all text-right"
                                placeholder="فستان سهرة أنيق"
                                dir="rtl"
                                disabled={!!formData.item_id}
                            />
                        </div>

                        {/* Price & Discount Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign className="w-3 h-3" /> {t('admin.price')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-black/30 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <Percent className="w-3 h-3" /> {t('admin.discount')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discount || ''}
                                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-black/30 border border-gray-700 rounded-lg pl-4 pr-8 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider flex items-center gap-2">
                                <Archive className="w-3 h-3" /> {t('admin.stockQuantity')}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.quantity || ''}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                                placeholder="0"
                            />
                        </div>

                        {/* Initial Balance */}
                        <div>
                            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider flex items-center gap-2">
                                <Archive className="w-3 h-3" /> {t('admin.initialBalance')}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.balance || ''}
                                onChange={(e) => setFormData({ ...formData, balance: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                                placeholder="0"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t('admin.balanceNote')}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="space-y-5">
                        {/* Image Upload */}
                        <div>
                            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> {t('admin.productImage')}
                            </label>

                            {/* Image Preview / Upload Zone */}
                            <div
                                className="relative w-full aspect-[4/5] bg-black/30 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-luxury-gold/50 hover:bg-black/40 transition-all group"
                                onClick={() => document.getElementById('image-upload').click()}
                            >
                                {formData.image && !imageError ? (
                                    <>
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="text-center">
                                                <ImageIcon className="w-8 h-8 text-white mx-auto mb-2" />
                                                <p className="text-white text-sm font-medium">Click to change image</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/20 transition-colors">
                                            <ImageIcon className="w-8 h-8 text-luxury-gold" />
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium mb-1">
                                            {t('admin.clickToUpload')}
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            {imageError ? t('admin.uploadError') : t('admin.supportedFormats')}
                                        </p>
                                    </div>
                                )}

                                {/* Hidden file input */}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            // Convert to base64 for preview
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, image: reader.result });
                                                setImageError(false);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Or use URL */}
                        <div>
                            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wider">
                                Or paste image URL
                            </label>
                            <input
                                type="url"
                                value={formData.image?.startsWith('data:') ? '' : (formData.image || '')}
                                onChange={(e) => {
                                    setFormData({ ...formData, image: e.target.value });
                                    setImageError(false);
                                }}
                                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

{/* Price Preview */}
                        <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
                            <p className="text-xs text-gray-400 mb-2">{t('admin.pricePreview')}</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-serif text-luxury-gold">
                                        ${(formData.discount > 0
                                            ? formData.price * (1 - formData.discount / 100)
                                            : formData.price
                                        ).toFixed(2)}
                                    </span>
                                    {formData.discount > 0 && (
                                        <>
                                            <span className="text-sm text-gray-500 line-through">
                                                ${formData.price.toFixed(2)}
                                            </span>
                                            <span className="text-xs bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded">
                                                -{formData.discount}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || !formData.name || !formData.price || !formData.category_id || !formData.quantity || !formData.balance}
                        className="px-8 py-3 bg-luxury-gold hover:bg-white text-luxury-dark font-bold rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {isNew ? 'Create Product' : 'Update Product'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// PRODUCT LIST ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ProductListItem = ({ product, onEdit, onDelete, lang, viewMode, categories }) => {
    const { t } = useTranslation();
    const category = categories.find(c => c.id === product.category_id);
    const discountedPrice = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

    if (viewMode === 'grid') {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-300 group"
            >
                <div className="aspect-[3/4] bg-gray-900 relative overflow-hidden">
                    <img
                        src={product.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => e.target.src = '/images/placeholder.jpg'}
                    />
                    {product.discount > 0 && (
                        <span className="absolute top-3 right-3 bg-luxury-gold text-luxury-dark text-xs font-bold px-2 py-1 rounded">
                            -{product.discount}%
                        </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                            <button
                                onClick={() => onEdit(product)}
                                className="flex-1 py-2 bg-white text-luxury-dark text-sm font-bold rounded hover:bg-luxury-gold transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(product.id)}
                                className="px-3 py-2 bg-red-500/80 text-white rounded hover:bg-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 uppercase">
                            {lang === 'ar' && category?.name_ar ? category.name_ar : category?.name || 'Uncategorized'}
                        </span>
                    </div>
                    <h4 className="text-white font-medium truncate">
                        {lang === 'ar' && product.name_ar ? product.name_ar : product.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-luxury-gold font-serif">${discountedPrice.toFixed(2)}</span>
                        {product.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</span>
                        )}
                    </div>
                    <p className={`text-xs mt-2 ${product.balance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.balance > 0 ? `${t('admin.inStock')}: ${product.balance}` : t('admin.outOfStock')}
                    </p>
                </div>
            </motion.div>
        );
    }

    // List view
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-luxury-gold/30 transition-all duration-300 flex items-center gap-6 group"
        >
            <div className="w-24 h-24 rounded-lg bg-gray-900 overflow-hidden shrink-0 shadow-lg">
                <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/images/placeholder.jpg'}
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 uppercase">
                        {lang === 'ar' && category?.name_ar ? category.name_ar : category?.name || 'Uncategorized'}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-xs bg-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded">
                            -{product.discount}%
                        </span>
                    )}
                </div>
                <h4 className="text-white font-medium truncate">
                    {lang === 'ar' && product.name_ar ? product.name_ar : product.name}
                </h4>
                {product.name_ar && lang !== 'ar' && (
                    <p className="text-gray-400 text-sm truncate">{product.name_ar}</p>
                )}
            </div>
            <div className="text-right shrink-0">
                <div className="text-luxury-gold font-serif text-lg">${discountedPrice.toFixed(2)}</div>
                {product.discount > 0 && (
                    <div className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</div>
                )}
            </div>
            <div className="text-right shrink-0 w-20">
                <p className={`text-sm ${product.balance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.balance > 0 ? product.balance : 'Out'}
                </p>
                <p className="text-xs text-gray-500">{t('admin.inStock')}</p>
            </div>
            <div className="flex gap-2 shrink-0">
                <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-gray-400 hover:text-luxury-gold hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN ADMIN PRODUCT CRUD COMPONENT
// ═══════════════════════════════════════════════════════════════════

const AdminProductCRUD = ({
    onClose,
    products = [],
    categories = [],
    items = [],
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    fetchCategories,
    fetchItems,
    getItemsByCategory,
    lang = 'en',
    isAdmin
}) => {
    const { t, i18n } = useTranslation();
    const currentLang = lang || i18n.language;

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({});
    const [toast, setToast] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('products');
    const [dataLoaded, setDataLoaded] = useState(false);

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                if (fetchProducts) await fetchProducts();
                if (fetchCategories) await fetchCategories();
                if (fetchItems) await fetchItems();
                setDataLoaded(true);
            } catch (error) {
                showToast(t('admin.failedToLoadData'), 'error');
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [fetchProducts, fetchCategories, fetchItems]);

    // Toast helper
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    // Refresh products
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            if (fetchProducts) await fetchProducts();
            showToast(t('admin.productsRefreshed'), 'success');
        } catch (error) {
            showToast(t('admin.failedToRefreshProducts'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Start adding new product
    const handleStartAdd = () => {
        setEditingProduct(null);
        setIsAdding(true);
        setFormData({
            name: '',
            name_ar: '',
            price: 0,
            discount: 0,
            quantity: 0,
            balance: 0,
            category_id: '',
            item_id: '',
            image: ''
        });
    };

    // Start editing product
    const handleStartEdit = (product) => {
        setIsAdding(false);
        setEditingProduct(product);
        setFormData({
            id: product.id,
            name: product.name || '',
            name_ar: product.name_ar || '',
            price: product.price || 0,
            discount: product.discount || 0,
            quantity: product.quantity || 0,
            balance: product.balance || 0,
            category_id: product.category_id || '',
            item_id: product.item_id || '',
            image: product.image || ''
        });
    };

    // Cancel editing/adding
    const handleCancel = () => {
        setEditingProduct(null);
        setIsAdding(false);
        setFormData({});
    };

    // Save product (create or update)
    const handleSave = async () => {
        if (!formData.name || !formData.price || !formData.category_id || !formData.quantity || !formData.balance) {
            showToast(t('admin.fillRequiredFields'), 'error');
            return;
        }

        setIsSaving(true);
        try {
            const productData = {
                name: formData.name,
                name_ar: formData.name_ar || null,
                price: parseFloat(formData.price) || 0,
                discount: parseFloat(formData.discount) || 0,
                quantity: parseInt(formData.quantity) || 0,
                balance: parseInt(formData.balance) || 0,
                category_id: formData.category_id,
                item_id: formData.item_id || null,
                image: formData.image || null
            };

            if (isAdding) {
                await addProduct(productData);
                showToast(t('admin.productCreated'), 'success');
            } else {
                await updateProduct(formData.id, productData);
                showToast(t('admin.productUpdated'), 'success');
            }

            handleCancel();
            // Refresh the product list
            if (fetchProducts) {
                await fetchProducts();
            }
        } catch (error) {
            console.error('Failed to save product:', error);
            showToast(`${t('admin.errorSaving')}: ${error.message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteConfirm'))) {
            return;
        }

        try {
            await deleteProduct(id);
            showToast(t('admin.productDeleted'), 'success');
            // Refresh the product list
            if (fetchProducts) {
                await fetchProducts();
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            showToast(`${t('admin.errorDeleting')}: ${error.message}`, 'error');
        }
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = searchTerm === '' ||
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.name_ar?.includes(searchTerm);
        const matchesCategory = filterCategory === '' || product.category_id === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Get items by category (if not provided as prop)
    const getFilteredItems = (categoryId) => {
        if (getItemsByCategory) {
            return getItemsByCategory(categoryId);
        }
        return items.filter(item => item.category_id === categoryId);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="flex-1">
                {/* Product Form (Add/Edit) */}
                <AnimatePresence mode="wait">
                    {(isAdding || editingProduct) && (
                        <div className="mb-6">
                            <ProductForm
                                formData={formData}
                                setFormData={setFormData}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                isNew={isAdding}
                                isSaving={isSaving}
                                categories={categories}
                                items={items}
                                getItemsByCategory={getFilteredItems}
                                lang={currentLang}
                            />
                        </div>
                    )}
                </AnimatePresence>

                {/* Search & Filter Bar */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('admin.search')}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="w-48">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full bg-black/30 border border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-white appearance-none cursor-pointer focus:outline-none focus:border-luxury-gold transition-colors"
                            >
                                <option value="">{t('admin.allCategories')}</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {currentLang === 'ar' && cat.name_ar ? cat.name_ar : cat.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-1 bg-black/30 rounded-lg p-1 border border-gray-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-luxury-gold/20 text-luxury-gold' : 'text-gray-400 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-luxury-gold/20 text-luxury-gold' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Refresh */}
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="p-2.5 text-gray-400 hover:text-luxury-gold hover:bg-white/5 rounded-lg transition-colors border border-gray-700"
                        title={t('admin.refresh')}
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                    {/* Add Product Button - Moved here */}
                    <button
                        onClick={handleStartAdd}
                        disabled={!dataLoaded}
                        className="ml-auto px-5 py-2.5 bg-luxury-gold hover:bg-white text-luxury-dark font-bold rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        {t('admin.addProduct')}
                    </button>
                </div>

                {/* Product List */}
                {!dataLoaded ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                        <span className="ml-3 text-gray-400">{t('admin.loadingData')}</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-400 mb-2">{t('admin.noProducts')}</h3>
                        <p className="text-gray-500">
                            {searchTerm || filterCategory
                                ? t('admin.adjustFilters')
                                : t('admin.createFirstProduct')}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className={viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                            : 'space-y-3'
                        }
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map(product => (
                                <ProductListItem
                                    key={product.id}
                                    product={product}
                                    onEdit={handleStartEdit}
                                    onDelete={handleDelete}
                                    lang={currentLang}
                                    viewMode={viewMode}
                                    categories={categories}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminProductCRUD;