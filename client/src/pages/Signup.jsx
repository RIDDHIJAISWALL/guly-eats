import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../stores/authStore';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import useThemeStore from '../stores/themeStore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) navigate('/');
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
    color: 'var(--color-text)',
    fontSize: '15px',
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--color-primary)';
    e.target.style.boxShadow = '0 0 0 3px rgba(255,107,43,0.1)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-background)',
      padding: '100px 16px 40px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >


        {/* Card */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '20px',
          padding: '36px 32px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          boxShadow: isDark
            ? '0 20px 50px rgba(0,0,0,0.4)'
            : '0 20px 50px rgba(0,0,0,0.06)',
        }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 900, marginBottom: '6px',
            color: 'var(--color-text)', fontFamily: 'var(--font-heading)',
          }}>Create account</h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '28px' }}>
            Join us and discover amazing street food.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: '20px', padding: '12px 16px', borderRadius: '12px',
                backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444',
                fontSize: '14px', fontWeight: 600,
                border: '1px solid rgba(239,68,68,0.15)',
              }}
            >{error}</motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                Full Name
              </label>
              <input
                type="text" value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
                placeholder="John Doe" required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
                placeholder="you@example.com" required
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={handleFocus} onBlur={handleBlur}
                  placeholder="Min. 6 characters" minLength="6" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit" disabled={isLoading}
              style={{
                width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, var(--color-primary), #FF8F50)',
                color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginTop: '24px',
                boxShadow: '0 6px 20px rgba(255,107,43,0.3)',
                opacity: isLoading ? 0.7 : 1,
                fontFamily: 'inherit',
              }}
            >
              {isLoading ? (
                <span style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
