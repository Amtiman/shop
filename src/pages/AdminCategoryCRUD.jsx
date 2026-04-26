// AdminCategoryCRUD.jsx - Category Management Component
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit3, Trash2, X, Save, Tag,
    Loader2, CheckCircle, AlertCircle
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-6 right-6 z-[200] ${type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
                } border backdrop-blur-xl rounded-lg px-5 py-4 shadow-2xl flex items-center gap-3 max-w-sm`}
        >
            {type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <p className={type === 'success' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{message}</p>
            <button onClick={onClose} className="text-gray-500 hover:text-white ml-2">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Category Form Modal
const CategoryFormModal = ({ isOpen, onClose, category, onSave, isSaving }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: category?.name || '',
        name_ar: category?.name_ar || ''
    });

    React.useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                name_ar: category.name_ar || ''
            });
        } else {
            setFormData({ name: '', name_ar: '' });
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#1a2030] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <div className="px-8 py-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-serif text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                            {category ? <Edit3 className="w-5 h-5 text-luxury-gold" /> : <Plus className="w-5 h-5 text-luxury-gold" />}
                        </div>
                        {category ? t('admin.editCategory') : t('admin.addCategory')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="text-xs font-semibold text-luxury-gold/80 block mb-2 uppercase tracking-widest">
                            {t('admin.categoryNameEn')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-luxury-gold focus:bg-black/60 transition-all focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            placeholder="e.g., Women's Clothing"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-luxury-gold/80 block mb-2 uppercase tracking-widest">
                            {t('admin.categoryNameAr')}
                        </label>
                        <input
                            type="text"
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-luxury-gold focus:bg-black/60 transition-all text-right focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            placeholder="ملابس نسائية"
                            dir="rtl"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all"
                        >
                            {t('admin.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || !formData.name.trim()}
                            className="px-8 py-3 bg-luxury-gold hover:bg-white text-luxury-dark font-bold rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-luxury-gold/20 hover:shadow-luxury-gold/40 hover:-translate-y-0.5"
                        >
                            {isSaving ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> {t('admin.save')}...</>
                            ) : (
                                <><Save className="w-5 h-5" /> {category ? t('admin.save') : t('admin.create')}</>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Main Category CRUD Component
const AdminCategoryCRUD = ({
    categories = [],
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    lang = 'en'
}) => {
    const { t } = useTranslation();
    const [toast, setToast] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleOpenAdd = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSave = async (formData) => {
        setIsSaving(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
                showToast(t('admin.categoryUpdated'), 'success');
            } else {
                await addCategory(formData);
                showToast(t('admin.categoryCreated') || 'Category created successfully!', 'success');
            }
            handleCloseModal();
            if (fetchCategories) await fetchCategories();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(t('admin.confirmDeleteCategory', { name }))) {
            return;
        }

        try {
            await deleteCategory(id);
            showToast(t('admin.categoryDeleted'), 'success');
            if (fetchCategories) await fetchCategories();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    return (
        <div className="p-6">
            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                        <Tag className="w-7 h-7 text-luxury-gold" />
                        {t('admin.manageCategories')}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{categories.length} {t('admin.categoriesLabel')}</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="px-5 py-2.5 bg-luxury-gold hover:bg-white text-luxury-dark font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {t('admin.addCategory')}
                </button>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-gray-400 mb-2">{t('admin.noCategories')}</h3>
                    <p className="text-gray-500 mb-6">{t('admin.createFirstCategory')}</p>
                    <button
                        onClick={handleOpenAdd}
                        className="px-6 py-3 bg-luxury-gold hover:bg-white text-luxury-dark font-bold rounded-lg transition-all"
                    >
                        <Plus className="w-4 h-4 inline mr-2" />
                        {t('admin.addFirstCategory')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {categories.map((category) => (
                            <motion.div
                                key={category.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-luxury-gold/30 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                                        <Tag className="w-6 h-6 text-luxury-gold" />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenEdit(category)}
                                            className="p-2 text-gray-400 hover:text-luxury-gold hover:bg-white/5 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-white font-medium text-lg mb-1">{category.name}</h3>
                                {category.name_ar && (
                                    <p className="text-gray-400 text-sm" dir="rtl">{category.name_ar}</p>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                <CategoryFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    category={editingCategory}
                    onSave={handleSave}
                    isSaving={isSaving}
                />
            </AnimatePresence>
        </div>
    );
};

export default AdminCategoryCRUD;
