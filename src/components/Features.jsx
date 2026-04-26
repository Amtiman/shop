import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const features = [
    {
        key: 'exclusive',
        image: '/images/other/accessories/Access6.jpg',
    },
    {
        key: 'timeless',
        image: '/images/other/watch/BGMM5386.JPG',
    },
    {
        key: 'crafted',
        image: '/images/other/accessories/SNEZ5380.JPG',
    },
];

const Features = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 md:py-32 bg-luxury-dark">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-16 md:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-serif text-white mb-6"
                    >
                        {t('features.title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-gray-500 text-lg max-w-xl"
                    >
                        {t('features.subtitle')}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                                <img
                                    src={feature.image}
                                    alt={t(`features.${feature.key}.title`)}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-luxury-dark/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-white font-serif text-xl">
                                    {t(`features.${feature.key}.title`)}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {t(`features.${feature.key}.description`)}
                                </p>
                                <span className="inline-flex items-center gap-2 text-luxury-gold text-sm uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                                    {t('features.discover')}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;