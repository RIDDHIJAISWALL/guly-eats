import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Search
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  // Map view toggle
  isMapView: false,
  setMapView: (isMapView) => set({ isMapView }),
  toggleMapView: () => set((s) => ({ isMapView: !s.isMapView })),
}));

export default useUIStore;
