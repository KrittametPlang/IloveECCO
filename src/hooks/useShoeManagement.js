import { useState, useEffect } from 'react';
import { AVAILABLE_ITEMS } from '../data/mockData';

const STORAGE_KEY = 'shoe_inventory';

export const useShoeManagement = () => {
  const [shoes, setShoes] = useState([]);

  // Load shoes from localStorage or use default data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setShoes(JSON.parse(stored));
    } else {
      setShoes(AVAILABLE_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(AVAILABLE_ITEMS));
    }
  }, []);

  // Save to localStorage whenever shoes change
  const saveShoes = (newShoes) => {
    setShoes(newShoes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newShoes));
  };

  const addShoe = (shoeData) => {
    const newShoe = {
      ...shoeData,
      id: Date.now(),
    };
    const updated = [...shoes, newShoe];
    saveShoes(updated);
    return newShoe;
  };

  const updateShoe = (id, shoeData) => {
    const updated = shoes.map(shoe =>
      shoe.id === id ? { ...shoe, ...shoeData } : shoe
    );
    saveShoes(updated);
  };

  const deleteShoe = (id) => {
    const updated = shoes.filter(shoe => shoe.id !== id);
    saveShoes(updated);
  };

  const getShoeById = (id) => {
    return shoes.find(shoe => shoe.id === id);
  };

  const resetToDefault = () => {
    saveShoes(AVAILABLE_ITEMS);
  };

  return {
    shoes,
    addShoe,
    updateShoe,
    deleteShoe,
    getShoeById,
    resetToDefault
  };
};
