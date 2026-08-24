import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'usr_student_1',
    name: 'Rohan Sharma',
    email: 'student@campusnova.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    rollNo: '23CS1042',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  });
  const [token, setToken] = useState('demo_token');
  const [loading, setLoading] = useState(false);

  const switchRole = async (newRole) => {
    setLoading(true);
    try {
      const data = await api.switchRole(newRole);
      if (data.user) {
        setUser(data.user);
        setToken(data.token);
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
