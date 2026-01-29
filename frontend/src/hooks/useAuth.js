import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authAPI from '../api/auth.api';

// Create the context
const AuthContext = createContext();

// Provider component to wrap your app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial load state

  // Login method
  const login = useCallback(async (email, password) => {
    const data = await authAPI.login(email, password);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
    }
    return data;
  }, []);

  // Fetch user on app startup (if JWT exists)
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      setUser(null);
      return null;
    }
    try {
      const user = await authAPI.getCurrentUser();
      setUser(user);
      setLoading(false);
      return user;
    } catch (err) {
      localStorage.removeItem('accessToken');
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  // Fetch user on mount if token exists
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Share everything app-wide
  const value = { user, loading, login, fetchUser, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming in components
export function useAuth() {
  return useContext(AuthContext);
}