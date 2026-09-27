import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { User, Heart, Map, MessageSquare, LogOut, Settings, Menu, X } from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import SEOHead from '@/components/common/SEOHead';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Profile Settings', path: '/dashboard', icon: <User size={18} />, exact: true },
    { name: 'My Wishlist', path: '/dashboard/wishlist', icon: <Heart size={18} /> },
    { name: 'My Itineraries', path: '/dashboard/itineraries', icon: <Map size={18} /> },
    { name: 'My Reviews', path: '/dashboard/reviews', icon: <MessageSquare size={18} /> },
  ];

  if (user.role === 'admin') {
    navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: <Settings size={18} /> });
  }

  return (
    <>
      <SEOHead title="My Dashboard - Guly Eats" />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: '#F8F9FC' }}>
        
        {/* ─── Sidebar ─── */}
        <aside style={{
          width: '280px',
          minWidth: '280px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #F0F0F5',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: '80px',
          height: 'calc(100vh - 80px)',
          overflowY: 'auto',
          zIndex: 30,
        }} className="dash-sidebar">
          
          {/* User Profile Card */}
          <div style={{
            padding: '28px 24px',
            borderBottom: '1px solid #F0F0F5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: user.avatar ? 'none' : 'linear-gradient(135deg, #FF6B2B, #FF9A5C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(255, 107, 43, 0.25)',
              }}>
                {user.avatar ? (
                  <img src={`http://localhost:5000${user.avatar}`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#1A1A2E',
                  fontFamily: 'var(--font-heading)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{user.name}</h3>
                <p style={{
                  fontSize: '13px',
                  color: '#8B8B9E',
                  margin: '2px 0 0 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '16px 12px', flex: 1 }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#A0A0B0',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              padding: '0 12px',
              margin: '0 0 8px 0',
            }}>Menu</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 600,
                    fontFamily: 'var(--font-heading)',
                    color: isActive ? '#FFFFFF' : '#5A5A6E',
                    backgroundColor: isActive ? '#FF6B2B' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(255, 107, 43, 0.3)' : 'none',
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = '#F5F5FA';
                      e.currentTarget.style.color = '#1A1A2E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#5A5A6E';
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div style={{ padding: '16px 12px', borderTop: '1px solid #F0F0F5' }}>
            <button
              onClick={() => logout()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-heading)',
                color: '#EF4444',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FEF2F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* ─── Mobile Header ─── */}
        <div
          className="dash-mobile-header"
          style={{
            position: 'fixed',
            top: '68px',
            left: 0,
            right: 0,
            zIndex: 40,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F0F0F5',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B2B, #FF9A5C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              overflow: 'hidden',
            }}>
              {user.avatar ? (
                <img src={`http://localhost:5000${user.avatar}`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', fontFamily: 'var(--font-heading)' }}>Dashboard</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid #F0F0F5',
              backgroundColor: '#FAFAFA',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5A5A6E',
            }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ─── Mobile Sidebar Overlay ─── */}
        {isSidebarOpen && (
          <>
            <div
              onClick={() => setIsSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                zIndex: 45,
              }}
              className="dash-mobile-overlay"
            />
            <div
              className="dash-mobile-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '300px',
                backgroundColor: '#FFFFFF',
                zIndex: 50,
                overflowY: 'auto',
                boxShadow: '4px 0 30px rgba(0,0,0,0.1)',
                paddingTop: '20px',
              }}
            >
              <div style={{ padding: '20px 20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #FF6B2B, #FF9A5C)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '18px', fontWeight: 800, overflow: 'hidden',
                  }}>
                    {user.avatar ? (
                      <img src={`http://localhost:5000${user.avatar}`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1A1A2E', margin: 0, fontFamily: 'var(--font-heading)' }}>{user.name}</h3>
                    <p style={{ fontSize: '12px', color: '#8B8B9E', margin: '2px 0 0' }}>{user.email}</p>
                  </div>
                </div>
              </div>

              <nav style={{ padding: '0 12px' }}>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setIsSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 14px', borderRadius: '12px',
                      fontSize: '15px', fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#fff' : '#5A5A6E',
                      backgroundColor: isActive ? '#FF6B2B' : 'transparent',
                      textDecoration: 'none', marginBottom: '2px',
                    })}
                  >
                    {item.icon} {item.name}
                  </NavLink>
                ))}
              </nav>

              <div style={{ padding: '16px 12px', borderTop: '1px solid #F0F0F5', marginTop: '16px' }}>
                <button onClick={() => logout()} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                  padding: '14px 14px', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                  color: '#EF4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                }}>
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </div>
          </>
        )}

        {/* ─── Main Content ─── */}
        <main style={{
          flex: 1,
          padding: '32px',
          overflowX: 'hidden',
          minWidth: 0,
        }} className="dashboard-main-content">
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
