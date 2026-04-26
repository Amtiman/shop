import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, Globe, ChevronDown, Check, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' }
];

const Navbar = ({ cartCount, toggleCart, changeLang, currentLang, onAdminClick }) => {
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-luxury-dark/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Menu className="w-6 h-6 text-white md:hidden cursor-pointer" />
                    <h1 className="text-2xl font-serif text-white tracking-[0.2em] font-bold">
                        {t('elegance')}
                    </h1>
                </div>

                <div className="hidden md:flex gap-8 text-sm text-gray-300 tracking-wide uppercase">
                    <a href="#" className="hover:text-luxury-gold transition-colors">{t('nav.home')}</a>
                    <a href="#products" className="hover:text-luxury-gold transition-colors">{t('nav.collection')}</a>
                    <a href="#about" className="hover:text-luxury-gold transition-colors">{t('nav.about')}</a>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Admin Button */}
                    {onAdminClick && (
                        <button
                            onClick={onAdminClick}
                            className="text-white hover:text-luxury-gold transition-colors flex items-center gap-2 text-xs uppercase tracking-wider"
                            title="Admin Panel"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="hidden lg:inline">{t('nav.admin')}</span>
                        </button>
                    )}

                    {/* Language Selector */}
                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="text-white hover:text-luxury-gold transition-colors flex items-center gap-2 text-xs uppercase tracking-wider py-2"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">{currentLanguage.label}</span>
                            <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLangOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute top-full mt-2 w-40 bg-luxury-dark/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden py-2 ${currentLang === 'ar' ? 'left-0' : 'right-0'}`}
                                >
                                    {languages.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => {
                                                changeLang(l.code);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-white/10 transition-colors ${currentLang === l.code ? 'text-luxury-gold bg-white/5' : 'text-gray-300'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-base">{l.flag}</span>
                                                {l.label}
                                            </span>
                                            {currentLang === l.code && <Check className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={toggleCart}
                        className="relative text-white hover:text-luxury-gold transition-colors group"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-dark text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;