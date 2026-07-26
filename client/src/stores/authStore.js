import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get('/auth/me');
      
      // Temporarily force admin role on frontend
      if (data.data) {
        data.data.role = 'admin';
      }
      
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
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
    } catch (error) {
      set({ isLoading: false });
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
