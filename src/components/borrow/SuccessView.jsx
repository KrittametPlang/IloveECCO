import React from 'react';
import { CheckCircle, RefreshCcw } from 'lucide-react';

const SuccessView = ({ formData, selectedItems, onReset }) => {
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/20">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-black">บันทึกข้อมูลสำเร็จ!</h2>
        <p className="text-gray-500 mb-8">ระบบได้บันทึกการยืมรองเท้าตัวอย่างของคุณเรียบร้อยแล้ว</p>
        
        <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">สรุปรายการ</h3>
          <p className="font-bold text-lg mb-1">{formData.fullname}</p>
          <p className="text-sm text-gray-600 mb-4">แผนก: {formData.department}</p>
          <div className="border-t border-gray-200 pt-3">
            <p className="text-sm font-medium mb-3">รองเท้าตัวอย่างที่ยืม ({totalItems} ชิ้น):</p>
            <div className="space-y-3">
              {selectedItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.code} | รุ่น {item.model} | สี {item.colorCode}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.season} | ตำแหน่ง {item.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-gray-900">x{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 duration-200 cursor-pointer"
        >
          <RefreshCcw size={18} />
          ทำรายการใหม่
        </button>
      </div>
    </div>
  );
};

export default SuccessView;