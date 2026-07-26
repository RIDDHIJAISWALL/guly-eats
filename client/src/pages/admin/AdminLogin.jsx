import { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import SEOHead from '@/components/common/SEOHead';

const AdminLogin = () => {
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [adminError, setAdminError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (adminError) setAdminError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      // The store gets the user details, we need to check if they are admin
      const user = useAuthStore.getState().user;
      if (user && user.role !== 'admin') {
        setAdminError('Access Denied. You do not have administrator privileges.');
        useAuthStore.getState().logout();
      }
    }
  };

  return (
    <>
      <SEOHead title="Admin Portal - Guly Eats" />
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Background Decor */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(255,107,43,0.15) 0%, rgba(15,23,42,0) 70%)',
          borderRadius: '50%', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(15,23,42,0) 70%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '40px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #FF6B2B, #FF9A5C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(255,107,43,0.4)',
            }}>
              <Shield size={32} />
            </div>
            <h1 style={{
              fontSize: '28px', fontWeight: 800, color: '#FFFFFF',
              fontFamily: 'var(--font-heading)', margin: '0 0 8px 0'
            }}>Admin Portal</h1>
            <p style={{ color: '#94A3B8', fontSize: '15px', margin: 0 }}>
              Sign in with your administrator credentials to access the control panel.
            </p>
          </div>

          {(error || adminError) && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px', padding: '14px 16px',
              marginBottom: '24px', color: '#FCA5A5',
              fontSize: '14px', fontWeight: 500,
              display: 'flex', alignItems: 'flex-start', gap: '10px'
            }}>
              <Shield size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{adminError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#E2E8F0', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                  style={{
                    width: '100%', padding: '14px 16px 14px 46px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', color: '#FFFFFF',
                    fontSize: '15px', outline: 'none', transition: 'all 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B2B'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#E2E8F0', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 16px 14px 46px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', color: '#FFFFFF',
                    fontSize: '15px', outline: 'none', transition: 'all 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B2B'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '16px', marginTop: '8px',
                background: 'linear-gradient(135deg, #FF6B2B, #FF8243)',
                color: '#FFFFFF', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 8px 20px rgba(255,107,43,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isLoading ? 'Verifying...' : (
                <>Access Dashboard <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#94A3B8', fontSize: '14px', textDecoration: 'none',
              fontWeight: 500, transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
            >
              <Home size={16} /> Back to main website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
