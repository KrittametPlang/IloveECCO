import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useSupabaseShoes } from '../../hooks/useSupabaseShoes';

const ItemSearch = ({ selectedItems, onAddItem }) => {
  const { shoes, loading } = useSupabaseShoes();
  const [searchCode, setSearchCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [foundItem, setFoundItem] = useState(null);
  const [error, setError] = useState('');

  // ค้นหา shoe จาก code
  const findItemByCode = (code) => {
    if (!code || !shoes.length) return null;
    return shoes.find(
      item => item.code.toLowerCase() === code.toLowerCase().trim()
    );
  };

  const handleSearch = (code) => {
    setSearchCode(code);
    setError('');
    
    if (code.trim().length >= 3) {
      const item = findItemByCode(code);
      setFoundItem(item);
    } else {
      setFoundItem(null);
    }
  };

  const handleAddItem = () => {
    if (!foundItem) {
      setError('รหัสนี้ถูกยืมไปแล้วก่อนหน้า');
      return;
    }

    if (quantity < 1) {
      setError('จำนวนต้องมากกว่า 0');
      return;
    }

    // ตรวจสอบจำนวนคงเหลือ (availableQty)
    const available = foundItem.availableQty ?? foundItem.maxQty;
    if (available <= 0) {
      setError('ของหมดแล้ว ไม่สามารถยืมได้');
      return;
    }

    if (quantity > available) {
      setError(`คงเหลือ ${available} ชิ้น (จากทั้งหมด ${foundItem.maxQty} ชิ้น)`);
      return;
    }

    // Check if already added
    const alreadyAdded = selectedItems.find(item => item.id === foundItem.id);
    if (alreadyAdded) {
      setError('รายการนี้ถูกเพิ่มไปแล้ว');
      return;
    }

    onAddItem(foundItem, quantity);
    
    // Reset form
    setSearchCode('');
    setQuantity(1);
    setFoundItem(null);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รหัสรองเท้าตัวอย่าง
          </label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => handleSearch(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="พิมพ์รหัส เช่น SKU001"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
            />
          </div>
        </div>

        <div className="w-full md:w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            จำนวน
          </label>
          <input
            type="number"
            min="1"
            max={foundItem?.maxQty || 99}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-center"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddItem}
            disabled={!foundItem}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              foundItem
                ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus size={18} />
            เพิ่ม
          </button>
        </div>
      </div>

      {/* Found Item Preview */}
      {foundItem && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4 animate-fadeIn">
          <img 
            src={foundItem.image} 
            alt={foundItem.name}
            className="w-20 h-20 object-cover rounded-lg border border-green-200"
          />
          <div className="flex-1">
            <p className="font-semibold text-green-800">{foundItem.name}</p>
            <div className="text-sm text-green-600 mt-1 space-y-0.5">
              <p>รหัส: {foundItem.code} | รุ่น: {foundItem.model}</p>
              <p>เลขสี: {foundItem.colorCode} | ซีซั่น: {foundItem.season}</p>
              <p>ตำแหน่ง: {foundItem.location} | ยืมได้สูงสุด: {foundItem.maxQty} ชิ้น</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-600">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Available Items Grid */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-800 mb-3">
          รายการรองเท้าตัวอย่างที่มีในระบบ {loading && <Loader2 size={14} className="inline animate-spin ml-1" />}:
        </p>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-blue-400" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {shoes.map((item) => {
              const available = item.availableQty ?? item.maxQty;
              const isOutOfStock = available <= 0;
              
              return (
                <div 
                  key={item.code}
                  onClick={() => !isOutOfStock && handleSearch(item.code)}
                  className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                    isOutOfStock 
                      ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-blue-200 cursor-pointer hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className={`w-12 h-12 object-cover rounded-md ${isOutOfStock ? 'grayscale' : ''}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isOutOfStock ? 'text-gray-500' : 'text-blue-700'}`}>
                      {item.code}
                    </p>
                    <p className={`text-xs truncate ${isOutOfStock ? 'text-gray-400' : 'text-blue-600'}`}>
                      {item.model}
                    </p>
                    <p className={`text-xs ${isOutOfStock ? 'text-red-400' : 'text-green-600'}`}>
                      {isOutOfStock ? 'หมด' : `เหลือ ${available}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemSearch;
