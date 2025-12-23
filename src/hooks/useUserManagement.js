import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new user
  const addUser = async (userData) => {
    setError(null);
    
    try {
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          password: userData.password, // ในระบบจริงควร hash password
          fullname: userData.fullname,
          department: userData.department || null,
          phone: userData.phone || null,
          email: userData.email || null,
          is_active: true
        }])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Username นี้ถูกใช้งานแล้ว');
        }
        throw insertError;
      }

      setUsers(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    setError(null);
    
    try {
      const updateData = {
        fullname: userData.fullname,
        department: userData.department || null,
        phone: userData.phone || null,
        email: userData.email || null
      };

      // Only update password if provided
      if (userData.password) {
        updateData.password = userData.password;
      }

      // Only update username if provided
      if (userData.username) {
        updateData.username = userData.username;
      }

      const { data, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error('Username นี้ถูกใช้งานแล้ว');
        }
        throw updateError;
      }

      setUsers(prev => prev.map(u => u.id === id ? data : u));
      return { success: true, data };
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    setError(null);
    
    try {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setUsers(prev => prev.filter(u => u.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Toggle user active status
  const toggleUserActive = async (id, currentStatus) => {
    setError(null);
    
    try {
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setUsers(prev => prev.map(u => u.id === id ? data : u));
      return { success: true };
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserActive
  };
};
