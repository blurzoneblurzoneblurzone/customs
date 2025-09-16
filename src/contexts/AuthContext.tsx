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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
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
          return true;
        }
        
        return false;
      }

      if (data.user) {
        setIsAuthenticated(true);
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
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  React.useEffect(() => {
    // Проверяем текущую сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        if (session.user.email === 'admin@goth.su') {
          setIsAdmin(true);
        }
      }
    });

    // Слушаем изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          if (session.user.email === 'admin@goth.su') {
            setIsAdmin(true);
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
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