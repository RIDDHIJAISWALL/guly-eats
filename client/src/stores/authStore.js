import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get('/auth/me');
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (_error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.data, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || (error.message === 'Network Error' ? 'Server is offline. Please restart your backend server.' : 'Login failed');
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/register', { name, email, password });
      set({ user: data.data, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || (error.message === 'Network Error' ? 'Server is offline. Please restart your backend server.' : 'Registration failed');
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await api.get('/auth/logout');
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (_error) {
      set({ isLoading: false });
      set({ user: null, isAuthenticated: false });
    }
  },

  toggleWishlist: async (itemId, itemType) => {
    try {
      const { data } = await api.post('/users/wishlist', { itemId, itemType });
      set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, wishlist: data.data } };
      });
      return true;
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
