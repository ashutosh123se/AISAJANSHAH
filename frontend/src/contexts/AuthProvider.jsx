import React, { useState, useEffect } from 'react';
import {
  isDevAuthEnabled,
  getDevSession,
  devLogin,
  devLogout,
  updateLocalSession,
} from '../devAuth';
import { AuthContext } from './authStore';

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfileState] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const setUserProfile = (profile) => {
    setUserProfileState(profile);
    if (profile) {
      updateLocalSession(profile);
      setIsAdmin(profile.role === 'admin');
    }
  };

  useEffect(() => {
    const session = getDevSession();
    if (session) {
      setUserProfileState(session);
      setIsAdmin(session.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      const profile = await devLogin(email, password);
      setUserProfileState(profile);
      setIsAdmin(profile.role === 'admin');
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    const err = new Error('Google sign-in is not available. Please use email and password.');
    setError(err.message);
    throw err;
  };

  const logout = async () => {
    try {
      setLoading(true);
      devLogout();
      setUserProfileState(null);
      setIsAdmin(false);
      setError('');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userProfile,
    isAdmin,
    loading,
    error,
    login,
    googleLogin,
    logout,
    setUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
