import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase';
import {
  isDevAuthEnabled,
  getDevSession,
  devLogin,
  devLogout,
} from '../devAuth';
import { AuthContext } from './authStore';

const CONFIG_ERROR =
  'Firebase is not configured. Add credentials to frontend/.env, or use dev login below.';

const useDevAuth = true;

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (useDevAuth) {
      const session = getDevSession();
      if (session) {
        setUserProfile(session);
        setIsAdmin(session.role === 'admin');
      }
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      setError(CONFIG_ERROR);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const profileData = { uid: user.uid, ...docSnap.data() };
            setUserProfile(profileData);
            setIsAdmin(profileData.role === 'admin');
          } else {
            await signOut(auth);
            setUserProfile(null);
            setIsAdmin(false);
            setError('Access denied: Profile not found in database.');
          }
        } else {
          setUserProfile(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setError('Error loading user profile.');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userProfile || useDevAuth || !auth?.currentUser) return;

    const apiBase = import.meta.env.VITE_API_BASE_URL || '';

    const trackActivity = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`${apiBase}/api/student/activity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile((prev) => ({ ...prev, dailyActivity: data.dailyActivity }));
        }
      } catch {
        /* offline or backend down */
      }
    };

    const intervalId = setInterval(trackActivity, 60000);
    return () => clearInterval(intervalId);
  }, [userProfile?.uid]);

  const login = async (email, password) => {
    if (useDevAuth) {
      try {
        setLoading(true);
        setError('');
        const profile = await devLogin(email, password);
        setUserProfile(profile);
        setIsAdmin(profile.role === 'admin');
        return profile;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    }

    if (!auth) {
      const err = new Error(CONFIG_ERROR);
      setError(err.message);
      throw err;
    }

    try {
      setLoading(true);
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const profileData = { uid: userCredential.user.uid, ...docSnap.data() };
        setUserProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
        return profileData;
      }
      await signOut(auth);
      throw new Error('Access denied: Profile not found in database.');
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password.'
          : err.code === 'auth/user-not-found'
            ? 'No account found with this email.'
            : err.code === 'auth/too-many-requests'
              ? 'Too many attempts. Please wait and try again.'
              : err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    if (useDevAuth) {
      const err = new Error('Google sign-in requires Firebase. Use email/password in dev mode.');
      setError(err.message);
      throw err;
    }
    if (!auth) {
      const err = new Error(CONFIG_ERROR);
      setError(err.message);
      throw err;
    }
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const profileData = { uid: userCredential.user.uid, ...docSnap.data() };
        setUserProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
        return profileData;
      }
      await signOut(auth);
      throw new Error('Access denied: You are not registered for this platform.');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      if (useDevAuth) {
        devLogout();
      } else if (auth) {
        await signOut(auth);
      }
      setUserProfile(null);
      setIsAdmin(false);
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
    isFirebaseConfigured,
    isDevAuth: useDevAuth,
    login,
    googleLogin,
    logout,
    setUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
