// src/Components/Context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [activePage, setActivePage] = useState('home');
  const [loading, setLoading] = useState(true);

  const validateToken = useCallback(async (token) => {
    try {
      // Make a lightweight API call to verify token is valid
      const response = await api.get('/children');
      return response.data; // returns user's children array if valid
    } catch (error) {
      return null;
    }
  }, []);

  const restoreAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('jabali_token');
      const stored = localStorage.getItem('jabali_auth');
      
      if (token && stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Validate token with a test API call
          const valid = await validateToken(token);
          if (valid !== null) {
            setIsLoggedIn(true);
            setUserRole(parsed.userRole || '');
            setUserName(parsed.userName || '');
            setUserEmail(parsed.userEmail || '');
            setUserId(parsed.userId || '');
          } else {
            // Token invalid - clear storage
            localStorage.removeItem('jabali_token');
            localStorage.removeItem('jabali_auth');
          }
        }
      }
    } catch (e) {
      console.error('Failed to restore auth from storage', e);
      localStorage.removeItem('jabali_token');
      localStorage.removeItem('jabali_auth');
    } finally {
      setLoading(false);
    }
  }, [validateToken]);

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  const login = async (email, password, role, fullName = '', isRegister = false) => {
    try {
      const endpoint = isRegister ? authAPI.register : authAPI.login;
      const response = await endpoint({ email, password, role, fullName });
      
      const { token, user } = response.data;
      
      localStorage.setItem('jabali_token', token);
      localStorage.setItem('jabali_auth', JSON.stringify({
        isLoggedIn: true,
        userRole: user.role,
        userName: user.fullName.split(' ')[0],
        userEmail: user.email,
        userId: user.id,
      }));
      
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUserName(user.fullName.split(' ')[0]);
      setUserEmail(user.email);
      setUserId(user.id);
      
      return { success: true };
    } catch (error) {
      console.error('Auth error:', error);
      const message = error.response?.data?.error || 'Authentication failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('jabali_token');
    localStorage.removeItem('jabali_auth');
    setIsLoggedIn(false);
    setUserRole('');
    setUserName('');
    setUserEmail('');
    setUserId('');
    setActivePage('home');
  };

  const getDefaultName = (role) => {
    return role === 'parent' ? 'Parent User' : 'Caregiver';
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userRole,
      userName,
      userEmail,
      userId,
      activePage,
      setActivePage,
      login,
      logout,
      loading,
      getDefaultName,
    }}>
      {children}
    </AuthContext.Provider>
  );
};