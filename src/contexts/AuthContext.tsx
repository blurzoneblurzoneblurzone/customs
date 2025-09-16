import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupabaseAuth, setIsSupabaseAuth] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Проверяем, настроен ли Supabase
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Supabase не настроен - не делаем запросы
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        
        // Fallback authentication for demo purposes
        if (email === 'admin@goth.su' && password === 'admin123') {
          setIsAuthenticated(true);
          setIsAdmin(true);
          setIsSupabaseAuth(false);
          return true;
        }
        
        return false;
      }

      if (data.user) {
        setIsAuthenticated(true);
        setIsSupabaseAuth(true);
        // Проверяем, является ли пользователь админом
        if (email === 'admin@goth.su') {
          setIsAdmin(true);
        }
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback authentication for demo purposes
      if (email === 'admin@goth.su' && password === 'admin123') {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setIsSupabaseAuth(false);
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    if (isSupabaseAuth) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsSupabaseAuth(false);
  };

  React.useEffect(() => {
    // Проверяем текущую сессию при загрузке
    const checkSession = async () => {
      try {
        if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setIsSupabaseAuth(true);
          if (session.user.email === 'admin@goth.su') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.log('Session check failed, using fallback auth');
      }
    };
    
    checkSession();

    // Слушаем изменения состояния аутентификации
    let subscription: any;
    
    try {
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        return;
      }

      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            setIsAuthenticated(true);
            setIsSupabaseAuth(true);
            if (session.user.email === 'admin@goth.su') {
              setIsAdmin(true);
            }
          } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
            setIsSupabaseAuth(false);
          }
        }
      );
      subscription = authSubscription;
    } catch (error) {
      console.log('Auth state listener failed, using fallback auth');
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}