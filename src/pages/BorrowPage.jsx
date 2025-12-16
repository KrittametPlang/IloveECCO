import React from 'react';
import { useBorrowSystem } from '../hooks/useBorrowSystem';
import ItemCard from '../components/ItemCard';
import { Package, User, CheckCircle, Loader } from 'lucide-react';

const BorrowPage = () => {
  // เรียกใช้ Logic จาก Hook (Code สะอาดขึ้นมาก)
  const { 
    items, loading, submitLoading, isSubmitted, 
    formData, errors, selectedItems, 
    handleInputChange, toggleItemSelection, submitForm, resetForm 
  } = useBorrowSystem();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (isSubmitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-xl shadow-xl">
        <CheckCircle size={64} className="mx-auto mb-4 text-black" />
        <h2 className="text-2xl font-bold">บันทึกสำเร็จ!</h2>
        <button onClick={resetForm} className="mt-6 px-6 py-2 bg-black text-white rounded-lg">ทำรายการใหม่</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">ระบบยืมคืน</h1>
        
        <form onSubmit={submitForm} className="bg-white rounded-2xl shadow-xl p-6">
          {/* ส่วนแสดงรายการของ */}
          <div className="mb-8">
            <h2 className="flex items-center gap-2 font-bold mb-4"><Package /> เลือกของ</h2>
            {errors.items && <p className="text-red-500 text-sm mb-2">{errors.items}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  isSelected={selectedItems.includes(item.id)} 
                  onToggle={toggleItemSelection} 
                />
              ))}
            </div>
          </div>

          {/* ส่วนฟอร์ม (ย่อ) */}
          <div className="mb-8">
             <h2 className="flex items-center gap-2 font-bold mb-4"><User /> ข้อมูลผู้ยืม</h2>
             <input 
               name="fullname" 
               value={formData.fullname} 
               onChange={handleInputChange}
               placeholder="ชื่อ-นามสกุล"
               className="w-full p-3 border rounded-lg mb-4"
             />
             {/* ... ใส่ Input อื่นๆ ตามต้องการ ... */}
          </div>

          <button type="submit" disabled={submitLoading} className="w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800">
            {submitLoading ? 'กำลังบันทึก...' : 'ยืนยันการยืม'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BorrowPage;