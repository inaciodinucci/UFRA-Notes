import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);

  // Initial auth check on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        try {
          // Verify token and get user data
          await getUserProfile();
        } catch (error) {
          console.error('Initial auth check failed', error);
          if (refreshToken) {
            try {
              await refreshAccessToken();
            } catch (refreshError) {
              console.error('Token refresh failed', refreshError);
              logout();
            }
          } else {
            logout();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Set auth header for all requests when token changes
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('accessToken', accessToken);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  // Save refresh token to localStorage when it changes
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/jwt/create/', { email, password });
      const { access, refresh } = response.data;
      
      setAccessToken(access);
      setRefreshToken(refresh);
      await getUserProfile();
      
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Login failed', error);
      const errorMessage = error.response?.data?.detail || 'Falha ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/api/auth/users/', userData);
      toast.success('Cadastro realizado com sucesso! Verifique seu email para ativar sua conta.');
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      const errorData = error.response?.data;
      if (errorData) {
        Object.keys(errorData).forEach(key => {
          toast.error(`${key}: ${errorData[key]}`);
        });
      } else {
        toast.error('Falha ao realizar cadastro.');
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    toast.info('Você saiu do sistema.');
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/api/auth/jwt/refresh/', { refresh: refreshToken });
      const { access } = response.data;
      setAccessToken(access);
      return true;
    } catch (error) {
      console.error('Token refresh failed', error);
      logout();
      return false;
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await api.get('/api/users/me/');
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Get user profile failed', error);
      throw error;
    }
  };

  // Check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshAccessToken,
    getUserProfile,
    isAuthenticated: !!user,
    accessToken,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 