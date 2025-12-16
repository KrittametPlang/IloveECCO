import React from 'react';

const InputField = ({ 
  label, 
  icon: Icon, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  error 
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={18} className="text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200'}`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default InputField;