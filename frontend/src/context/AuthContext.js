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
  const [localUserId, setLocalUserId] = useState(localStorage.getItem('localUserId') || null);

  // Initial auth check on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Ensure we have a local user ID for localStorage
      if (!localUserId) {
        const newLocalId = 'user_' + Date.now();
        localStorage.setItem('localUserId', newLocalId);
        setLocalUserId(newLocalId);
        console.log("Created new localUserId:", newLocalId);
      }
      
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
        // Não criar mais usuário convidado
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setLoading(true);
      const response = await api.post('/api/auth/jwt/create/', { email, password });
      const { access, refresh } = response.data;
      
      setAccessToken(access);
      setRefreshToken(refresh);
      await getUserProfile();
      
      toast.success('Login realizado com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.non_field_errors?.[0] ||
                          'Falha ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/users/', userData);
      toast.success('Cadastro realizado com sucesso! Verifique seu email para ativar sua conta.');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed', error);
      const errorData = error.response?.data;
      let errorMessage = 'Falha ao realizar cadastro.';
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else {
          // Handle field-specific errors
          const fieldErrors = Object.keys(errorData).map(key => 
            `${key}: ${Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key]}`
          ).join(', ');
          errorMessage = fieldErrors;
        }
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
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
      const userData = { 
        ...response.data,
        localId: localUserId // Ensure we always have a consistent ID for localStorage
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Get user profile failed', error);
      throw error;
    }
  };

  // Check if the token is expired (for future use)
  // eslint-disable-next-line no-unused-vars
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
    isAuthenticated: !!user && !user.isGuest, // Não considerar usuário convidado como autenticado
    accessToken,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 