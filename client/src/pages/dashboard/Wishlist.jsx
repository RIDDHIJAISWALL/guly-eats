import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, HeartOff, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import PlaceCard from '@/components/explore/PlaceCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const Wishlist = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('places');

  const { data: wishlist, isLoading, refetch } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/users/wishlist');
      return data.data;
    }
  });

  const handleRemove = async (id, type) => {
    try {
      await api.post('/users/wishlist', { itemId: id, itemType: type });
      refetch();
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  const currentItems = activeTab === 'places' ? wishlist?.places : wishlist?.famousPlaces;

  const tabs = [
    { id: 'places', label: 'Food & Restaurants' },
    { id: 'famousPlaces', label: 'Famous Places' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{
          fontSize: '28px', fontWeight: 900, color: '#1A1A2E',
          fontFamily: 'var(--font-heading)', margin: 0, letterSpacing: '-0.5px',
        }}>My Wishlist</h1>
        <p style={{ fontSize: '15px', color: '#8B8B9E', margin: '6px 0 0', fontWeight: 500 }}>
          Places you've saved to visit later.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        backgroundColor: '#F0F0F5',
        padding: '4px',
        borderRadius: '14px',
        width: 'fit-content',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: activeTab === tab.id ? '#FFFFFF' : '#5A5A6E',
              backgroundColor: activeTab === tab.id ? '#FF6B2B' : 'transparent',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(255,107,43,0.3)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-40 rounded-3xl" />)}
        </div>
      ) : currentItems?.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {currentItems.map(item => (
            <div key={item._id} style={{ position: 'relative' }} className="group">
              <PlaceCard
                place={item}
                onSelect={() => navigate(`/cities/${item.city?.slug}/${activeTab === 'places' ? 'places' : 'famous'}/${item.slug}`)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item._id, activeTab);
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  opacity: 0,
                }}
                className="group-hover:!opacity-100"
                title="Remove from wishlist"
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <HeartOff size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '2px dashed #E8E8F0',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#FFF0E8', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px', color: '#FF6B2B',
          }}>
            <Heart size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
            No places saved yet
          </h3>
          <p style={{ fontSize: '14px', color: '#8B8B9E', margin: '0 0 24px' }}>
            Explore cities and click the heart icon to save places here.
          </p>
          <button
            onClick={() => navigate('/cities')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px', border: 'none',
              fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-heading)',
              color: '#FFFFFF', background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,43,0.3)',
            }}
          >
            <Compass size={18} /> Explore Cities
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
