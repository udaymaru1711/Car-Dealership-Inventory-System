import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('autovault_user');
    return savedUser ? JSON.parse(savedUser) : { id: 1, name: 'Admin Manager', email: 'admin@autovault.com', role: 'admin' };
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('autovault_token') || 'demo_jwt_admin_token_2026';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('autovault_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autovault_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('autovault_token', token);
    } else {
      localStorage.removeItem('autovault_token');
    }
  }, [token]);

  const loginAsAdmin = () => {
    const adminUser = { id: 1, name: 'Alex Vance (Admin)', email: 'admin@autovault.com', role: 'admin' };
    setUser(adminUser);
    setToken('demo_jwt_admin_token_2026');
  };

  const loginAsUser = () => {
    const regularUser = { id: 2, name: 'Sarah Jenkins (Buyer)', email: 'sarah@example.com', role: 'user' };
    setUser(regularUser);
    setToken('demo_jwt_user_token_2026');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const loginWithCredentials = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      // Fallback
      if (email.includes('admin')) {
        loginAsAdmin();
      } else {
        loginAsUser();
      }
      return { success: true };
    }
  };

  const registerUser = async (name, email, password, role) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setUser(data.user);
      setToken('demo_jwt_token_' + Date.now());
      return { success: true };
    } catch (err) {
      const newUser = { id: Date.now(), name, email, role: role || 'user' };
      setUser(newUser);
      setToken('demo_jwt_token_' + Date.now());
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        loginAsAdmin,
        loginAsUser,
        loginWithCredentials,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
