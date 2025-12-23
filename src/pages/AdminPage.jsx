import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSupabaseShoes } from '../hooks/useSupabaseShoes';
import { useSupabaseBorrow } from '../hooks/useSupabaseBorrow';
import ShoeForm from '../components/admin/ShoeForm';
import UserManagement from '../components/admin/UserManagement';
import { 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  Package,
  ArrowLeft,
  RefreshCw,
  Search,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Calendar,
  MapPin,
  ClipboardList,
  Users
} from 'lucide-react';

const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { shoes, loading, error, fetchShoes, addShoe, updateShoe, deleteShoe } = useSupabaseShoes();
  const { records, loading: borrowLoading, fetchRecords, getReturnedRecords } = useSupabaseBorrow();
  
  const [activeTab, setActiveTab] = useState('shoes');
  const [showForm, setShowForm] = useState(false);
  const [editingShoe, setEditingShoe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const returnedRecords = getReturnedRecords();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddClick = () => {
    setEditingShoe(null);
    setShowForm(true);
  };

  const handleEditClick = (shoe) => {
    setEditingShoe(shoe);
    setShowForm(true);
  };

  const handleSave = async (shoeData) => {
    setActionLoading(true);
    if (editingShoe) {
      await updateShoe(editingShoe.id, shoeData);
    } else {
      await addShoe(shoeData);
    }
    setActionLoading(false);
    setShowForm(false);
    setEditingShoe(null);
  };

  const handleDeleteClick = (shoe) => {
    setDeleteConfirm(shoe);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      setActionLoading(true);
      await deleteShoe(deleteConfirm.id);
      setActionLoading(false);
      setDeleteConfirm(null);
    }
  };

  const filteredShoes = shoes.filter(shoe => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      shoe.code?.toLowerCase().includes(q) ||
      shoe.name?.toLowerCase().includes(q) ||
      shoe.model?.includes(q) ||
      shoe.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">จัดการรายการรองเท้า (Supabase)</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('shoes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'shoes'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Package size={18} />
            จัดการรองเท้า
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'returned'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ClipboardList size={18} />
            รายการคืนแล้ว ({returnedRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Users size={18} />
            จัดการผู้ใช้
          </button>
        </div>

        {activeTab === 'shoes' && (
        <>        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหารองเท้า..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
            />
          </div>
          
          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={fetchShoes}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              เพิ่มรองเท้า
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">รองเท้าทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">{shoes.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">จำนวนรวม</p>
            <p className="text-2xl font-bold text-gray-900">
              {shoes.reduce((sum, s) => sum + (s.maxQty || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 col-span-2 md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">สถานะ</p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                เชื่อมต่อ Supabase
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" size={32} />
              <span className="ml-3 text-gray-500">กำลังโหลด...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">รูป</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">รหัส</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">รุ่น</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">ตำแหน่ง</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">จำนวน</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredShoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                        {searchQuery ? 'ไม่พบรองเท้าที่ค้นหา' : 'ยังไม่มีรายการรองเท้า'}
                      </td>
                    </tr>
                  ) : (
                    filteredShoes.map((shoe) => (
                      <tr key={shoe.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {shoe.image ? (
                              <img
                                src={shoe.image}
                                alt={shoe.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="text-gray-400" size={20} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {shoe.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{shoe.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{shoe.model}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm text-gray-600">{shoe.model}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-sm text-gray-600">{shoe.location}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                            {shoe.maxQty}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditClick(shoe)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="แก้ไข"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(shoe)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="ลบ"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        )}

        {/* Returned Items Section */}
        {activeTab === 'returned' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardList size={20} />
                    รายการที่คืนแล้ว
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">ทั้งหมด {returnedRecords.length} รายการ</p>
                </div>
                <button
                  onClick={fetchRecords}
                  disabled={borrowLoading}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <RefreshCw size={20} className={borrowLoading ? 'animate-spin text-gray-400' : 'text-gray-500'} />
                </button>
              </div>
            </div>

            {borrowLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-gray-400" size={32} />
                <span className="ml-3 text-gray-500">กำลังโหลด...</span>
              </div>
            ) : returnedRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ClipboardList size={48} className="mx-auto mb-3 opacity-50" />
                <p>ยังไม่มีรายการที่คืนแล้ว</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {returnedRecords.map((record) => (
                  <ReturnedRecordCard key={record.id} record={record} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Management Section */}
        {activeTab === 'users' && (
          <UserManagement />
        )}
      </main>

      {/* Shoe Form Modal */}
      {showForm && (
        <ShoeForm
          shoe={editingShoe}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingShoe(null);
          }}
          loading={actionLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการลบ</h3>
              <p className="text-gray-500 text-sm mb-6">
                คุณต้องการลบ "{deleteConfirm.name}" ใช่หรือไม่?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    'ลบ'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Format date to Thai locale
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Returned Record Card Component
const ReturnedRecordCard = ({ record }) => {
  const totalItems = record.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <div className="rounded-xl border bg-gray-50 border-gray-200 overflow-hidden">
      {/* Borrower Info Header */}
      <div className="p-4 bg-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="font-semibold">{record.borrower?.fullname || 'ไม่ระบุชื่อ'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-80">
            <span>{record.borrower?.department || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} />
            <span>{record.borrower?.phone || '-'}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm opacity-80">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>ยืม: {formatDate(record.borrowDate)}</span>
          </div>
          {record.returnDate && (
            <div className="flex items-center gap-1 text-green-700">
              <Calendar size={14} />
              <span>คืน: {formatDate(record.returnDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-2">รายการที่ยืม ({totalItems} ชิ้น)</p>
        {record.items && record.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {record.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-md border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                    <Package size={16} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name || 'ไม่ระบุชื่อ'}</p>
                  <p className="text-xs text-gray-500">{item.code || '-'}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-600">x{item.quantity || 1}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">ไม่มีรายการ</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
