import { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_ASSETS,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_TICKETS,
} from '../data/mockData';

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [key, state]);

  return [state, setState];
}

export function useStore() {
  const [assets, setAssets] = useLocalStorage('parcit_assets', INITIAL_ASSETS);
  const [users, setUsers] = useLocalStorage('parcit_users', INITIAL_USERS);
  const [categories, setCategories] = useLocalStorage('parcit_categories', INITIAL_CATEGORIES);
  const [tickets, setTickets] = useLocalStorage('parcit_tickets', INITIAL_TICKETS);

  // Assets CRUD
  const addAsset = useCallback((asset) => {
    const newAsset = { ...asset, id: `ast-${Date.now()}` };
    setAssets(prev => [...prev, newAsset]);
    return newAsset;
  }, [setAssets]);

  const updateAsset = useCallback((id, updates) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, [setAssets]);

  const deleteAsset = useCallback((id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, [setAssets]);

  // Users CRUD
  const addUser = useCallback((user) => {
    const newUser = { ...user, id: `u-${Date.now()}`, dateCreation: new Date().toISOString().split('T')[0] };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [setUsers]);

  const updateUser = useCallback((id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, [setUsers]);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, [setUsers]);

  // Categories CRUD
  const addCategory = useCallback((cat) => {
    const newCat = { ...cat, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  }, [setCategories]);

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [setCategories]);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  // Tickets CRUD
  const addTicket = useCallback((ticket) => {
    const newTicket = { ...ticket, id: `tkt-${Date.now()}`, dateCreation: new Date().toISOString().split('T')[0] };
    setTickets(prev => [...prev, newTicket]);
    return newTicket;
  }, [setTickets]);

  const updateTicket = useCallback((id, updates) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTickets]);

  const deleteTicket = useCallback((id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  }, [setTickets]);

  const resetData = useCallback(() => {
    setAssets(INITIAL_ASSETS);
    setUsers(INITIAL_USERS);
    setCategories(INITIAL_CATEGORIES);
    setTickets(INITIAL_TICKETS);
  }, [setAssets, setUsers, setCategories, setTickets]);

  return {
    assets, addAsset, updateAsset, deleteAsset,
    users, addUser, updateUser, deleteUser,
    categories, addCategory, updateCategory, deleteCategory,
    tickets, addTicket, updateTicket, deleteTicket,
    resetData,
  };
}
