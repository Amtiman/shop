import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-luxury-dark border-t border-white/5 pt-20 pb-12">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <a href="#" className="font-serif text-3xl text-white tracking-wider">LUXE</a>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-500 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-500 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">{t('footer.shop')}</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#products" className="hover:text-luxury-gold transition-colors duration-300">{t('nav.collection')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">{t('footer.womens')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">{t('footer.kids')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">{t('footer.home')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">{t('footer.support')}</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">{t('footer.helpCenter')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">{t('footer.shipping')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">{t('footer.sizeGuide')}</a></li>
                            <li><a href="#" className="hover:text-luxury-gold transition-colors duration-300">{t('footer.privacy')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">{t('footer.contact')}</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                                <a
                                    href="https://maps.google.com/?q=N'djari+SNE+N'djamena+Chad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-luxury-gold transition-colors duration-300 leading-relaxed"
                                >
                                    {t('footer.address')}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
                                <span>{t('footer.phone')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
                                <span>{t('footer.email')}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mb-10 rounded-lg overflow-hidden border border-white/5">
                    <iframe
                        src="https://maps.google.com/maps?q=N%27djari+acote+de+SNE+N%27djamena+Chad&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="240"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Store Location"
                        className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    />
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">© {t('footer.copyright')} {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;