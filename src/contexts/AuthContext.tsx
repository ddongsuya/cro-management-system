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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivity');
  };

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const lastActivity = localStorage.getItem('lastActivity');
      
      if (storedToken) {
        // 마지막 활동 시간 확인 (1시간 = 3600000ms)
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
          if (timeSinceLastActivity > 3600000) {
            // 1시간 이상 비활동 시 자동 로그아웃
            console.log('Session expired due to inactivity');
            logout();
            setIsLoading(false);
            return;
          }
        }

        setToken(storedToken);
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          // 활동 시간 업데이트
          localStorage.setItem('lastActivity', Date.now().toString());
        } catch (error) {
          console.error('Failed to get current user:', error);
          // 토큰이 유효하지 않으면 제거
          logout();
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 사용자 활동 감지 및 자동 로그아웃
  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      // 활동 시간 업데이트
      localStorage.setItem('lastActivity', Date.now().toString());
      
      // 기존 타이머 클리어
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      // 1시간 후 자동 로그아웃
      inactivityTimer = setTimeout(() => {
        console.log('Auto logout due to inactivity');
        logout();
        alert('1시간 동안 활동이 없어 자동 로그아웃되었습니다.');
      }, 3600000); // 1시간
    };

    // 사용자 활동 이벤트
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // 초기 타이머 설정
    resetTimer();

    // 클린업
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('lastActivity', Date.now().toString());
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
      localStorage.setItem('lastActivity', Date.now().toString());
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
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