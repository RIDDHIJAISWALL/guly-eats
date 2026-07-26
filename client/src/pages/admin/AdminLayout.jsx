import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Database, LogOut, ArrowLeft, Shield, Menu, X, Bell, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/stores/authStore';
import SEOHead from '@/components/common/SEOHead';
import AdminLogin from './AdminLogin';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  if (!user || user.role !== 'admin') {
    return <AdminLogin />;
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Manage Content', path: '/admin/content', icon: <Database size={20} /> },
    { name: 'User Directory', path: '/admin/users', icon: <Users size={20} /> },
  ];

  const pageTitle = navItems.find(item => 
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  )?.name || 'Admin Panel';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead title={`${pageTitle} - Admin Dashboard`} />

      {/* Sidebar - Desktop */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-[#0F172A] hidden lg:flex flex-col z-40 border-r border-white/10 overflow-y-auto">
        {/* Brand Area */}
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Guly Eats</h2>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin Hub</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Menu</p>
          {navItems.map((item) => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5 font-bold">
                  <div className={`${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
                    {item.icon}
                  </div>
                  {item.name}
                </div>
                {isActive && (
                  <motion.div layoutId="activeNav" className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all font-semibold text-sm">
              <ArrowLeft size={18} /> Back to App
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-semibold text-sm">
              <LogOut size={18} /> Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
          <div className="flex items-center justify-between h-20 px-4 md:px-8">
            
            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-200 text-gray-700"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <Shield size={24} className="text-primary" />
                <span className="font-black text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Admin</span>
              </div>
            </div>

            {/* Desktop Header Left */}
            <div className="hidden lg:flex items-center">
              <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {pageTitle}
              </h1>
            </div>

            {/* Header Right */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Quick search..."
                  className="w-64 bg-white border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>
              
              <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-primary transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-[280px] bg-[#0F172A] z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Shield size={24} className="text-primary" />
                  <span className="text-lg font-black text-white" style={{ fontFamily: 'var(--font-heading)' }}>Guly Eats</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <p className="px-4 text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Menu</p>
                {navItems.map((item) => {
                  const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold transition-colors ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="p-6 border-t border-white/10 space-y-2">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all font-semibold">
                  <ArrowLeft size={18} /> Back to App
                </Link>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-semibold">
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
