import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    
    return (
        <footer className="bg-luxury-dark border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white tracking-[0.2em] font-bold">ELEGANCE</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-luxury-dark transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-luxury-dark transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-luxury-dark transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-serif mb-6">{t('footer.shop')}</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('nav.collection')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('footer.womens')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('footer.kids')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('footer.home')}</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-serif mb-6">{t('footer.support')}</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('footer.helpCenter')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('footer.shipping')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('footer.sizeGuide')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('footer.privacy')}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-serif mb-6">{t('footer.contact')}</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-luxury-gold shrink-0" />
                                <span>{t('footer.address')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-luxury-gold shrink-0" />
                                <span>{t('footer.phone')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-luxury-gold shrink-0" />
                                <span>{t('footer.email')}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">© {t('footer.copyright')} {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;