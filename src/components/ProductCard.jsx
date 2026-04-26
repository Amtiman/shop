// src/components/ProductCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, addToCart, lang }) => {
    const { t } = useTranslation();
    
    const displayName =
        lang === 'ar' && product.name_ar ? product.name_ar :
        lang === 'fr' && product.name_fr ? product.name_fr :
        product.name;
    const displayCategory =
        lang === 'ar' && product.category_ar ? product.category_ar :
        lang === 'fr' && product.category_fr ? product.category_fr :
        product.category;
    
    // Calculate discounted price
    const originalPrice = parseFloat(product.price);
    const discountedPrice = product.discount > 0 
        ? originalPrice * (1 - product.discount / 100)
        : originalPrice;

    // Check if product is available
    const isAvailable = product.balance !== undefined && product.balance > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-luxury-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] relative"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[3/4] bg-gray-800">
                <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                    }}
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-dark px-3 py-1 rounded-full text-xs font-bold">
                        -{product.discount}%
                    </div>
                )}

                {/* Out of Stock Badge */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 py-2 bg-red-500/50 rounded">
                            {t('product.outOfStock')}
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!isAvailable}
                        className="w-full py-3 bg-white text-luxury-dark font-bold uppercase tracking-wider hover:bg-luxury-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {t('product.addToCart') || 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
                {/* Category Badge */}
                <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-white/5 text-gray-400 text-xs uppercase rounded">
                        {displayCategory || t('product.uncategorized')}
                    </span>
                </div>

                <h3 className="text-lg font-medium text-white mb-2 line-clamp-2" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
                    {displayName}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-serif text-luxury-gold">
                        ${discountedPrice.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            ${originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Stock Indicator */}
                {product.balance !== undefined && (
                    <div className="text-xs">
                        {isAvailable ? (
                            <span className="text-green-400 flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                {t('product.inStock')}: {product.balance}
                            </span>
                        ) : (
                            <span className="text-red-400 flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                {t('product.outOfStock')}
                            </span>
                        )}
                    </div>
                )}

                {/* Quick Add Button (for mobile/touch) */}
                <button
                    onClick={() => isAvailable && addToCart(product)}
                    disabled={!isAvailable}
                    className="w-full mt-4 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
                >
                    {isAvailable ? (t('product.addToCart') || 'Add to Cart') : (t('product.outOfStock') || 'Out of Stock')}
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;