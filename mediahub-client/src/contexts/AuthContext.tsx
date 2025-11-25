import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getToken } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserIdFromToken = (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.nameid || payload.userId || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const loadUserInfo = async (userId: string) => {
    try {
      const username = await authApi.getUsername(userId);
      setUser({
        id: userId,
        username: username,
        email: '' // Email не потрібен для відображення
      });
    } catch (error) {
      console.error('Failed to get username:', error);
      authApi.logout();
    }
  };

  useEffect(() => {
    // Перевірка наявності токену при завантаженні
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        const userId = getUserIdFromToken(token);
        if (userId) {
          await loadUserInfo(userId);
        } else {
          authApi.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const token = await authApi.login(username, password);
      if (token) {
        const userId = getUserIdFromToken(token);
        if (userId) {
          await loadUserInfo(userId);
        } else {
          throw new Error('Failed to decode token');
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const token = await authApi.register(username, email, password);
      if (token) {
        const userId = getUserIdFromToken(token);
        if (userId) {
          await loadUserInfo(userId);
        } else {
          throw new Error('Failed to decode token');
        }
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
