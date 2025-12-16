import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useBorrowSystem } from './hooks/useBorrowSystem';
import Header from './components/borrow/Header';
import BorrowForm from './components/borrow/BorrowForm';
import SuccessView from './components/borrow/SuccessView';
import BorrowedList from './components/borrow/BorrowedList';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { ClipboardList, PlusCircle } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Home Page Component
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('borrow');
  
  const {
    formData,
    selectedItems,
    isSubmitted,
    errors,
    handleInputChange,
    addItem,
    removeItem,
    updateItemQuantity,
    handleSubmit,
    resetForm
  } = useBorrowSystem();

  if (isSubmitted) {
    return (
      <SuccessView 
        formData={formData} 
        selectedItems={selectedItems} 
        onReset={resetForm} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        <Header />
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'borrow'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <PlusCircle size={18} />
            ยืมรองเท้าตัวอย่าง
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ClipboardList size={18} />
            รายการที่ยืม
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'borrow' && (
          <BorrowForm 
            formData={formData}
            selectedItems={selectedItems}
            errors={errors}
            onInputChange={handleInputChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateItemQuantity}
            onSubmit={handleSubmit}
          />
        )}
        
        {activeTab === 'list' && (
          <BorrowedList />
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;