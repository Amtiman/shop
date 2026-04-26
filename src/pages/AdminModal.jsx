// AdminModal.jsx - Updated for your PostgreSQL/Supabase schema
import React, { useState } from 'react';
import { Settings, X, Save, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AdminModal = ({ isOpen, onClose, products, addProduct, updateProduct, deleteProduct }) => {
    const { t } = useTranslation();
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({});

    const startEdit = (product) => {
        setIsAdding(false);
        setEditingId(product.id);
        setFormData({
            id: product.id,
            name: product.name,
            name_ar: product.name_ar,
            price: product.price,
            discount: product.discount || 0,
            quantity: product.quantity || 0,
            category: product.category,
            image: product.image
        });
    };

    const startAdd = () => {
        setEditingId(null);
        setIsAdding(true);
        setFormData({
            name: '',
            name_ar: '',
            price: 0,
            discount: 0,
            quantity: 0,
            category: 'women',
            image: ''
        });
    };

    const handleSave = async () => {
        try {
            if (isAdding) {
                await addProduct(formData);
                setIsAdding(false);
            } else {
                await updateProduct(editingId, formData);
                setEditingId(null);
            }
            setFormData({});
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.deleteConfirm'))) {
            try {
                await deleteProduct(id);
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product: ' + error.message);
            }
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({});
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a2030] border border-white/10 w-full max-w-6xl h-[80vh] rounded-2xl flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                        <Settings className="w-6 h-6 text-luxury-gold" />
                        {t('admin.title')}
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={startAdd}
                            className="px-4 py-2 bg-luxury-gold text-luxury-dark font-bold rounded hover:bg-white transition-colors text-sm"
                        >
                            {t('admin.addProduct')}
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-4">
                        {isAdding && (
                            <ProductForm
                                formData={formData}
                                setFormData={setFormData}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                isNew={true}
                                t={t}
                            />
                        )}

                        {products.map(product => (
                            <div key={product.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start">
                                {editingId === product.id ? (
                                    <ProductForm
                                        formData={formData}
                                        setFormData={setFormData}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                        isNew={false}
                                        t={t}
                                    />
                                ) : (
                                    <>
                                        <div className="w-20 h-20 rounded bg-gray-800 overflow-hidden shrink-0">
                                            <img 
                                                src={product.image || '/images/placeholder.jpg'} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = '/images/placeholder.jpg'}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-white font-medium">{product.name}</h3>
                                                    <p className="text-gray-400 text-sm">{product.name_ar}</p>
                                                </div>
                                                <span className="text-gray-400 text-sm capitalize">{product.category}</span>
                                            </div>
                                            <div className="mt-2 flex gap-4 text-sm">
                                                <p className="text-luxury-gold font-bold">
                                                    ${product.price.toFixed(2)}
                                                    {product.discount > 0 && (
                                                        <span className="text-xs text-gray-500 ml-2 font-normal line-through">
                                                            ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                                        </span>
                                                    )}
                                                </p>
                                                {product.balance !== undefined && (
                                                    <p className="text-gray-400">
                                                        Stock: <span className={product.balance > 0 ? 'text-green-400' : 'text-red-400'}>
                                                            {product.balance}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => startEdit(product)}
                                                className="px-4 py-2 border border-white/20 rounded text-sm text-gray-300 hover:bg-white hover:text-luxury-dark transition-all shrink-0"
                                            >
                                                {t('admin.edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="px-4 py-2 border border-red-500/50 rounded text-sm text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0"
                                            >
                                                {t('admin.delete')}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Separate form component for adding/editing
const ProductForm = ({ formData, setFormData, onSave, onCancel, isNew, t }) => {
    return (
        <div className="flex-1 w-full grid md:grid-cols-2 gap-4 bg-white/5 border border-luxury-gold/50 p-4 rounded-lg">
            <div className="space-y-4">
                <h3 className="text-luxury-gold font-serif">
                    {isNew ? t('admin.newProduct') : t('admin.edit')}
                </h3>
                
                {/* English Name */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        {t('admin.name')} (English)
                    </label>
                    <input
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white"
                        placeholder="Elegant Dress"
                    />
                </div>

                {/* Arabic Name */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        {t('admin.name')} (العربية)
                    </label>
                    <input
                        value={formData.name_ar || ''}
                        onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white text-right"
                        placeholder="فستان أنيق"
                        dir="rtl"
                    />
                </div>

                {/* Price and Discount */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">
                            {t('admin.price')}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price || 0}
                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">
                            {t('admin.discount')}
                        </label>
                        <input
                            type="number"
                            value={formData.discount || 0}
                            onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white"
                        />
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        Quantity / Stock
                    </label>
                    <input
                        type="number"
                        value={formData.quantity || 0}
                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        {t('admin.category')}
                    </label>
                    <select
                        value={formData.category || 'women'}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white"
                    >
                        <option value="women">{t('admin.categories.women')}</option>
                        <option value="men">{t('admin.categories.men')}</option>
                        <option value="children">{t('admin.categories.children')}</option>
                        <option value="home">{t('admin.categories.home')}</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {/* Image URL */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        {t('admin.imageUrl')}
                    </label>
                    <input
                        value={formData.image || ''}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white"
                        placeholder="/images/women/dress1.jpg"
                    />
                </div>

                {/* Image Preview */}
                <div className="w-full h-48 bg-black/20 rounded flex items-center justify-center overflow-hidden border border-gray-700">
                    {formData.image ? (
                        <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="h-full object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : (
                        <ImageIcon className="text-gray-600" />
                    )}
                    <div className="hidden flex-col items-center text-gray-600">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs">Invalid image URL</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                    <button 
                        onClick={onCancel} 
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        {t('admin.cancel')}
                    </button>
                    <button 
                        onClick={onSave} 
                        className="px-6 py-2 bg-luxury-gold text-luxury-dark font-bold rounded hover:bg-white transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> 
                        {isNew ? t('admin.create') : t('admin.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminModal;