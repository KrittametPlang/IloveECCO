import React from 'react';
import { CheckCircle } from 'lucide-react';

const ItemCard = ({ item, isSelected, onToggle }) => (
  <label 
    className={`
      relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group select-none
      ${isSelected 
        ? 'border-black bg-gray-50 shadow-sm' 
        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}
    `}
  >
    <input 
      type="checkbox"
      className="peer sr-only"
      checked={isSelected}
      onChange={() => onToggle(item.id)}
    />
    <div className={`
      w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors shrink-0
      ${isSelected ? 'bg-black border-black' : 'border-gray-300 bg-white'}
    `}>
      {isSelected && <CheckCircle size={14} className="text-white" />}
    </div>
    <span className="text-2xl mr-3 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
    <span className={`font-medium ${isSelected ? 'text-black' : 'text-gray-600'}`}>
      {item.name}
    </span>
  </label>
);

export default ItemCard;