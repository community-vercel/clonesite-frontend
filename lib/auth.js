'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from './api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          const res = await api.get('/auth/me');
          setUser(res.data.data.user); // Adjust to match backend response structure
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('token');
        Cookies.remove('user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { token, user } = res.data.data;
    Cookies.set('token', token, { expires: 7 }); // Store token for 7 days
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    setUser(user);
    setIsAuthenticated(true);
    return res;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      Cookies.remove('token');
      Cookies.remove('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return { user, loading, isAuthenticated, login, logout };
};