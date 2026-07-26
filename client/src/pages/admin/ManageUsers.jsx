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
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end flex-wrap gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            User Management
          </h1>
          <p className="text-gray-500 font-medium">
            View, modify, and remove members from the platform.
          </p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center gap-4 flex-wrap">
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
          <div className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold shadow-sm">
            Total Users: <span className="text-primary ml-1">{users?.length || 0}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <SkeletonLoader key={i} className="h-16 rounded-2xl w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Member Details</th>
                  <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Role</th>
                  <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                  <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Joined</th>
                  <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user) => {
                  const isMe = currentUser._id === user._id;
                  const isSuperAdmin = user.email === SUPERADMIN_EMAIL;
                  const isAdmin = user.role === 'admin';
                  
                  return (
                  <tr key={user._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm ${isSuperAdmin ? 'bg-red-50 text-red-600' : isAdmin ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          {user.avatar ? (
                            <img src={`http://localhost:5000${user.avatar}`} alt={user.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2 mb-0.5">
                            {user.name}
                            {isMe && <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-black rounded-full tracking-wider">YOU</span>}
                            {isSuperAdmin && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full tracking-wider shadow-sm shadow-red-500/20">SUPER ADMIN</span>}
                          </div>
                          <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      {isSuperAdmin ? (
                        <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                          <Shield size={16} /> Super Admin
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              disabled={isMe}
                              className={`appearance-none font-bold text-sm px-4 py-1.5 pr-8 rounded-lg outline-none transition-colors border-2 ${isMe ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} ${isAdmin ? 'bg-purple-50 border-purple-100 text-purple-700 focus:border-purple-300' : 'bg-blue-50 border-blue-100 text-blue-700 focus:border-blue-300'}`}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            {/* Custom caret */}
                            <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isAdmin ? 'text-purple-400' : 'text-blue-400'}`}>
                              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                          {isAdmin ? <Shield size={18} className="text-purple-500" /> : <UserIcon size={18} className="text-blue-500" />}
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full w-fit border border-green-100 text-xs font-bold">
                        <CheckCircle2 size={14} /> Active
                      </div>
                    </td>

                    <td className="py-4 px-6 text-sm font-bold text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        {/* Reset Password Button */}
                        <button
                          onClick={() => openResetModal(user)}
                          className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                          title="Reset Password"
                        >
                          <Lock size={18} />
                        </button>

                        {/* Delete User Button */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={isSuperAdmin}
                          className={`p-2 rounded-xl shadow-sm transition-colors ${isSuperAdmin ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 cursor-pointer'}`}
                          title={isSuperAdmin ? "Cannot delete Super Admin" : "Delete User"}
                        >
                          <Trash2 size={18} />
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
      </motion.div>

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
