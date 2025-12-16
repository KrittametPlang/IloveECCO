import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseShoes = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดรองเท้าทั้งหมด
  const fetchShoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('shoes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      // แปลง column names จาก snake_case เป็น camelCase สำหรับ frontend
      const mappedData = data.map(shoe => ({
        id: shoe.id,
        code: shoe.code,
        name: shoe.name,
        model: shoe.model,
        colorCode: shoe.color_code,
        season: shoe.season,
        location: shoe.location,
        maxQty: shoe.max_qty,
        currentQty: shoe.current_qty || 0,
        availableQty: (shoe.max_qty || 0) - (shoe.current_qty || 0), // จำนวนที่ยืมได้
        image: shoe.image_url,
        isActive: shoe.is_active
      }));
      
      setShoes(mappedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching shoes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // โหลดข้อมูลเมื่อ mount
  useEffect(() => {
    fetchShoes();
  }, [fetchShoes]);

  // เพิ่มรองเท้าใหม่
  const addShoe = async (shoeData) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('shoes')
        .insert({
          code: shoeData.code,
          name: shoeData.name,
          model: shoeData.model || null,
          color_code: shoeData.colorCode || null,
          season: shoeData.season || null,
          location: shoeData.location || null,
          max_qty: shoeData.maxQty || 1,
          image_url: shoeData.image || null
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      await fetchShoes(); // รีเฟรชข้อมูล
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // แก้ไขรองเท้า
  const updateShoe = async (id, shoeData) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('shoes')
        .update({
          code: shoeData.code,
          name: shoeData.name,
          model: shoeData.model || null,
          color_code: shoeData.colorCode || null,
          season: shoeData.season || null,
          location: shoeData.location || null,
          max_qty: shoeData.maxQty || 1,
          image_url: shoeData.image || null
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      await fetchShoes();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ลบรองเท้า (soft delete)
  const deleteShoe = async (id) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('shoes')
        .update({ is_active: false })
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      await fetchShoes();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ค้นหารองเท้า
  const searchShoes = async (query) => {
    if (!query || query.trim().length < 2) {
      return shoes;
    }
    
    try {
      const { data, error: searchError } = await supabase
        .from('shoes')
        .select('*')
        .eq('is_active', true)
        .or(`code.ilike.%${query}%,name.ilike.%${query}%,model.ilike.%${query}%,location.ilike.%${query}%`);

      if (searchError) throw searchError;
      
      return data.map(shoe => ({
        id: shoe.id,
        code: shoe.code,
        name: shoe.name,
        model: shoe.model,
        colorCode: shoe.color_code,
        season: shoe.season,
        location: shoe.location,
        maxQty: shoe.max_qty,
        currentQty: shoe.current_qty,
        image: shoe.image_url
      }));
    } catch (err) {
      console.error('Error searching shoes:', err);
      return [];
    }
  };

  return {
    shoes,
    loading,
    error,
    fetchShoes,
    addShoe,
    updateShoe,
    deleteShoe,
    searchShoes
  };
};
