'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

const refreshToken = async () => {
  try {
    const refreshTokenValue = Cookies.get('refreshToken');
    if (!refreshTokenValue) {
      console.log('No refresh token found in cookies');
      return null;
    }

    console.log('Attempting to refresh token');
    const response = await authAPI.refreshToken({ refreshToken: refreshTokenValue });
    console.log('refreshToken response:', response);
    const { token } = response.data.data || response.data;
    if (!token) {
      throw new Error('No token received in refresh response');
    }
    console.log('New token obtained:', token);
    Cookies.set('token', token, {
      expires: 30,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data?.message || error.message, error.response?.data);
    return null;
  }
};

const checkAuth = async () => {
  try {
    const token = Cookies.get('token');
    const storedUser = Cookies.get('user');
    const refreshTokenValue = Cookies.get('refreshToken');
    console.log('Checking auth:', { token: !!token, storedUser: !!storedUser, refreshToken: !!refreshTokenValue });

    if (!token || !storedUser) {
      console.log('Missing token or user cookie, attempting token refresh');
      if (refreshTokenValue) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const response = await authAPI.getProfile();
            console.log('Profile response after refresh:', response.data);
            const fetchedUser = response.data?.data?.user || response.data?.user;
            if (!fetchedUser || typeof fetchedUser !== 'object' || Array.isArray(fetchedUser)) {
              throw new Error(`Invalid user data from profile API after refresh: ${JSON.stringify(response.data)}`);
            }
            setUser(fetchedUser);
            Cookies.set('user', JSON.stringify(fetchedUser), {
              expires: 30,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'Strict',
            });
            setLoading(false);
            setInitialized(true);
            return;
          } catch (retryError) {
            console.error('Retry profile fetch failed:', retryError.response?.data?.message || retryError.message, retryError.response?.data);
          }
        }
      }
      console.log('No valid token or refresh token, clearing auth');
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('refreshToken');
      setUser(null);
      setLoading(false);
      setInitialized(true);
      // router.replace('/auth/login');
      return;
    }

    // Decode URL-encoded user cookie
    let userData;
    try {
      const decodedUser = decodeURIComponent(storedUser);
      userData = JSON.parse(decodedUser);
      if (!userData || typeof userData !== 'object' || Array.isArray(userData)) {
        throw new Error('Parsed user data is invalid');
      }
    } catch (error) {
      console.error('Failed to parse user from cookie:', error, { storedUser });
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('refreshToken');
      setUser(null);
      setLoading(false);
      setInitialized(true);
      router.replace('/auth/login');
      return;
    }

    // Set user state immediately
    setUser(userData);

    // Validate token by fetching profile
    console.log('Fetching profile with token');
    try {
      const response = await authAPI.getProfile();
      console.log('Profile response:', response.data);
      const fetchedUser = response.data?.data?.user || response.data?.user;
      if (!fetchedUser || typeof fetchedUser !== 'object' || Array.isArray(fetchedUser)) {
        throw new Error(`Invalid user data from profile API: ${JSON.stringify(response.data)}`);
      }
      setUser(fetchedUser);
      Cookies.set('user', JSON.stringify(fetchedUser), {
        expires: 30,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      // Periodically refresh token
      const tokenExpiry = 15 * 60 * 1000; // 15 minutes
      const refreshInterval = setInterval(async () => {
        const newToken = await refreshToken();
        if (!newToken) {
          clearInterval(refreshInterval);
          console.log('Token refresh failed, clearing auth');
          Cookies.remove('token');
          Cookies.remove('user');
          Cookies.remove('refreshToken');
          setUser(null);
          router.replace('/auth/login');
        }
      }, tokenExpiry - 60000);

      return () => clearInterval(refreshInterval);
    } catch (error) {
      console.error('Profile fetch failed:', error.message, error.response?.data);
      if (error.response?.status === 401 && refreshTokenValue) {
        console.log('Attempting token refresh due to 401');
        const newToken = await refreshToken();
        if (newToken) {
          console.log('Retrying profile fetch with new token');
          try {
            const response = await authAPI.getProfile();
            console.log('Profile response after refresh:', response.data);
            const fetchedUser = response.data?.data?.user || response.data?.user;
            if (!fetchedUser || typeof fetchedUser !== 'object' || Array.isArray(fetchedUser)) {
              throw new Error(`Invalid user data from profile API after refresh: ${JSON.stringify(response.data)}`);
            }
            setUser(fetchedUser);
            Cookies.set('user', JSON.stringify(fetchedUser), {
              expires: 30,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'Strict',
            });
          } catch (retryError) {
            console.error('Retry profile fetch failed:', retryError.response?.data?.message || retryError.message, retryError.response?.data);
            Cookies.remove('token');
            Cookies.remove('user');
            Cookies.remove('refreshToken');
            setUser(null);
            router.replace('/auth/login');
          }
        } else {
          console.log('Token refresh failed, clearing auth');
          Cookies.remove('token');
          Cookies.remove('user');
          Cookies.remove('refreshToken');
          setUser(null);
          router.replace('/auth/login');
        }
      } else {
        console.error('Non-401 error or no refresh token, clearing auth:', error.message, error.response?.data);
        Cookies.remove('token');
        Cookies.remove('user');
        Cookies.remove('refreshToken');
        setUser(null);
        router.replace('/auth/login');
      }
    }
  } catch (error) {
    console.error('Unexpected error in checkAuth:', error.message, error.response?.data);
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('refreshToken');
    setUser(null);
    setLoading(false);
    setInitialized(true);
    // router.replace('/auth/login');
  } finally {
    setLoading(false);
    setInitialized(true);
  }
};
  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await authAPI.login(credentials);
      const { token, user, refreshToken } = response.data.data || response.data;

      if (!token || !user || typeof user !== 'object') {
        throw new Error('Invalid login response: missing or invalid token/user');
      }

      Cookies.set('token', token, { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      Cookies.set('user', JSON.stringify(user), { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      } else {
        console.warn('No refresh token provided in login response');
      }
      setUser(user);
      console.log('Login successful, user set:', user);
      toast.success('Login successful!');
      router.push('/dashboard');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      console.error('Login error:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  };
  const logins = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await authAPI.login(credentials);
      const { token, user, refreshToken } = response.data.data || response.data;

      if (!token || !user || typeof user !== 'object') {
        throw new Error('Invalid login response: missing or invalid token/user');
      }

      Cookies.set('token', token, { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      Cookies.set('user', JSON.stringify(user), { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      } else {
        console.warn('No refresh token provided in login response');
      }
      setUser(user);
      console.log('Login successful, user set:', user);
      toast.success('Login successful!');
   
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      console.error('Login error:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData.email);
      const response = await authAPI.register(userData);
      const { token, user, refreshToken } = response.data.data || response.data;

      if (!token || !user || typeof user !== 'object') {
        throw new Error('Invalid register response: missing or invalid token/user');
      }

      Cookies.set('token', token, { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      Cookies.set('user', JSON.stringify(user), { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      } else {
        console.warn('No refresh token provided in register response');
      }
      setUser(user);
      console.log('Registration successful, user set:', user);
      toast.success('Registration successful!');
      router.push('/dashboard');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      console.error('Registration error:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      await authAPI.logout();
      console.log('Logout API call successful');
    } catch (error) {
      console.error('Logout error:', error.response?.data?.message || error.message);
    } finally {
      console.log('Clearing auth data');
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('refreshToken');
      setUser(null);
      router.replace('/auth/login');
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedUser) => {
    if (!updatedUser || typeof updatedUser !== 'object') {
      console.error('Invalid user data for update:', updatedUser);
      return;
    }
    console.log('Updating user:', updatedUser);
    setUser(updatedUser);
    Cookies.set('user', JSON.stringify(updatedUser), { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
  };

  useEffect(() => {
    if (!initialized) {
      console.log('Initializing auth check');
      checkAuth();
    }
  }, [initialized]);

  const value = {
    user,
    loading,
    login,
    logins,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="text-center py-16">Loading...</div> : children}
    </AuthContext.Provider>
  );
}