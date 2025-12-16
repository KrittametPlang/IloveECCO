import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, LogIn, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="mb-8">
      {/* Top Bar with Login */}
      <div className="flex justify-end mb-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              <Settings size={16} />
              จัดการระบบ
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm"
            >
              <LogOut size={16} />
              ออกจากระบบ
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            <LogIn size={16} />
            Admin Login
          </button>
        )}
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-4 border border-gray-200">
          <ClipboardList className="text-black" size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-black mb-2">
          โปรเจ็คยืมคืน<span className="text-gray-400">เด็กฝึกงาน</span>
        </h1>
        <p className="text-gray-500 text-sm">กรอกข้อมูลให้ครบถ้วนเพื่อทำการเบิก-ยืมอุปกรณ์</p>
      </div>
    </header>
  );
};

export default Header;
