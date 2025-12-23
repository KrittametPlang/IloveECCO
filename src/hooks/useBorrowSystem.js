import { useState, useCallback, useEffect } from 'react';
import { useSupabaseBorrow } from './useSupabaseBorrow';
import { useAuth } from '../context/AuthContext';

export const useBorrowSystem = () => {
  const { createBorrowRecord } = useSupabaseBorrow();
  const { user } = useAuth();
  
  // ใช้ข้อมูลจาก session ที่ login
  const [formData, setFormData] = useState({
    fullname: '',
    department: '',
    phone: ''
  });

  // Auto-fill จาก user session
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        department: user.department || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // selectedItems now stores objects: { id, code, name, icon, quantity }
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error specific to the field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Add item to the list with specified quantity
   */
  const addItem = useCallback((item, quantity) => {
    setSelectedItems(prev => {
      // Check if item already exists
      const existingIndex = prev.findIndex(i => i.id === item.id);
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      }
      
      // Add new item
      return [...prev, {
        id: item.id,
        code: item.code,
        name: item.name,
        image: item.image,
        model: item.model,
        colorCode: item.colorCode,
        season: item.season,
        location: item.location,
        quantity
      }];
    });
    
    // Clear items error if exists
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  }, [errors.items]);

  /**
   * Remove item from the list
   */
  const removeItem = useCallback((itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  /**
   * Update quantity for an item
   */
  const updateItemQuantity = useCallback((itemId, quantity) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = 'กรุณาระบุชื่อ-นามสกุล';
    if (!formData.department.trim()) newErrors.department = 'กรุณาระบุแผนก';
    if (!formData.phone.trim()) newErrors.phone = 'กรุณาระบุเบอร์โทรศัพท์';
    if (selectedItems.length === 0) newErrors.items = 'กรุณาเพิ่มรายการอย่างน้อย 1 รายการ';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // บันทึกลง Supabase
      const result = await createBorrowRecord(
        {
          fullname: formData.fullname,
          department: formData.department,
          phone: formData.phone
        },
        selectedItems
      );
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrors({ submit: result.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
      }
    } catch (err) {
      setErrors({ submit: err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    // Reset แต่ยังคงข้อมูล user จาก session
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        department: user.department || '',
        phone: user.phone || ''
      });
    } else {
      setFormData({ fullname: '', department: '', phone: '' });
    }
    setSelectedItems([]);
    setIsSubmitted(false);
    setIsLoading(false);
    setErrors({});
  };

  return {
    formData,
    selectedItems,
    isSubmitted,
    isLoading,
    errors,
    handleInputChange,
    addItem,
    removeItem,
    updateItemQuantity,
    handleSubmit,
    resetForm
  };
};