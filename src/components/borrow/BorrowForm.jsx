import React from 'react';
import { Package, User, Briefcase, Phone, ChevronRight, CheckCircle } from 'lucide-react';
import ItemSearch from './ItemSearch';
import SelectedItemsList from './SelectedItemsList';

const BorrowForm = ({ 
  formData, 
  selectedItems, 
  errors, 
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Section 1: ค้นหาและเลือกของ */}
      <div className="p-6 md:p-8 border-b border-gray-100">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Package size={20} className="text-gray-400" />
          ค้นหาและเลือกรองเท้าที่ต้องการยืม
        </h2>
        
        {errors.items && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded px-3 border border-red-100">
            ⚠️ {errors.items}
          </p>
        )}

        {/* Item Search Component */}
        <ItemSearch 
          selectedItems={selectedItems}
          onAddItem={onAddItem}
        />

        {/* Selected Items List */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <SelectedItemsList 
            items={selectedItems}
            onRemove={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
          />
        </div>
      </div>

      {/* Section 2: ข้อมูลผู้ยืม (แสดงแบบ Read-only) */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <User size={20} className="text-indigo-500" />
          ข้อมูลผู้ยืม
          <span className="text-xs font-normal text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full ml-2">
            <CheckCircle size={12} className="inline mr-1" />
            ดึงจากระบบแล้ว
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ชื่อ-นามสกุล */}
          <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <User size={14} />
              ชื่อ-นามสกุล
            </div>
            <p className="font-semibold text-gray-900">
              {formData.fullname || '-'}
            </p>
          </div>

          {/* แผนก */}
          <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Briefcase size={14} />
              แผนก/ฝ่าย
            </div>
            <p className="font-semibold text-gray-900">
              {formData.department || '-'}
            </p>
          </div>

          {/* เบอร์โทร */}
          <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Phone size={14} />
              เบอร์โทรศัพท์
            </div>
            <p className="font-semibold text-gray-900">
              {formData.phone || '-'}
            </p>
          </div>
        </div>

        {/* Warning if missing data */}
        {(!formData.fullname || !formData.department || !formData.phone) && (
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
            ⚠️ ข้อมูลบางส่วนยังไม่ครบ กรุณาติดต่อ Admin เพื่ออัพเดทข้อมูลของคุณ
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 md:p-8 bg-white border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400 order-2 md:order-1">
          © 2024 Intern Project System
        </p>
        <button
          type="submit"
          disabled={!formData.fullname || !formData.department || !formData.phone}
          className="w-full md:w-auto order-1 md:order-2 bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
        >
          ยืนยันการยืม <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default BorrowForm;