import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, LogOut, Shield, ChevronDown } from 'lucide-react';
import useAuthStore from '@/stores/authStore';


const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isProfileOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/cities', label: 'Cities' },
    { path: '/trips/plan', label: 'Day Trips' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="navbar-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: isScrolled
          ? 'rgba(255, 248, 240, 0.85)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: isScrolled
          ? '1px solid rgba(0,0,0,0.06)'
          : '1px solid transparent',
        boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}>

          {/* ─── Logo ─── */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            className="group"
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
              className="group-hover:scale-110"
            >
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Handle */}
                <path d="M10 26 L16 26 L20 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Poles */}
                <rect x="23" y="16" width="2.5" height="18" fill="currentColor" />
                <rect x="43" y="16" width="2.5" height="18" fill="currentColor" />

                {/* Items on counter */}
                {/* Green Bowl */}
                <path d="M26 27 C 26 33, 34 33, 34 27 Z" fill="#4B8B79" />
                {/* Brown block */}
                <rect x="36" y="27" width="4" height="5" fill="#8C5A3C" rx="1" />
                {/* Grey block */}
                <rect x="42" y="22" width="5.5" height="10" fill="#82828C" rx="1" />

                {/* Awning */}
                <path d="M14 16 L17 6 H49 L52 16" fill="var(--color-primary)" />
                <path d="M14 16 A 4.75 4.75 0 0 0 23.5 16 A 4.75 4.75 0 0 0 33 16 A 4.75 4.75 0 0 0 42.5 16 A 4.75 4.75 0 0 0 52 16" fill="var(--color-primary)" />

                {/* Cart Body Base */}
                <path d="M20 32 H48 C50.2091 32 52 33.7909 52 36 V48 C52 50.2091 50.2091 52 48 52 H20 V32 Z" fill="currentColor" />

                {/* Speed lines */}
                <rect x="14" y="36" width="16" height="3.5" rx="1.75" fill="currentColor" />
                <rect x="8" y="42" width="26" height="3.5" rx="1.75" fill="currentColor" />
                <rect x="16" y="48" width="16" height="3.5" rx="1.75" fill="currentColor" />

                {/* Leg */}
                <path d="M48 52 L50 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

                {/* Wheel */}
                <circle cx="35" cy="54" r="10" fill="var(--color-primary)" stroke="var(--color-background)" strokeWidth="2.5" />
                <circle cx="35" cy="54" r="3.5" fill="var(--color-background)" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '26px',
                fontWeight: 900,
                letterSpacing: '0.5px',
                color: 'var(--color-primary)',
                lineHeight: '1',
              }}>
                GULY EATS
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '4px',
                color: 'var(--color-text)',
                marginTop: '4px',
                paddingLeft: '2px'
              }}>SINCE 2026</span>
            </div>
          </Link>

          {/* ─── Desktop Nav Links ─── */}
          <div
            className="desktop-nav"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '36px',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  position: 'relative',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  textDecoration: 'none',
                  color: isActive(link.path)
                    ? 'var(--color-text)'
                    : 'var(--color-text-secondary)',
                  transition: 'color 0.25s ease',
                  padding: '8px 0',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }
                }}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navIndicator"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      boxShadow: '0 0 10px rgba(255,107,43,0.6)',
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ─── Right Actions ─── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

            {/* Auth Section */}
            {isAuthenticated ? (
              // ... Auth dropdown (unchanged)
              <div className="profile-dropdown" style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px 4px 4px',
                    borderRadius: '50px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-primary)',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#fff',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown
                    size={14}
                    style={{
                      color: 'var(--color-text-muted)',
                      transition: 'transform 0.2s',
                      transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '52px',
                        width: '240px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                        transformOrigin: 'top right',
                      }}
                    >
                      <div style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--color-border-light)',
                        backgroundColor: 'rgba(0,0,0,0.02)',
                      }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--color-text)',
                          fontFamily: 'var(--font-heading)',
                          margin: 0,
                        }}>{user?.name}</p>
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--color-text-muted)',
                          margin: '2px 0 0 0',
                        }}>{user?.email}</p>
                      </div>

                      <div style={{ padding: '6px' }}>
                        {[
                          { to: '/dashboard', icon: <User size={16} />, label: 'Dashboard' },
                          { to: '/dashboard/wishlist', icon: <Heart size={16} />, label: 'Wishlist' },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: 'var(--color-text-secondary)',
                              textDecoration: 'none',
                              transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
                              e.currentTarget.style.color = 'var(--color-text)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--color-text-secondary)';
                            }}
                          >
                            {item.icon} {item.label}
                          </Link>
                        ))}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Shield size={16} /> Admin Panel
                          </Link>
                        )}
                      </div>

                      <div style={{
                        padding: '6px',
                        borderTop: '1px solid var(--color-border-light)',
                      }}>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#EF4444',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="auth-buttons" style={{
                display: 'none',
                alignItems: 'center',
                gap: '24px',
                marginLeft: '16px',
              }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    background: 'linear-gradient(135deg, var(--color-primary), #FF8F50)',
                    padding: '10px 24px',
                    borderRadius: '100px',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 14px rgba(255, 107, 43, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 43, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 107, 43, 0.3)';
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
              className="mobile-toggle"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                transition: 'all 0.2s ease',
              }}
            >
              {isMobileOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
            </button>
          </div>
        </nav>
      </div>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              overflow: 'hidden',
              backgroundColor: theme === 'dark' ? 'rgba(15, 15, 26, 0.98)' : 'rgba(255, 248, 240, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 24px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      style={{
                        display: 'block',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-heading)',
                        textDecoration: 'none',
                        color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text)',
                        backgroundColor: isActive(link.path)
                          ? 'var(--color-primary-light)'
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border-light)',
                  }}
                >
                  <Link
                    to="/login"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: 'var(--color-text)',
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: '#FFFFFF',
                      backgroundColor: 'var(--color-primary)',
                      boxShadow: '0 2px 10px rgba(255, 107, 43, 0.25)',
                    }}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
