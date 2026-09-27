import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, Map, Navigation, Edit2, Plus, X, Search, Coffee, ChevronLeft, Image as ImageIcon } from 'lucide-react';
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
        if (type === 'cities') refetchCities();
        if (type === 'places') refetchPlaces();
        if (type === 'famous') refetchFamous();
        if (type === 'foods') refetchFoods();
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

      if (modalType === 'cities') refetchCities();
      if (modalType === 'places') refetchPlaces();
      if (modalType === 'famous') refetchFamous();
      if (modalType === 'foods') refetchFoods();
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
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '16px 24px',
          fontSize: '14px', fontWeight: isActive ? 800 : 600,
          fontFamily: 'var(--font-heading)',
          color: isActive ? '#1A1A2E' : '#8B8B9E',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: isActive ? '2px solid #FF6B2B' : '2px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#1A1A2E'; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#8B8B9E'; }}
      >
        <div style={{ color: isActive ? '#FF6B2B' : '#A0A0B0', display: 'flex' }}>{icon}</div>
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Master View (Cities Grid) */}
      {!selectedCity ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{
                fontSize: '28px', fontWeight: 900, color: '#1A1A2E',
                fontFamily: 'var(--font-heading)', margin: 0, letterSpacing: '-0.5px'
              }}>Content Management</h1>
              <p style={{
                fontSize: '15px', color: '#8B8B9E', margin: '6px 0 0', fontWeight: 500
              }}>Select a city to manage its underlying Food, Places, and Destinations.</p>
            </div>
            <button
              onClick={() => openAddModal('cities')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                borderRadius: '12px', border: '1.5px solid #1A1A2E',
                fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                color: '#FFFFFF', backgroundColor: '#1A1A2E', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#1A1A2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1A1A2E'; e.currentTarget.style.color = '#FFFFFF'; }}
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
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F0F0F5',
                  overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(26,26,46,0.06)'; e.currentTarget.style.borderColor = '#E8E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F0F0F5'; }}
                className="group"
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
                <div style={{ padding: '20px 16px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1A1A2E', fontFamily: 'var(--font-heading)', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.name}</h3>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#8B8B9E', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {city.tagline || 'No tagline provided'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <button
                onClick={() => setSelectedCity(null)}
                style={{
                  padding: '10px', borderRadius: '12px', border: '1px solid #E8E8F0',
                  backgroundColor: '#FFFFFF', color: '#5A5A6E', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', marginTop: '4px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B2B'; e.currentTarget.style.color = '#FF6B2B'; e.currentTarget.style.backgroundColor = '#FFF4F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E8F0'; e.currentTarget.style.color = '#5A5A6E'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <div>
                <h1 style={{
                  fontSize: '28px', fontWeight: 900, color: '#1A1A2E',
                  fontFamily: 'var(--font-heading)', margin: 0, letterSpacing: '-0.5px'
                }}>{selectedCity.name}</h1>
                <p style={{
                  fontSize: '15px', color: '#8B8B9E', margin: '6px 0 0', fontWeight: 500
                }}>Managing content linked to {selectedCity.name}.</p>
              </div>
            </div>

            <button
              onClick={() => openAddModal(activeTab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                borderRadius: '12px', border: '1.5px solid #1A1A2E',
                fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                color: '#FFFFFF', backgroundColor: '#1A1A2E', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#1A1A2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1A1A2E'; e.currentTarget.style.color = '#FFFFFF'; }}
            >
              <Plus size={18} /> Add {activeTab === 'famous' ? 'Destination' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
            </button>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '20px',
            border: '1px solid #F0F0F5', overflow: 'hidden',
            display: 'flex', flexDirection: 'column'
          }}>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto px-2">
              <TabButton id="places" label="Food Places" icon={<Map size={18} />} />
              <TabButton id="famous" label="Famous Destinations" icon={<Navigation size={18} />} />
              <TabButton id="foods" label="Local Foods" icon={<Coffee size={18} />} />
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <div style={{ position: 'relative', width: '100%', maxWidth: '384px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#A0A0B0', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
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
            </div>

            {/* Table Content */}
            <div style={{ overflowX: 'auto', minHeight: '400px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5' }}>Item Name</th>
                    <th style={{ padding: '16px 28px', fontSize: '11px', fontWeight: 700, color: '#A0A0B0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #F0F0F5', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'places' && (
                    loadingPlaces ? (
                      <tr><td colSpan={3} className="p-6"><SkeletonLoader className="h-12 w-full rounded-xl" /></td></tr>
                    ) : places?.filter(p => p.city?._id === selectedCity._id && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(place => (
                      <tr key={place._id} style={{ borderBottom: '1px solid #F8F9FC', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAFAFC'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        <td style={{ padding: '16px 28px', fontSize: '15px', fontWeight: 800, color: '#1A1A2E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {place.images?.[0] ? (
                            <img src={place.images[0]} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A0B0' }}><ImageIcon size={20} /></div>
                          )}
                          {place.name}
                        </td>
                        <td style={{ padding: '16px 28px' }}><ActionButtons item={place} type="places" /></td>
                      </tr>
                    ))
                  )}

                  {activeTab === 'famous' && (
                    loadingFamous ? (
                      <tr><td colSpan={3} className="p-6"><SkeletonLoader className="h-12 w-full rounded-xl" /></td></tr>
                    ) : famous?.filter(f => f.city?._id === selectedCity._id && f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(place => (
                      <tr key={place._id} style={{ borderBottom: '1px solid #F8F9FC', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAFAFC'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        <td style={{ padding: '16px 28px', fontSize: '15px', fontWeight: 800, color: '#1A1A2E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {place.images?.[0] ? (
                            <img src={place.images[0]} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A0B0' }}><ImageIcon size={20} /></div>
                          )}
                          {place.name}
                        </td>
                        <td style={{ padding: '16px 28px' }}><ActionButtons item={place} type="famous" /></td>
                      </tr>
                    ))
                  )}

                  {activeTab === 'foods' && (
                    loadingFoods ? (
                      <tr><td colSpan={3} className="p-6"><SkeletonLoader className="h-12 w-full rounded-xl" /></td></tr>
                    ) : foods?.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(food => (
                      <tr key={food._id} style={{ borderBottom: '1px solid #F8F9FC', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAFAFC'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        <td style={{ padding: '16px 28px', fontSize: '15px', fontWeight: 800, color: '#1A1A2E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {food.image ? (
                            <img src={food.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A0B0' }}><ImageIcon size={20} /></div>
                          )}
                          {food.name}
                        </td>
                        <td style={{ padding: '16px 28px' }}><ActionButtons item={food} type="foods" /></td>
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
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  width: '100%', maxWidth: '500px', backgroundColor: '#FFFFFF', borderRadius: '24px',
                  boxShadow: '0 24px 48px rgba(26,26,46,0.15)', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                }}
              >

                {/* Modal Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #F0F0F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFC', flexShrink: 0 }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1A1A2E', fontFamily: 'var(--font-heading)', margin: 0 }}>
                    {modalMode === 'add' ? 'Create New' : 'Edit'} {modalType === 'cities' ? 'City' : modalType === 'famous' ? 'Destination' : modalType.charAt(0).toUpperCase() + modalType.slice(1, -1)}
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px', backgroundColor: '#FFFFFF', borderRadius: '50%', border: '1px solid #E8E8F0', color: '#8B8B9E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={18} strokeWidth={3} />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleModalSubmit} style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>Display Name</label>
                    <input
                      required type="text" value={currentItem?.name || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#F8F9FC', border: '1.5px solid #E8E8F0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500, outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>
                      Media URL <span style={{ color: '#A0A0B0', fontWeight: 500 }}>(Optional)</span>
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
                        if (modalType === 'cities') setCurrentItem({ ...currentItem, coverImage: val });
                        else if (modalType === 'foods') setCurrentItem({ ...currentItem, image: val });
                        else setCurrentItem({ ...currentItem, images: [val] });
                      }}
                      style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#F8F9FC', border: '1.5px solid #E8E8F0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500, outline: 'none' }}
                    />
                  </div>

                  {modalType === 'cities' && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>Hero Tagline</label>
                        <input
                          type="text" value={currentItem?.tagline || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, tagline: e.target.value })}
                          style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#F8F9FC', border: '1.5px solid #E8E8F0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500, outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>State / Region</label>
                        <input
                          type="text" value={currentItem?.state || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, state: e.target.value })}
                          style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#F8F9FC', border: '1.5px solid #E8E8F0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500, outline: 'none' }}
                        />
                      </div>
                    </>
                  )}

                  {(modalType === 'places' || modalType === 'famous') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>Category Type</label>
                      <input
                        type="text" value={currentItem?.type || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#F8F9FC', border: '1.5px solid #E8E8F0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500, outline: 'none' }}
                      />
                    </div>
                  )}

                  <div style={{ paddingTop: '24px', marginTop: '8px', borderTop: '1px solid #F0F0F5', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#5A5A6E', backgroundColor: '#F8F9FC', border: '1px solid #E8E8F0', cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#FF6B2B', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,107,43,0.3)' }}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>

          </>
        )}
      </AnimatePresence>

    </div >
  );
};

export default ManageContent;
