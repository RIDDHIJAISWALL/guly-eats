import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, Shield, User as UserIcon, CheckCircle2, Search, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import useAuthStore from '@/stores/authStore';

const SUPERADMIN_EMAIL = 'riddhijaiswal1406@gmail.com';

const ManageUsers = () => {
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reset Password Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data.data;
    }
  });

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      refetch();
    } catch (error) {
      console.error("Failed to change role", error);
      alert(error.response?.data?.error || "Failed to change role.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Are you sure you want to delete this user completely? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${id}`);
        refetch();
      } catch (error) {
        console.error("Failed to delete user", error);
        alert(error.response?.data?.error || "Failed to delete user.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${resetTargetUser._id}/reset-password`, { newPassword });
      alert(`Password for ${resetTargetUser.name} has been successfully reset!`);
      setIsResetModalOpen(false);
      setNewPassword('');
    } catch (error) {
      alert(error.response?.data?.error || "Failed to reset password.");
    }
  };

  const openResetModal = (user) => {
    setResetTargetUser(user);
    setNewPassword('');
    setIsResetModalOpen(true);
  };

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        }}>User Management</h1>
        <p style={{
          fontSize: '15px',
          color: '#8B8B9E',
          margin: '6px 0 0',
          fontWeight: 500,
        }}>View, modify, and remove members from the platform.</p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #F0F0F5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Toolbar */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #F0F0F5', backgroundColor: '#FAFAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '384px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#A0A0B0', pointerEvents: 'none' }} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box', backgroundColor: '#FFFFFF', border: '1.5px solid #E8E8F0',
                borderRadius: '12px', padding: '12px 16px 12px 42px',
                fontSize: '14px', fontWeight: 600, color: '#1A1A2E',
                outline: 'none', transition: 'all 0.2s ease', boxShadow: '0 2px 6px rgba(26,26,46,0.02)'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E8E8F0'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(26,26,46,0.02)'; }}
            />
          </div>
          <div style={{
            padding: '8px 16px', backgroundColor: '#FFFFFF',
            border: '1px solid #F0F0F5', borderRadius: '12px',
            color: '#5A5A6E', fontSize: '13px', fontWeight: 700,
          }}>
            Total Users: <span style={{ color: '#3B82F6', marginLeft: '4px' }}>{users?.length || 0}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <SkeletonLoader key={i} className="h-16 rounded-2xl w-full" />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', minHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5' }}>Member Details</th>
                  <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5' }}>Role</th>
                  <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5' }}>Status</th>
                  <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5' }}>Joined</th>
                  <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user) => {
                  const isMe = currentUser._id === user._id;
                  const isSuperAdmin = user.email === SUPERADMIN_EMAIL;
                  const isAdmin = user.role === 'admin';
                  
                  return (
                  <tr key={user._id} style={{ borderBottom: '1px solid #F8F9FC', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAFAFC'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    
                    <td style={{ padding: '16px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '15px', fontWeight: 800,
                            backgroundColor: isSuperAdmin ? '#FEF2F2' : isAdmin ? '#F5F3FF' : '#EFF6FF',
                            color: isSuperAdmin ? '#DC2626' : isAdmin ? '#7C3AED' : '#2563EB'
                        }}>
                          {user.avatar ? (
                            <img src={`http://localhost:5000${user.avatar}`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A1A2E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            {user.name}
                            {isMe && <span style={{ padding: '2px 6px', backgroundColor: '#1A1A2E', color: '#FFFFFF', fontSize: '10px', fontWeight: 900, borderRadius: '50px', letterSpacing: '0.5px' }}>YOU</span>}
                            {isSuperAdmin && <span style={{ padding: '2px 6px', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '10px', fontWeight: 900, borderRadius: '50px', letterSpacing: '0.5px' }}>SUPER ADMIN</span>}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: '#8B8B9E' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px 28px' }}>
                      {isSuperAdmin ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 700, fontSize: '13px' }}>
                          <Shield size={16} /> Super Admin
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              disabled={isMe}
                              style={{
                                appearance: 'none',
                                fontSize: '13px', fontWeight: 700,
                                padding: '6px 32px 6px 12px',
                                borderRadius: '10px',
                                border: isAdmin ? '1.5px solid #E9D5FF' : '1.5px solid #DBEAFE',
                                backgroundColor: isAdmin ? '#F5F3FF' : '#EFF6FF',
                                color: isAdmin ? '#7C3AED' : '#2563EB',
                                outline: 'none',
                                cursor: isMe ? 'not-allowed' : 'pointer',
                                opacity: isMe ? 0.7 : 1,
                              }}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isAdmin ? '#A78BFA' : '#60A5FA' }}>
                              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                          {isAdmin ? <Shield size={16} color="#7C3AED" /> : <UserIcon size={16} color="#2563EB" />}
                        </div>
                      )}
                    </td>
                    
                    <td style={{ padding: '16px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#ECFDF5', color: '#059669', borderRadius: '50px', border: '1px solid #D1FAE5', width: 'max-content', fontSize: '12px', fontWeight: 700 }}>
                        <CheckCircle2 size={14} /> Active
                      </div>
                    </td>

                    <td style={{ padding: '16px 28px', fontSize: '13px', fontWeight: 600, color: '#8B8B9E' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    
                    <td style={{ padding: '16px 28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* Reset Password Button */}
                        <button
                          onClick={() => openResetModal(user)}
                          style={{
                            padding: '8px', borderRadius: '10px',
                            backgroundColor: '#FAFAFC', border: '1px solid #F0F0F5',
                            color: '#8B8B9E', cursor: 'pointer', transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.color = '#3B82F6'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FAFAFC'; e.currentTarget.style.color = '#8B8B9E'; e.currentTarget.style.borderColor = '#F0F0F5'; }}
                          title="Reset Password"
                        >
                          <Lock size={16} />
                        </button>

                        {/* Delete User Button */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={isSuperAdmin}
                          style={{
                            padding: '8px', borderRadius: '10px',
                            backgroundColor: '#FAFAFC', border: '1px solid #F0F0F5',
                            color: isSuperAdmin ? '#D4D4D8' : '#8B8B9E',
                            cursor: isSuperAdmin ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { if (!isSuperAdmin) { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#FECACA'; } }}
                          onMouseLeave={(e) => { if (!isSuperAdmin) { e.currentTarget.style.backgroundColor = '#FAFAFC'; e.currentTarget.style.color = '#8B8B9E'; e.currentTarget.style.borderColor = '#F0F0F5'; } }}
                          title={isSuperAdmin ? "Cannot delete Super Admin" : "Delete User"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
                {filteredUsers?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                        <Search size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No users found</h3>
                      <p className="text-gray-500 font-medium">Try adjusting your search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RESET PASSWORD MODAL */}
      <AnimatePresence>
        {isResetModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    Reset Password
                  </h2>
                  <p className="text-sm font-medium text-gray-500">For {resetTargetUser?.name}</p>
                </div>
                <button onClick={() => setIsResetModalOpen(false)} className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm transition-colors mt-1">
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
              
              <form onSubmit={handleResetPassword} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter new secure password"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                  />
                </div>
                
                <div className="pt-2 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsResetModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all">
                    Set Password
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageUsers;
