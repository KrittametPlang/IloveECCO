import React, { useState } from 'react';
import { User, Phone, Calendar, MapPin, Package, Loader2, RefreshCw, RotateCcw, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSupabaseBorrow } from '../../hooks/useSupabaseBorrow';

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

const BorrowedList = () => {
  const { records, loading, error, fetchRecords, getBorrowedRecords, getReturnedRecords, returnItemsWithPhoneVerify } = useSupabaseBorrow();
  
  // Modal states
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState('');
  const [returnSuccess, setReturnSuccess] = useState(false);
  
  const borrowedRecords = getBorrowedRecords();
  const returnedRecords = getReturnedRecords();

  // Handle return button click
  const handleReturnClick = (record) => {
    setSelectedRecord(record);
    setPhoneInput('');
    setReturnError('');
    setReturnSuccess(false);
    setShowReturnModal(true);
  };

  // Handle return confirmation
  const handleConfirmReturn = async () => {
    if (!selectedRecord) return;
    
    setReturnLoading(true);
    setReturnError('');
    
    const result = await returnItemsWithPhoneVerify(selectedRecord.id, phoneInput);
    
    setReturnLoading(false);
    
    if (result.success) {
      setReturnSuccess(true);
      // รอให้ข้อมูลรีเฟรชเสร็จก่อนปิด modal
      await fetchRecords();
      setTimeout(() => {
        setShowReturnModal(false);
        setReturnSuccess(false);
        setSelectedRecord(null);
      }, 1000);
    } else {
      setReturnError(result.error || 'เกิดข้อผิดพลาด');
    }
  };

  // Close modal
  const closeModal = () => {
    setShowReturnModal(false);
    setSelectedRecord(null);
    setPhoneInput('');
    setReturnError('');
    setReturnSuccess(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-gray-400 mb-3" size={32} />
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package size={24} className="text-gray-600" />
                รายการที่ถูกยืม
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                ทั้งหมด {records.length} รายการ | 
                กำลังยืม {borrowedRecords.length} | 
                คืนแล้ว {returnedRecords.length}
              </p>
            </div>
            <button
              onClick={fetchRecords}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="รีเฟรช"
            >
              <RefreshCw size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Supabase Badge */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              ข้อมูลจาก Supabase
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Currently Borrowed Section */}
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
            กำลังยืมอยู่
          </h3>
          
          {borrowedRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package size={40} className="mx-auto mb-2 opacity-50" />
              <p>ยังไม่มีรายการที่กำลังยืม</p>
            </div>
          ) : (
            <div className="space-y-4">
              {borrowedRecords.map((record) => (
                <RecordCard 
                  key={record.id} 
                  record={record} 
                  onReturn={() => handleReturnClick(record)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Returned Section */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            คืนแล้ว
          </h3>
          
          {returnedRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>ยังไม่มีรายการที่คืนแล้ว</p>
            </div>
          ) : (
            <div className="space-y-4">
              {returnedRecords.map((record) => (
                <RecordCard key={record.id} record={record} isReturned />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Return Confirmation Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <RotateCcw size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">ยืนยันการคืนของ</h3>
                    <p className="text-sm text-gray-500">กรุณากรอกเบอร์โทรเพื่อยืนยัน</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {returnSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle2 size={48} className="mx-auto text-green-500 mb-3" />
                  <p className="text-lg font-semibold text-green-700">คืนของสำเร็จ!</p>
                </div>
              ) : (
                <>
                  {/* Borrower Info */}
                  {selectedRecord && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">ผู้ยืม</p>
                      <p className="font-semibold text-gray-800">{selectedRecord.borrower?.fullname || 'ไม่ระบุ'}</p>
                      <p className="text-sm text-gray-500">{selectedRecord.borrower?.department || '-'}</p>
                    </div>
                  )}

                  {/* Phone Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      เบอร์โทรศัพท์ผู้ยืม
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => {
                        setPhoneInput(e.target.value);
                        setReturnError('');
                      }}
                      placeholder="กรอกเบอร์โทรศัพท์เพื่อยืนยัน"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg tracking-wider"
                      maxLength={15}
                    />
                  </div>

                  {/* Error Message */}
                  {returnError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                      <p className="text-red-600 text-sm">{returnError}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={returnLoading}
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmReturn}
                      disabled={returnLoading || !phoneInput.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {returnLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          กำลังดำเนินการ...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          ยืนยันคืนของ
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RecordCard = ({ record, isReturned = false, onReturn }) => {
  const totalItems = record.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <div className={`rounded-xl border ${isReturned ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'} overflow-hidden`}>
      {/* Borrower Info Header */}
      <div className={`p-4 ${isReturned ? 'bg-gray-200' : 'bg-gray-800 text-white'}`}>
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
            <div className="flex items-center gap-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {record.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                    <Package size={20} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name || 'ไม่ระบุชื่อ'}</p>
                  <p className="text-xs text-gray-500">
                    {item.code || '-'} | รุ่น {item.model || '-'}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={10} />
                    <span>{item.location || '-'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">x{item.quantity || 1}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">ไม่มีรายการ</p>
        )}

        {/* Return Button - Only show for borrowed items */}
        {!isReturned && onReturn && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={onReturn}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              <RotateCcw size={18} />
              คืนของ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedList;
