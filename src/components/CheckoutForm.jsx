import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Banknote, FileText, X } from 'lucide-react';

import { apiService } from '../services/api';

const CheckoutForm = ({ cartItems, onClose, clearCart, t }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        paymentMethod: 'card'
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return total + price * item.quantity;
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            await apiService.submitOrder({
                ...formData,
                items: cartItems,
                total: subtotal,
                date: new Date().toISOString()
            });
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Order submission failed", error);
            setIsProcessing(false);
            // Optionally set an error state here
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-dark/90 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-luxury-dark border border-white/10 p-8 rounded-2xl max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-serif text-white mb-4">{t('checkout.successTitle')}</h2>
                    <p className="text-gray-400 mb-8">{t('checkout.successMsg').replace('{name}', formData.fullName)}</p>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white text-luxury-dark rounded-full hover:bg-luxury-gold transition-colors"
                    >
                        {t('checkout.return')}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-dark/90 backdrop-blur-md overflow-y-auto">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[#1a2030] border border-white/10 w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl my-8"
            >
                {/* Order Summary */}
                <div className="p-8 bg-white/5 border-b md:border-b-0 md:border-r border-white/10">
                    <h3 className="text-xl font-serif text-white mb-6">{t('checkout.summary')}</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded bg-gray-800 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-gray-300">{item.name}</p>
                                        <p className="text-gray-500">{t('checkout.qty')}: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-white">
                                    ${(item.discount ? item.price * (1 - item.discount / 100) : item.price).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                        <div className="flex justify-between text-gray-400">
                            <span>{t('checkout.subtotal')}</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>{t('checkout.shipping')}</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-white text-lg font-medium pt-2">
                            <span>{t('checkout.total')}</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-serif text-white">{t('checkout.details')}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('checkout.name')}
                                required
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                            />
                            <input
                                type="tel"
                                placeholder={t('checkout.phone')}
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                            />
                            <textarea
                                placeholder={t('checkout.address')}
                                required
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-400">{t('checkout.payment')}</p>
                            <div className="grid grid-cols-3 gap-3">
                                <label className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'card' ? 'border-luxury-gold bg-luxury-gold/10 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                    <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({ ...formData, paymentMethod: 'card' })} className="hidden" />
                                    <CreditCard className="w-5 h-5" />
                                    <span className="text-xs">{t('checkout.card')}</span>
                                </label>
                                <label className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'cod' ? 'border-luxury-gold bg-luxury-gold/10 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                    <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })} className="hidden" />
                                    <Banknote className="w-5 h-5" />
                                    <span className="text-xs">{t('checkout.cash')}</span>
                                </label>
                                <label className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'cheque' ? 'border-luxury-gold bg-luxury-gold/10 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                    <input type="radio" name="payment" value="cheque" checked={formData.paymentMethod === 'cheque'} onChange={() => setFormData({ ...formData, paymentMethod: 'cheque' })} className="hidden" />
                                    <FileText className="w-5 h-5" />
                                    <span className="text-xs">{t('checkout.cheque')}</span>
                                </label>
                            </div>
                        </div>

                        {formData.paymentMethod === 'card' && (
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                                <input type="text" placeholder={t('product.cardNumber')} className="w-full bg-transparent border-b border-gray-600 py-2 text-white text-sm focus:outline-none focus:border-luxury-gold" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder={t('product.expiryDate')} className="w-full bg-transparent border-b border-gray-600 py-2 text-white text-sm focus:outline-none focus:border-luxury-gold" />
                                    <input type="text" placeholder={t('product.cvc')} className="w-full bg-transparent border-b border-gray-600 py-2 text-white text-sm focus:outline-none focus:border-luxury-gold" />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-4 bg-luxury-gold hover:bg-white text-luxury-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>{t('checkout.processing')}</>
                            ) : (
                                <>{t('checkout.placeOrder')}</>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckoutForm;
