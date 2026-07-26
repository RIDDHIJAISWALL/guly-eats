import { useQuery } from '@tanstack/react-query';
import { Users, MapPin, Star, Map, ArrowUpRight, TrendingUp, Activity, UserPlus, Map as MapIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    }
  });

  const StatCard = ({ title, value, icon, bgClass, textClass, iconBgClass, link, trend, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {link ? (
        <Link to={link} className="absolute inset-0 z-10" aria-label={`View ${title}`}></Link>
      ) : null}

      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${bgClass} opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${iconBgClass} ${textClass} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100 shadow-sm">
            <TrendingUp size={14} /> {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-4xl font-black text-gray-900 leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
            {value}
          </h3>
          {link && (
            <div className="text-gray-300 group-hover:text-primary transition-colors mb-1">
              <ArrowUpRight size={20} strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-gray-900 mb-2" 
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            System Overview
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium"
          >
            Welcome back to the Admin Control Panel. Here's what's happening.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 px-5 py-2.5 bg-blue-50/50 rounded-full border border-blue-100 text-blue-700 text-sm font-bold shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          System Status: Optimal
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-48 rounded-3xl" />)}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value={data?.totalUsers || 0} 
              icon={<Users size={28} />}
              bgClass="bg-blue-500"
              iconBgClass="bg-gradient-to-br from-blue-500 to-indigo-600"
              textClass="text-white"
              trend="+12%"
              link="/admin/users"
              delay={0.1}
            />
            <StatCard 
              title="Food Places" 
              value={data?.totalPlaces || 0} 
              icon={<MapPin size={28} />}
              bgClass="bg-emerald-500"
              iconBgClass="bg-gradient-to-br from-emerald-500 to-teal-600"
              textClass="text-white"
              trend="+5%"
              link="/admin/content"
              delay={0.2}
            />
            <StatCard 
              title="Destinations" 
              value={data?.totalFamousPlaces || 0} 
              icon={<MapIcon size={28} />}
              bgClass="bg-purple-500"
              iconBgClass="bg-gradient-to-br from-purple-500 to-violet-600"
              textClass="text-white"
              link="/admin/content"
              delay={0.3}
            />
            <StatCard 
              title="User Reviews" 
              value={data?.totalReviews || 0} 
              icon={<Star size={28} />}
              bgClass="bg-amber-500"
              iconBgClass="bg-gradient-to-br from-amber-500 to-orange-500"
              textClass="text-white"
              trend="+24%"
              delay={0.4}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 pt-4">
            
            {/* Recent Users Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary">
                    <UserPlus size={20} />
                  </div>
                  Newest Members
                </h2>
                <Link to="/admin/users" className="flex items-center gap-1.5 text-primary text-sm font-bold hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors">
                  View Directory <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="pb-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Member Info</th>
                      <th className="pb-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Email Address</th>
                      <th className="pb-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentActivity?.map((user) => (
                      <tr key={user._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-500">{user.email}</td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-400 text-right">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                    {(!data?.recentActivity || data.recentActivity.length === 0) && (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-gray-500 font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mt-4">
                          No recent users found in the system.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
