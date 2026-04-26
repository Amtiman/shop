import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  is_active: boolean;
  can_login: boolean;
  permissions: string[];
  last_login?: string;
  user_metadata?: { is_admin: boolean };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ user: User; session: unknown }>;
  signup: (email: string, password: string, name?: string, phone?: string) => Promise<unknown>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  resetAuthState: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (supabaseUser: { id: string; email: string; user_metadata?: Record<string, unknown> }) => {
    const userId = supabaseUser.id;
    const userEmail = supabaseUser.email as string;

    try {
      let { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!data || fetchError) {
        const { data: emailData } = await supabase
          .from('users')
          .select('*')
          .eq('email', userEmail)
          .maybeSingle();

        if (emailData) data = emailData;
      }

      if (!data) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            name: (supabaseUser.user_metadata?.full_name as string) || userEmail.split('@')[0],
            email: userEmail,
            phone: (supabaseUser.user_metadata?.phone as string) || null,
            is_admin: false,
            is_active: true,
            can_login: true,
            permissions: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          const basicUser: User = {
            id: userId,
            email: userEmail,
            name: userEmail.split('@')[0],
            is_admin: false,
            is_active: true,
            can_login: true,
            permissions: [],
            phone: '',
          };
          setAuthState(prev => ({ ...prev, user: basicUser, isAuthenticated: true }));
          return basicUser;
        }

        data = newUser;
      }

      if (!data) throw new Error('Failed to retrieve or create user record');

      if (data.is_active === false) throw new Error('Account is inactive');
      if (data.can_login === false) throw new Error('Account access pending admin approval');

      const finalUser: User = {
        id: data.id,
        name: data.name || userEmail.split('@')[0],
        email: data.email,
        phone: data.phone || '',
        is_admin: data.is_admin || false,
        is_active: data.is_active,
        can_login: data.can_login,
        permissions: (data.permissions as string[]) || [],
        last_login: data.last_login as string | undefined,
        user_metadata: { is_admin: data.is_admin || false },
      };

      supabase
        .from('users')
        .update({ last_login: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', finalUser.id)
        .then(() => {});

      setAuthState(prev => ({ ...prev, user: finalUser, isAuthenticated: true }));
      return finalUser;

    } catch (err) {
      if ((err as Error).message?.includes('pending admin approval') ||
          (err as Error).message?.includes('inactive') ||
          (err as Error).message?.includes('Failed to retrieve')) {
        supabase.auth.signOut().catch(() => {});
      }
      setAuthState(prev => ({ ...prev, user: null, isAuthenticated: false }));
      throw err;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user as { id: string; email: string; user_metadata?: Record<string, unknown> });
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          await fetchUserProfile(session.user as { id: string; email: string; user_metadata?: Record<string, unknown> });
        }
      } finally {
        if (mounted) setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUserProfile(session.user as { id: string; email: string; user_metadata?: Record<string, unknown> }).catch(() => {});
        } else if (event === 'SIGNED_OUT') {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          setError(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const clearError = useCallback(() => setError(null), []);
  const resetAuthState = useCallback(() => setError(null), []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    setAuthState(prev => ({ ...prev, isLoading: true }));
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw authError;
      }

      if (!data.session?.user) throw new Error('Authentication failed');

      const user = await fetchUserProfile(data.user);
      return { user, session: data.session };

    } catch (err) {
      setError((err as Error).message || 'Login failed');
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      throw err;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signup = async (email: string, password: string, name = '', phone = '') => {
    const normalizedEmail = email.toLowerCase().trim();
    setAuthState(prev => ({ ...prev, isLoading: true }));
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { full_name: name, phone } },
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('Sign up failed');

      await supabase.from('users').insert({
        id: data.user.id,
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        phone: phone || null,
        is_admin: false,
        is_active: true,
        can_login: true,
        permissions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return data;
    } catch (err) {
      setError((err as Error).message || 'Signup failed');
      throw err;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await supabase.auth.signOut();
    } finally {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      setError(null);
    }
  };

  const hasPermission = useCallback((permission: string) => {
    if (!authState.user?.permissions) return false;
    return authState.user.permissions.includes('all') || authState.user.permissions.includes(permission);
  }, [authState.user]);

  const isAdmin = authState.user?.is_admin === true || authState.user?.user_metadata?.is_admin === true;

  const value: AuthContextValue = {
    ...authState,
    isAdmin,
    loading: authState.isLoading,
    error,
    login,
    signup,
    logout,
    refreshUser,
    clearError,
    resetAuthState,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;