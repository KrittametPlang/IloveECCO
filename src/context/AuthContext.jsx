import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบ session ปัจจุบัน
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // ฟังการเปลี่ยนแปลง auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login ด้วย email/password
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login แบบ Demo (ไม่ต้องใช้ Supabase Auth - สำหรับทดสอบ)
  const loginDemo = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      // สร้าง mock user สำหรับ demo
      const mockUser = {
        id: 'demo-admin',
        email: 'admin@demo.com',
        role: 'admin'
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('demo_session', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  };

  // Signup
  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // ถ้าเป็น demo session
      if (localStorage.getItem('demo_session')) {
        localStorage.removeItem('demo_session');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // ตรวจสอบ demo session เมื่อ mount
  useEffect(() => {
    const demoSession = localStorage.getItem('demo_session');
    if (demoSession && !user) {
      try {
        const demoUser = JSON.parse(demoSession);
        setUser(demoUser);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('demo_session');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user,
      isAuthenticated, 
      isLoading, 
      login,
      loginDemo,
      signUp,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
