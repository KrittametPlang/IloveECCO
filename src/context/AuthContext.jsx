import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' | 'user' | null
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบ session ปัจจุบัน
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          setUserType('admin');
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
          setUserType('admin');
        } else {
          // ไม่ clear user session ถ้าเป็น demo หรือ user login
          if (!localStorage.getItem('demo_session') && !localStorage.getItem('user_session')) {
            setUser(null);
            setIsAuthenticated(false);
            setUserType(null);
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login ด้วย email/password (สำหรับ Supabase Auth)
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
      setUserType('admin');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login แบบ Demo สำหรับ Admin
  const loginDemo = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const mockUser = {
        id: 'demo-admin',
        email: 'admin@demo.com',
        role: 'admin',
        fullname: 'ผู้ดูแลระบบ'
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      setUserType('admin');
      localStorage.setItem('demo_session', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  };

  // Login สำหรับ User (ตรวจสอบจาก users table)
  const loginUser = async (username, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
      }

      const userInfo = {
        id: data.id,
        username: data.username,
        fullname: data.fullname,
        department: data.department,
        phone: data.phone,
        email: data.email,
        role: 'user'
      };

      setUser(userInfo);
      setIsUserAuthenticated(true);
      setUserType('user');
      localStorage.setItem('user_session', JSON.stringify(userInfo));
      return { success: true };
    } catch (error) {
      console.error('Error logging in user:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  };

  // Signup (สำหรับ Supabase Auth)
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
      // ถ้าเป็น user session
      if (localStorage.getItem('user_session')) {
        localStorage.removeItem('user_session');
        setUser(null);
        setIsUserAuthenticated(false);
        setUserType(null);
        return;
      }

      // ถ้าเป็น demo session
      if (localStorage.getItem('demo_session')) {
        localStorage.removeItem('demo_session');
        setUser(null);
        setIsAuthenticated(false);
        setUserType(null);
        return;
      }

      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setUserType(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Logout สำหรับ User เท่านั้น
  const logoutUser = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsUserAuthenticated(false);
    setUserType(null);
  };

  // ตรวจสอบ sessions เมื่อ mount
  useEffect(() => {
    // ตรวจสอบ demo session (admin)
    const demoSession = localStorage.getItem('demo_session');
    if (demoSession && !user) {
      try {
        const demoUser = JSON.parse(demoSession);
        setUser(demoUser);
        setIsAuthenticated(true);
        setUserType('admin');
      } catch (e) {
        localStorage.removeItem('demo_session');
      }
    }

    // ตรวจสอบ user session
    const userSession = localStorage.getItem('user_session');
    if (userSession && !user) {
      try {
        const userData = JSON.parse(userSession);
        setUser(userData);
        setIsUserAuthenticated(true);
        setUserType('user');
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user,
      userType,
      isAuthenticated,
      isUserAuthenticated,
      isLoading, 
      login,
      loginDemo,
      loginUser,
      signUp,
      logout,
      logoutUser
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
