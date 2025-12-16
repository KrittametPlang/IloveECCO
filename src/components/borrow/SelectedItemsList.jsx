import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

const SelectedItemsList = ({ items, onRemove, onUpdateQuantity }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">ยังไม่มีรายการที่เลือก</p>
        <p className="text-xs mt-1">กรุณาพิมพ์รหัสสินค้าด้านบนเพื่อเพิ่มรายการ</p>
      </div>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">
          รายการที่เลือก ({items.length} รายการ, {totalItems} ชิ้น)
        </h3>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-gray-200 transition-all"
          >
            {/* Product Image */}
            <img 
              src={item.image} 
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{item.name}</p>
              <div className="text-xs text-gray-500 space-y-0.5 mt-1">
                <p>รหัส: {item.code} | รุ่น: {item.model}</p>
                <p>สี: {item.colorCode} | {item.season} | {item.location}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="ลบรายการ"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedItemsList;
