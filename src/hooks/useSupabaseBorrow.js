import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseBorrow = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดรายการยืมทั้งหมด
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ดึงข้อมูลจาก borrow_records พร้อม borrower และ items
      const { data: borrowData, error: fetchError } = await supabase
        .from('borrow_records')
        .select(`
          *,
          borrower:borrowers(*),
          items:borrow_items(
            *,
            shoe:shoes(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // แปลงข้อมูลให้ตรงกับ format เดิม
      const mappedData = borrowData.map(record => ({
        id: record.id,
        borrower: {
          fullname: record.borrower?.fullname || '',
          department: record.borrower?.department || '',
          phone: record.borrower?.phone || ''
        },
        items: record.items?.map(item => ({
          id: item.shoe?.id,
          code: item.shoe?.code,
          name: item.shoe?.name,
          model: item.shoe?.model,
          location: item.shoe?.location,
          image: item.shoe?.image_url,
          quantity: item.quantity
        })) || [],
        borrowDate: record.borrow_date,
        returnDate: record.actual_return_date,
        status: record.status
      }));

      setRecords(mappedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching borrow records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // สร้างรายการยืมใหม่
  const createBorrowRecord = async (borrowerInfo, items) => {
    try {
      setError(null);

      // 1. สร้าง borrower
      const { data: borrower, error: borrowerError } = await supabase
        .from('borrowers')
        .insert({
          fullname: borrowerInfo.fullname,
          department: borrowerInfo.department,
          phone: borrowerInfo.phone
        })
        .select()
        .single();

      if (borrowerError) throw borrowerError;

      // 2. สร้าง borrow record
      const { data: record, error: recordError } = await supabase
        .from('borrow_records')
        .insert({
          borrower_id: borrower.id,
          borrow_date: new Date().toISOString().split('T')[0],
          status: 'borrowed'
        })
        .select()
        .single();

      if (recordError) throw recordError;

      // 3. สร้าง borrow items
      const borrowItems = items.map(item => ({
        borrow_record_id: record.id,
        shoe_id: item.id,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('borrow_items')
        .insert(borrowItems);

      if (itemsError) throw itemsError;

      // 4. อัพเดท current_qty ของ shoes (เพิ่มจำนวนที่ถูกยืม)
      for (const item of items) {
        const { error: updateQtyError } = await supabase
          .rpc('increment_shoe_qty', { 
            shoe_id: item.id, 
            qty: item.quantity 
          });
        
        // ถ้าไม่มี RPC function ให้ใช้ update แบบ manual
        if (updateQtyError) {
          // Fallback: ดึง current_qty แล้วอัพเดท
          const { data: shoe } = await supabase
            .from('shoes')
            .select('current_qty')
            .eq('id', item.id)
            .single();
          
          await supabase
            .from('shoes')
            .update({ current_qty: (shoe?.current_qty || 0) + item.quantity })
            .eq('id', item.id);
        }
      }

      await fetchRecords();
      return { success: true, recordId: record.id };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // คืนของ
  const returnItems = async (recordId) => {
    try {
      setError(null);

      // 1. ดึงข้อมูล items ที่ต้องคืน
      const { data: borrowItems, error: fetchItemsError } = await supabase
        .from('borrow_items')
        .select('shoe_id, quantity')
        .eq('borrow_record_id', recordId);

      if (fetchItemsError) throw fetchItemsError;

      // 2. อัพเดทสถานะเป็น returned
      const { error: updateError } = await supabase
        .from('borrow_records')
        .update({
          actual_return_date: new Date().toISOString().split('T')[0],
          status: 'returned'
        })
        .eq('id', recordId);

      if (updateError) throw updateError;

      // 3. ลด current_qty ของ shoes (คืนจำนวนที่ยืมไป)
      for (const item of borrowItems) {
        const { data: shoe } = await supabase
          .from('shoes')
          .select('current_qty')
          .eq('id', item.shoe_id)
          .single();
        
        const newQty = Math.max(0, (shoe?.current_qty || 0) - item.quantity);
        await supabase
          .from('shoes')
          .update({ current_qty: newQty })
          .eq('id', item.shoe_id);
      }

      await fetchRecords();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // คืนของพร้อมยืนยันเบอร์โทร
  const returnItemsWithPhoneVerify = async (recordId, inputPhone) => {
    try {
      setError(null);

      // 1. ดึงข้อมูล borrower เพื่อตรวจสอบเบอร์โทร
      const { data: record, error: fetchRecordError } = await supabase
        .from('borrow_records')
        .select(`
          borrower:borrowers(phone)
        `)
        .eq('id', recordId)
        .single();

      if (fetchRecordError) throw fetchRecordError;

      // 2. ตรวจสอบเบอร์โทร
      const borrowerPhone = record.borrower?.phone?.replace(/\D/g, '') || '';
      const cleanInputPhone = inputPhone?.replace(/\D/g, '') || '';

      if (!cleanInputPhone) {
        return { success: false, error: 'กรุณากรอกเบอร์โทรศัพท์' };
      }

      if (borrowerPhone !== cleanInputPhone) {
        return { success: false, error: 'เบอร์โทรศัพท์ไม่ตรงกับข้อมูลผู้ยืม' };
      }

      // 3. ดำเนินการคืนของ
      return await returnItems(recordId);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ดึงเฉพาะรายการที่ยังยืมอยู่
  const getBorrowedRecords = () => {
    return records.filter(r => r.status === 'borrowed');
  };

  // ดึงเฉพาะรายการที่คืนแล้ว
  const getReturnedRecords = () => {
    return records.filter(r => r.status === 'returned');
  };

  return {
    records,
    loading,
    error,
    fetchRecords,
    createBorrowRecord,
    returnItems,
    returnItemsWithPhoneVerify,
    getBorrowedRecords,
    getReturnedRecords
  };
};
