import { useQuery } from '@tanstack/react-query';
import { Users, MapPin, Star, Map as MapIcon, ChevronRight, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    }
  });

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #F0F0F5',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '24px 28px',
    borderBottom: '1px solid #F0F0F5',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  };

  const StatBox = ({ title, value, icon, link, trend, iconColor, iconBg }) => (
    <div style={{
      padding: '24px',
      border: '1px solid #F0F0F5',
      borderRadius: '16px',
      backgroundColor: '#FAFAFC',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)';
      e.currentTarget.style.backgroundColor = '#FFFFFF';
      e.currentTarget.style.borderColor = iconColor;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.backgroundColor = '#FAFAFC';
      e.currentTarget.style.borderColor = '#F0F0F5';
    }}
    >
      {link && <Link to={link} style={{ position: 'absolute', inset: 0, zIndex: 10 }} aria-label={`View ${title}`} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          backgroundColor: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 8px', borderRadius: '50px',
            backgroundColor: '#ECFDF5', color: '#059669',
            fontSize: '12px', fontWeight: 700,
          }}>
            <TrendingUp size={14} /> {trend}
          </div>
        )}
      </div>

      <div>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: 900, color: '#1A1A2E', fontFamily: 'var(--font-heading)', margin: 0 }}>
            {value}
          </h3>
          {link && (
            <div style={{ color: '#C0C0CC' }}>
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* ─── Page Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 900,
            color: '#1A1A2E',
            fontFamily: 'var(--font-heading)',
            margin: 0,
            letterSpacing: '-0.5px',
          }}>System Overview</h1>
          <p style={{
            fontSize: '15px',
            color: '#8B8B9E',
            margin: '6px 0 0',
            fontWeight: 500,
          }}>Welcome back to the Admin Control Panel.</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE', borderRadius: '50px',
          color: '#1D4ED8', fontSize: '13px', fontWeight: 700,
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} className="animate-pulse" />
          System Status: Optimal
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : (
        <>
          {/* ─── Key Metrics Card ─── */}
          <div style={cardStyle}>
            <div style={headerStyle}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                backgroundColor: '#EFF6FF', color: '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Activity size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E', fontFamily: 'var(--font-heading)', margin: 0 }}>Key Metrics</h2>
                <p style={{ fontSize: '13px', color: '#8B8B9E', margin: '2px 0 0' }}>Overview of the platform's current statistics</p>
              </div>
            </div>

            <div style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                <StatBox 
                  title="Total Users" 
                  value={data?.totalUsers || 0} 
                  icon={<Users size={24} />}
                  iconBg="#EFF6FF"
                  iconColor="#3B82F6"
                  trend="+12%"
                  link="/admin/users"
                />
                <StatBox 
                  title="Food Places" 
                  value={data?.totalPlaces || 0} 
                  icon={<MapPin size={24} />}
                  iconBg="#ECFDF5"
                  iconColor="#059669"
                  trend="+5%"
                  link="/admin/content"
                />
                <StatBox 
                  title="Destinations" 
                  value={data?.totalFamousPlaces || 0} 
                  icon={<MapIcon size={24} />}
                  iconBg="#F3E8FF"
                  iconColor="#9333EA"
                  link="/admin/content"
                />
                <StatBox 
                  title="User Reviews" 
                  value={data?.totalReviews || 0} 
                  icon={<Star size={24} />}
                  iconBg="#FFF7ED"
                  iconColor="#EA580C"
                  trend="+24%"
                />
              </div>
            </div>
          </div>

          {/* ─── Recent Users Card ─── */}
          <div style={cardStyle}>
            <div style={{ ...headerStyle, justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  backgroundColor: '#F5F3FF', color: '#8B5CF6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Users size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E', fontFamily: 'var(--font-heading)', margin: 0 }}>Newest Members</h2>
                  <p style={{ fontSize: '13px', color: '#8B8B9E', margin: '2px 0 0' }}>Recently registered users on the platform</p>
                </div>
              </div>
              <Link to="/admin/users" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                backgroundColor: '#F8F9FC', color: '#3B82F6',
                fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F8F9FC'; }}
              >
                View Directory <ChevronRight size={16} />
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5' }}>Member Info</th>
                    <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5' }}>Email Address</th>
                    <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5', textAlign: 'right' }}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentActivity?.map((user) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #F8F9FC', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAFAFC'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '16px 28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            backgroundColor: '#EFF6FF', color: '#3B82F6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: 800
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', fontFamily: 'var(--font-heading)' }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 28px', fontSize: '14px', fontWeight: 500, color: '#5A5A6E' }}>{user.email}</td>
                      <td style={{ padding: '16px 28px', fontSize: '13px', fontWeight: 600, color: '#8B8B9E', textAlign: 'right' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                  {(!data?.recentActivity || data.recentActivity.length === 0) && (
                    <tr>
                      <td colSpan={3} style={{ padding: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 500, color: '#8B8B9E', backgroundColor: '#FAFAFC' }}>
                        No recent users found in the system.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
