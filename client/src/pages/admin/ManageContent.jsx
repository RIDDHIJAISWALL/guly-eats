import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, MapPin, Map, Navigation, Edit2, Plus, X, Search, Coffee, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const ManageContent = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState('places');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [modalType, setModalType] = useState('cities');

  const { data: cities, isLoading: loadingCities, refetch: refetchCities } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: async () => {
      const { data } = await api.get('/cities');
      return data.data;
    }
  });

  const { data: places, isLoading: loadingPlaces, refetch: refetchPlaces } = useQuery({
    queryKey: ['admin-places'],
    queryFn: async () => {
      const { data } = await api.get('/places?limit=100');
      return data.data;
    }
  });

  const { data: famous, isLoading: loadingFamous, refetch: refetchFamous } = useQuery({
    queryKey: ['admin-famous'],
    queryFn: async () => {
      const { data } = await api.get('/famous-places?limit=100');
      return data.data;
    }
  });

  const { data: foods, isLoading: loadingFoods, refetch: refetchFoods } = useQuery({
    queryKey: ['admin-foods'],
    queryFn: async () => {
      const { data } = await api.get('/foods?limit=100');
      return data.data;
    }
  });

  const openAddModal = (type) => {
    setModalType(type);
    setModalMode('add');
    setCurrentItem(type === 'cities' ? {} : { city: selectedCity?._id });
    setIsModalOpen(true);
  };

  const openEditModal = (item, type) => {
    setModalType(type);
    setModalMode('edit');
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      try {
        const endpoint = type === 'famous' ? 'famous-places' : type;
        await api.delete(`/${endpoint}/${id}`);
        if(type === 'cities') refetchCities();
        if(type === 'places') refetchPlaces();
        if(type === 'famous') refetchFamous();
        if(type === 'foods') refetchFoods();
      } catch (error) {
        alert(`Failed to delete ${type}. Error: ${error.message}`);
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = modalType === 'famous' ? 'famous-places' : modalType;
      if (modalMode === 'add') {
        await api.post(`/${endpoint}`, currentItem);
      } else {
        await api.put(`/${endpoint}/${currentItem._id}`, currentItem);
      }
      setIsModalOpen(false);
      
      if(modalType === 'cities') refetchCities();
      if(modalType === 'places') refetchPlaces();
      if(modalType === 'famous') refetchFamous();
      if(modalType === 'foods') refetchFoods();
    } catch (error) {
      alert(`Failed to save changes. Error: ${error.message}`);
    }
  };

  const ActionButtons = ({ item, type }) => (
    <div className="flex justify-end gap-2">
      <button 
        onClick={(e) => { e.stopPropagation(); openEditModal(item, type); }} 
        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
        title="Edit"
      >
        <Edit2 size={16} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); handleDelete(item._id, type); }} 
        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const TabButton = ({ id, label, icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => { setActiveTab(id); setSearchTerm(''); }}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap outline-none
          ${isActive ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}
        `}
      >
        <div className={isActive ? 'text-primary' : 'text-gray-400'}>{icon}</div>
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Master View (Cities Grid) */}
      {!selectedCity ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          
          <div className="flex justify-between items-end flex-wrap gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Content Management
              </h1>
              <p className="text-gray-500 font-medium">
                Select a city to manage its underlying Food, Places, and Destinations.
              </p>
            </div>
            <button 
              onClick={() => openAddModal('cities')} 
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:scale-105 transition-transform"
            >
              <Plus size={18} /> Add New City
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loadingCities ? (
              [1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-64 rounded-3xl" />)
            ) : cities?.map(city => (
              <motion.div 
                key={city._id} 
                layoutId={`city-${city._id}`}
                onClick={() => { setSelectedCity(city); setActiveTab('places'); setSearchTerm(''); }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="h-40 w-full relative bg-gray-100 overflow-hidden">
                  {city.coverImage ? (
                    <img 
                      src={city.coverImage} 
                      alt={city.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Actions inside header */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionButtons item={city} type="cities" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{city.name}</h3>
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {city.tagline || 'No tagline provided'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* Detail View (Tabs for Places/Famous/Foods) */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="flex justify-between items-start flex-wrap gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -z-10" />
            
            <div className="flex items-start gap-4">
              <button 
                onClick={() => setSelectedCity(null)} 
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm mt-1"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {selectedCity.name}
                </h1>
                <p className="text-gray-500 font-medium">
                  Managing content linked to {selectedCity.name}.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => openAddModal(activeTab)} 
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:scale-105 transition-transform"
            >
              <Plus size={18} /> Add {activeTab === 'famous' ? 'Destination' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto px-2">
              <TabButton id="places" label="Food Places" icon={<Map size={18} />} />
              <TabButton id="famous" label="Famous Destinations" icon={<Navigation size={18} />} />
              <TabButton id="foods" label="Local Foods" icon={<Coffee size={18} />} />
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <div className="relative w-full max-w-sm">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Item Name</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Details</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'places' && (
                    loadingPlaces ? (
                      <tr><td colSpan={3} className="p-6"><SkeletonLoader className="h-12 w-full rounded-xl" /></td></tr>
                    ) : places?.filter(p => p.city?._id === selectedCity._id && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(place => (
                      <tr key={place._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-4">
                          {place.images?.[0] ? (
                            <img src={place.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-300 flex items-center justify-center"><ImageIcon size={20}/></div>
                          )}
                          {place.name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider rounded-lg border border-blue-100">
                            {place.type}
                          </span>
                        </td>
                        <td className="py-4 px-6"><ActionButtons item={place} type="places" /></td>
                      </tr>
                    ))
                  )}

                  {activeTab === 'famous' && (
                    loadingFamous ? (
                      <tr><td colSpan={3} className="p-6"><SkeletonLoader className="h-12 w-full rounded-xl" /></td></tr>
                    ) : famous?.filter(f => f.city?._id === selectedCity._id && f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(place => (
                      <tr key={place._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-4">
                          {place.images?.[0] ? (
                            <img src={place.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-300 flex items-center justify-center"><ImageIcon size={20}/></div>
                          )}
                          {place.name}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-500 capitalize">{place.type || 'General'}</td>
                        <td className="py-4 px-6"><ActionButtons item={place} type="famous" /></td>
                      </tr>
                    ))
                  )}

                  {activeTab === 'foods' && (
                    loadingFoods ? (
                      <tr><td colSpan={3} className="p-6"><SkeletonLoader className="h-12 w-full rounded-xl" /></td></tr>
                    ) : foods?.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(food => (
                      <tr key={food._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-4">
                          {food.image ? (
                            <img src={food.image} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-300 flex items-center justify-center"><ImageIcon size={20}/></div>
                          )}
                          {food.name}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-500">{food.tags?.join(', ') || 'No tags'}</td>
                        <td className="py-4 px-6"><ActionButtons item={food} type="foods" /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* CRUD MODAL - Styled professionally */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  {modalMode === 'add' ? 'Create New' : 'Edit'} {modalType === 'famous' ? 'Destination' : modalType.charAt(0).toUpperCase() + modalType.slice(1, -1)}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm transition-colors">
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
              
              <form onSubmit={handleModalSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                  <input 
                    required type="text" value={currentItem?.name || ''} 
                    onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Media URL <span className="text-gray-400 font-medium">(Optional)</span>
                  </label>
                  <input 
                    type="text" placeholder="https://..."
                    value={
                      modalType === 'cities' ? (currentItem?.coverImage || '') : 
                      modalType === 'foods' ? (currentItem?.image || '') : 
                      (currentItem?.images?.[0] || '')
                    } 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (modalType === 'cities') setCurrentItem({...currentItem, coverImage: val});
                      else if (modalType === 'foods') setCurrentItem({...currentItem, image: val});
                      else setCurrentItem({...currentItem, images: [val]});
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                  />
                </div>
                
                {modalType === 'cities' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hero Tagline</label>
                      <input 
                        type="text" value={currentItem?.tagline || ''} 
                        onChange={(e) => setCurrentItem({...currentItem, tagline: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">State / Region</label>
                      <input 
                        type="text" value={currentItem?.state || ''} 
                        onChange={(e) => setCurrentItem({...currentItem, state: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                      />
                    </div>
                  </>
                )}

                {(modalType === 'places' || modalType === 'famous') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category Type</label>
                    <input 
                      type="text" value={currentItem?.type || ''} 
                      onChange={(e) => setCurrentItem({...currentItem, type: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                    />
                  </div>
                )}
                
                <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-orange-600 shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all">
                    Save Changes
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

export default ManageContent;
