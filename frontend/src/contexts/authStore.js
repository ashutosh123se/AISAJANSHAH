import { createContext } from 'react';

export const defaultAuthState = {
  userProfile: null,
  isAdmin: false,
  loading: true,
  error: '',
  isFirebaseConfigured: false,
  isDevAuth: false,
  login: async () => {
    throw new Error('Auth is not ready. Please reload the page.');
  },
  googleLogin: async () => {
    throw new Error('Auth is not ready. Please reload the page.');
  },
  logout: async () => {},
  setUserProfile: () => {},
};

export const AuthContext = createContext(defaultAuthState);
