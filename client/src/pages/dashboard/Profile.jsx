import { useState } from 'react';
import { Camera, Save, Lock, User, Shield, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import api from '@/lib/api';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar ? `http://localhost:5000${user.avatar}` : null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (avatar) {
        formData.append('avatar', avatar);
      }
      const { data } = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password' });
    }
  };

  // Shared input styles
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E8E8F0',
    backgroundColor: '#FAFAFC',
    fontSize: '15px',
    fontWeight: 500,
    color: '#1A1A2E',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const inputFocusStyle = {
    borderColor: '#FF6B2B',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 0 4px rgba(255, 107, 43, 0.08)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#5A5A6E',
    marginBottom: '8px',
    fontFamily: 'var(--font-heading)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #F0F0F5',
    overflow: 'hidden',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ─── Page Header ─── */}
      <div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#1A1A2E',
          fontFamily: 'var(--font-heading)',
          margin: 0,
          letterSpacing: '-0.5px',
        }}>Account Settings</h1>
        <p style={{
          fontSize: '15px',
          color: '#8B8B9E',
          margin: '6px 0 0',
          fontWeight: 500,
        }}>Manage your profile and security preferences.</p>
      </div>

      {/* ─── Profile Card ─── */}
      <div style={cardStyle}>
        {/* Card Header with gradient accent */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid #F0F0F5',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#FFF0E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF6B2B',
          }}>
            <User size={20} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#1A1A2E',
              fontFamily: 'var(--font-heading)',
              margin: 0,
            }}>Personal Information</h2>
            <p style={{ fontSize: '13px', color: '#8B8B9E', margin: '2px 0 0' }}>Update your name and profile photo</p>
          </div>
        </div>

        {/* Card Body */}
        <form onSubmit={handleProfileSubmit}>
          <div style={{ padding: '28px' }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              
              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  backgroundColor: '#F5F5FA',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                }}>
                  {preview ? (
                    <img src={preview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '42px',
                      fontWeight: 900,
                      color: '#FF6B2B',
                      fontFamily: 'var(--font-heading)',
                      background: 'linear-gradient(135deg, #FFF0E8, #FFE4D4)',
                    }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                  >
                    <Camera size={24} />
                    <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Change</span>
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#A0A0B0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>Profile Photo</span>
              </div>

              {/* Fields */}
              <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E8E8F0';
                      e.target.style.backgroundColor = '#FAFAFC';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      style={{
                        ...inputStyle,
                        backgroundColor: '#F0F0F5',
                        color: '#8B8B9E',
                        cursor: 'not-allowed',
                        paddingRight: '40px',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#C0C0CC',
                    }}>
                      <Lock size={16} />
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#B0B0BB', margin: '6px 0 0 2px' }}>Email cannot be changed for security reasons.</p>
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div style={{
                marginTop: '20px',
                padding: '14px 18px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                color: message.type === 'success' ? '#059669' : '#DC2626',
                border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
              }}>
                {message.text}
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div style={{
            padding: '18px 28px',
            borderTop: '1px solid #F0F0F5',
            backgroundColor: '#FAFAFC',
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
                cursor: isSaving ? 'wait' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(255, 107, 43, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 43, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 107, 43, 0.3)';
              }}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* ─── Security Card ─── */}
      <div style={cardStyle}>
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid #F0F0F5',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#1A1A2E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#1A1A2E',
              fontFamily: 'var(--font-heading)',
              margin: 0,
            }}>Security</h2>
            <p style={{ fontSize: '13px', color: '#8B8B9E', margin: '2px 0 0' }}>Change your password to keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          <div style={{ padding: '28px', maxWidth: '480px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E8E8F0';
                      e.target.style.backgroundColor = '#FAFAFC';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#B0B0BB', padding: '4px',
                    }}
                  >
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E8E8F0';
                      e.target.style.backgroundColor = '#FAFAFC';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#B0B0BB', padding: '4px',
                    }}
                  >
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {passwordMessage && (
              <div style={{
                marginTop: '20px',
                padding: '14px 18px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: passwordMessage.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                color: passwordMessage.type === 'success' ? '#059669' : '#DC2626',
                border: `1px solid ${passwordMessage.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
              }}>
                {passwordMessage.text}
              </div>
            )}
          </div>

          <div style={{
            padding: '18px 28px',
            borderTop: '1px solid #F0F0F5',
            backgroundColor: '#FAFAFC',
          }}>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '12px',
                border: '1.5px solid #1A1A2E',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: '#1A1A2E',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A2E';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#1A1A2E';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Lock size={16} />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
