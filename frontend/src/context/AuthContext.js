import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user info is in localStorage
    const userFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userFromStorage) {
      setUser(userFromStorage);
    }
    
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      
      if (data) {
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      };
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const data = await registerUser(name, email, password);
      
      if (data) {
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Update profile
  const updateProfile = async (updatedUser) => {
    try {
      setUser({ ...user, ...updatedUser });
      localStorage.setItem('userInfo', JSON.stringify({ ...user, ...updatedUser }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;