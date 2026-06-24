import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));

  const setToken = (nextToken) => {
    setTokenState(nextToken);
    if (nextToken) localStorage.setItem('token', nextToken);
    else localStorage.removeItem('token');
  };

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res?.data?.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch {
        setUser(null);
        setToken(null);
      }
    };

    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(() => {
    return {
      user,
      token,
      setToken,
      setUser,
      isAuthenticated: Boolean(token),
    };
  }, [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


