import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Map, Heart, User } from 'lucide-react';
import useAuthStore from '@/stores/authStore';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/cities', icon: Search, label: 'Explore' },
  { path: '/explore-near-me', icon: Map, label: 'Map' },
  { path: '/dashboard/wishlist', icon: Heart, label: 'Saved', requiresAuth: true },
  { path: '/dashboard', icon: User, label: 'Profile', requiresAuth: true },
];

const MobileNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const visibleItems = navItems.map((item) => {
    if (item.requiresAuth && !isAuthenticated) {
      // Replace auth-required items with login for guests
      if (item.label === 'Saved') return { ...item, path: '/login', label: 'Saved' };
      if (item.label === 'Profile') return { ...item, path: '/login', label: 'Login' };
    }
    return item;
  });

  return (
    <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.path || 
          (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;

        return (
          <NavLink
            key={item.label}
            to={item.path}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 relative"
            style={{ minWidth: '56px' }}
          >
            <div className="relative">
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              />
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </div>
            <span
              className="text-[10px] font-medium"
              style={{
                fontFamily: 'var(--font-heading)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
