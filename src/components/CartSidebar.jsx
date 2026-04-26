import React, { useMemo } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CartSidebar = ({ isOpen, onClose, cartItems, addToCart, removeFromCart, updateQuantity, setCheckoutStep, lang }) => {
    const { t } = useTranslation();
    
    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[60] flex"
            onClick={handleOverlayClick}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
            {/* Sidebar - click outside to close */}
            <div 
                className={`fixed top-0 bottom-0 w-full max-w-md bg-[#0d1b2a] border-l border-white/10 shadow-2xl flex flex-col h-[100dvh] ${lang === 'ar' ? 'left-0' : 'right-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <h2 className="text-2xl font-serif text-white">{t('cart.title')}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">
                            <p>{t('cart.empty')}</p>
                            <button onClick={handleClose} className="mt-4 text-luxury-gold hover:underline">{t('cart.continue')}</button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-medium">{item.name}</h3>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        ${item.discount ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:border-white hover:text-white transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:border-white hover:text-white transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-white/5 shrink-0 safe-pb">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400">{t('cart.subtotal')}</span>
                            <span className="text-xl font-serif text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">{t('cart.shipping')}</p>
                        <button
                            onClick={() => {
                                handleClose();
                                setCheckoutStep('checkout');
                            }}
                            className="w-full py-4 bg-white text-luxury-dark uppercase tracking-widest font-bold hover:bg-luxury-gold transition-colors duration-300 mb-2"
                        >
                            {t('cart.checkout')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;