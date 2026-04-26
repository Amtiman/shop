import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] z-0" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 z-0 mix-blend-overlay" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-pink/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[100px] animate-pulse delay-1000" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-luxury-gold uppercase tracking-[0.3em] mb-4 text-sm md:text-base font-semibold"
                >
                    {t('hero.subtitle')}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight"
                >
                    {t('hero.title')} <br />
                    <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-luxury-silver to-white text-3xl md:text-5xl lg:text-6xl block mt-4">{t('hero.subtitle2')}</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <a href="#products" className="inline-block px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white uppercase tracking-widest hover:bg-white hover:text-luxury-dark transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        {t('hero.cta')}
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;