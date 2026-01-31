// src/context/AuthContext.jsx - CORRECTED VERSION
import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check authentication status from localStorage
   * No API call needed - faster initial load
   */
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear corrupted data
        logout();
      }
    }
    
    setLoading(false);
  };

  /**
   * Login user with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Response data
   */
  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      
      // Validate response structure
      if (!data.token || !data.user) {
        throw new Error('Invalid login response');
      }

      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 403) {
        throw new Error('Account is inactive or banned');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  /**
   * Register new user
   * @param {Object} userData - { name, email, phone, password, role }
   * @returns {Promise<Object>} Response data
   */
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      
      // Validate response structure
      if (!data.token || !data.user) {
        throw new Error('Invalid registration response');
      }

      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error('Email already exists');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  /**
   * Logout user - Clear all auth data
   */
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    
    console.log('User logged out successfully');
  };

  /**
   * Update user data (for profile updates)
   * @param {Object} updatedUser - Updated user object
   */
  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      console.error('updateUser called with null/undefined');
      return;
    }

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('User data updated successfully');
  };

  /**
   * Refresh user data from server
   * Call this after profile updates to get fresh data
   */
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }

      const { data } = await api.get('/users/me');
      
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    setUser // Keep for backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;