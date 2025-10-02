'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../lib/apiService';
import { type DemoUser, DEMO_CREDENTIALS } from '../config/demoCredentials';

interface AuthContextType {
  user: DemoUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token && token.startsWith('demo_token_')) {
            const userId = token.split('_')[2];
            const demoUser = DEMO_CREDENTIALS.find(user => user.id === userId);
            if (demoUser) {
              setUser(demoUser);
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem('auth_token');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Use demo credentials for authentication
      const demoUser = DEMO_CREDENTIALS.find(
        user => user.email === email && user.password === password
      );
      
      if (demoUser) {
        // Simulate API token for demo user
        const demoToken = `demo_token_${demoUser.id}_${Date.now()}`;
        localStorage.setItem('auth_token', demoToken);
        
        setUser(demoUser);
        setIsAuthenticated(true);
        return true;
      } else {
        // Return false for invalid credentials
        console.error('Invalid demo credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    apiService.logout();
  };

  const checkPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasPermission: checkPermission,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
