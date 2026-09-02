import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 'usr_student_1',
  name: 'Rohan Sharma',
  email: 'student@campusnova.edu',
  role: 'student',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  rollNo: '23CS1042',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  phone: '+91 98765 43210',
  bio: 'Final-year CSE student exploring Generative AI and IoT edge computing.'
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      const cached = localStorage.getItem('campusnova_user');
      return cached ? JSON.parse(cached) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('campusnova_token') || 'demo_token';
    } catch {
      return 'demo_token';
    }
  });

  const [loading, setLoading] = useState(false);

  // Wrapper for setUser that guarantees localStorage persistence
  const setUser = (updatedUserData) => {
    setUserState(prev => {
      const merged = typeof updatedUserData === 'function' ? updatedUserData(prev) : { ...prev, ...updatedUserData };
      try {
        localStorage.setItem('campusnova_user', JSON.stringify(merged));
      } catch (err) {
        console.error('Failed to save user to localStorage:', err);
      }
      return merged;
    });
  };

  // Sync latest persisted user data from backend database on mount
  useEffect(() => {
    let isMounted = true;
    const syncProfileWithServer = async () => {
      if (user?.id) {
        try {
          const fresh = await api.getProfile(user.id);
          if (isMounted && fresh && fresh.id) {
            setUserState(fresh);
            localStorage.setItem('campusnova_user', JSON.stringify(fresh));
          }
        } catch (err) {
          console.warn('Backend sync: using local cached profile');
        }
      }
    };
    syncProfileWithServer();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const switchRole = async (newRole) => {
    setLoading(true);
    try {
      const data = await api.switchRole(newRole);
      if (data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('campusnova_token', data.token);
      }
    } catch (err) {
      console.error('Error switching role:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
