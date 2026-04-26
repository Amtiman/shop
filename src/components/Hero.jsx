import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
    const { t } = useTranslation();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <motion.div 
                style={{ y }}
                className="absolute inset-0"
            >
                <div className="absolute inset-0 bg-luxury-dark" />
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-luxury-dark/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/80 via-transparent to-luxury-dark/80" />
            </motion.div>

            <motion.div
                style={{ opacity }}
                className="container mx-auto px-6 relative z-10"
            >
                <div className="max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-luxury-gold uppercase tracking-[0.4em] mb-6 text-xs md:text-sm font-medium"
                    >
                        {t('hero.subtitle')}
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1]"
                    >
                        {t('hero.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed font-light"
                    >
                        {t('hero.subtitle2')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-wrap gap-4"
                    >
                        <a 
                            href="#products" 
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-luxury-gold text-luxury-dark font-semibold uppercase tracking-widest hover:bg-white transition-all duration-500"
                        >
                            {t('hero.cta')}
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
                        </a>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2 text-gray-400"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ArrowDown className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;