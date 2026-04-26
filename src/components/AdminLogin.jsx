import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, AlertCircle, X, Sparkles } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess, onClose }) => {
  const { t } = useTranslation();
  const { login, isAuthenticated, error: authError, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (clearError) clearError();
    setEmail('');
    setPassword('');
    setLocalError('');
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isSubmitting) {
      const timer = setTimeout(() => {
        onLoginSuccess?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, onLoginSuccess, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (clearError) clearError();

    if (!email || !password) {
      setLocalError(t('admin.fillAllFields') || 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.message || t('admin.loginFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (clearError) clearError();
    setLocalError('');
    onClose?.();
  };

  const displayError = localError || authError;
  const showLoading = isSubmitting || isLoading;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-[#0a0e14]">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a] via-[#1a2030] to-[#0d1b2a]" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Subtle top gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a]/50 to-transparent" />

      {/* Animated gold orb - top right */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#c9a227] to-transparent rounded-full blur-[120px]"
      />

      {/* Animated gold orb - bottom left */}
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-[#c9a227]/80 to-transparent rounded-full blur-[150px]"
      />

      {/* Center glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-[#c9a227]/5 rounded-full blur-[100px]" />
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white rounded-full transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Main content - centered */}
      <div className="relative z-10 w-full max-w-[420px] mx-6">
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            {/* Decorative element */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a227]/20 to-transparent border border-[#c9a227]/30 mb-6"
            >
              <Sparkles className="w-7 h-7 text-[#c9a227]" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#c9a227] uppercase tracking-[0.25em] text-xs font-semibold mb-3"
            >
              {t('admin.exclusiveAccess')}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-serif text-white mb-2 tracking-wide"
            >
              {t('admin.adminPortal')}
            </motion.h1>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/50 text-sm"
            >
              {t('admin.loginRequired') || 'Please login to access the admin panel'}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl"
        >
          {/* Error Message */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm text-left">{displayError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <div className="mb-5">
            <label className="block text-left text-[#c9a227]/80 text-xs font-semibold uppercase tracking-widest mb-3">
              {t('admin.email') || 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elegance.com"
                disabled={showLoading}
                className="w-full pl-12 pr-5 py-4 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-white/25 focus:border-[#c9a227]/50 focus:bg-white/[0.05] focus:outline-none focus:shadow-[0_0_20px_rgba(201,162,39,0.1)] transition-all duration-300 disabled:opacity-50 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-left text-[#c9a227]/80 text-xs font-semibold uppercase tracking-widest mb-3">
              {t('admin.password') || 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={showLoading}
                className="w-full pl-12 pr-5 py-4 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-white/25 focus:border-[#c9a227]/50 focus:bg-white/[0.05] focus:outline-none focus:shadow-[0_0_20px_rgba(201,162,39,0.1)] transition-all duration-300 disabled:opacity-50 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={showLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#c9a227] to-[#b8941f] text-[#0a0e14] font-semibold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(201,162,39,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {showLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('admin.logging') || 'Logging in...'}
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                {t('admin.login') || 'Login'}
              </>
            )}
          </button>
        </motion.form>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-white/30 text-xs text-center"
        >
          {t('admin.contactAdmin') || 'Contact the administrator for login credentials'}
        </motion.p>
      </div>
    </div>
  );
};

export default AdminLogin;