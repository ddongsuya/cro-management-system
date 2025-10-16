import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  profile: {
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  };
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          // 토큰이 유효하지 않으면 제거
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  }) => {
    try {
      const response = await authAPI.register(userData);
      
      const { token: newToken, user: newUser } = response;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    department?: string;
    phone?: string;
  }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};