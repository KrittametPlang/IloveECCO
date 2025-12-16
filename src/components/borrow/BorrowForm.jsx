import React from 'react';
import { Package, User, Briefcase, Phone, ChevronRight } from 'lucide-react';
import ItemSearch from './ItemSearch';
import SelectedItemsList from './SelectedItemsList';
import InputField from '../common/InputField';

const BorrowForm = ({ 
  formData, 
  selectedItems, 
  errors, 
  onInputChange, 
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

      {/* Section 2: ข้อมูลผู้ยืม */}
      <div className="p-6 md:p-8 bg-gray-50/50">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
          <User size={20} className="text-gray-400" />
          ข้อมูลผู้ยืม
        </h2>

        <div className="space-y-5">
          <InputField
            label="ชื่อ - นามสกุล"
            icon={User}
            name="fullname"
            value={formData.fullname}
            onChange={onInputChange}
            placeholder="เช่น นายสมชาย ใจดี"
            error={errors.fullname}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="แผนก / ฝ่าย"
              icon={Briefcase}
              name="department"
              value={formData.department}
              onChange={onInputChange}
              placeholder="เช่น IT Support"
              error={errors.department}
            />
            <InputField
              label="เบอร์โทรศัพท์"
              icon={Phone}
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="08x-xxx-xxxx"
              type="tel"
              error={errors.phone}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 md:p-8 bg-white border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400 order-2 md:order-1">
          © 2024 Intern Project System
        </p>
        <button
          type="submit"
          className="w-full md:w-auto order-1 md:order-2 bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
        >
          ยืนยันการยืม <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default BorrowForm;